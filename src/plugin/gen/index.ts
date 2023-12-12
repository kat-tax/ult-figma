import {emit} from '@create-figma-plugin/utilities';
import {createIdentifierPascal, createIdentifierCamel} from 'common/string';
import {getComponentTargets, getComponentTarget, getPage} from 'plugin/fig/lib';
import {config} from 'plugin';
import {wait} from 'common/delay';
import {generateIndex} from './common/generateIndex';
import * as reactNative from './react-native';

import type {Settings} from 'types/settings';
import type {EventComponentBuild, EventProjectTheme} from 'types/events';
import type {ComponentAsset, ComponentData, ComponentLinks, ComponentRoster} from 'types/component';

export {generateIndex} from './common/generateIndex';

const _cache: Record<string, ComponentData> = {};

export async function generateBundle(
  node: ComponentNode,
  settings: Settings,
  skipCache?: boolean,
) {
  if (!node) return;

  const instanceSettings = {...settings};

  // Check cache
  if (!skipCache) {
    // Memory cache
    if (_cache[node.key]) {
      console.log('[cache/memory]', node.name);
      return {bundle: _cache[node.key], cached: true};
    }
    // Disk cache
    const data = node.getSharedPluginData('f2rn', 'data');
    if (data) {
      try {
        const bundle = JSON.parse(data) as ComponentData;
        console.log('[cache/disk]', node.name);
        _cache[node.key] = bundle;
        return {bundle, cached: true};
      } catch (e) {
        console.error('Failed to parse cached bundle', node, e);
      }
    }
  }

  console.log('[cache/hit]', node.name);

  let bundle: ComponentData;
  switch (settings?.react.flavor) {
    case 'react-native':
    default:
      bundle = await reactNative.generateBundle(node, instanceSettings);
  }

  _cache[node.key] = bundle;

  return {bundle, cached: false};
}

export function generateTheme(settings: Settings) {
  switch (settings?.react.flavor) {
    case 'react-native':
    default:
      return reactNative.generateTheme(settings);
  }
}

export function watchTheme(settings: Settings) {
  const updateTheme = () => {
    const {code, theme} = generateTheme(settings);
    if (!theme) return;
    const currentTheme = `${createIdentifierCamel(theme.current.name)}Theme`;
    emit<EventProjectTheme>('PROJECT_THEME', code, currentTheme);
  };
  setInterval(updateTheme, 300);
  updateTheme();
}

// Compile all components in background
export async function loadComponents(targetComponent: () => void) {
  const all = figma.root.findAllWithCriteria({types: ['COMPONENT']});
  const init = getComponentTargets(all);
  if (init.size > 0) {
    const cached = await compile(init);
    if (cached) {
      // Select targeted component since it's available now
      targetComponent();
      // Refresh component cache
      await compile(init, true);
    }
  }
}

export async function watchComponents() {
  figma.on('documentchange', async (e) => {
    console.log('[change]', e.documentChanges);
    // We need to get all components for the roster
    const all = figma.root.findAllWithCriteria({types: ['COMPONENT']});
    const init = getComponentTargets(all);
    // No components, do nothing
    if (init.size === 0) return;
    // Get all components that were updated
    const updates: SceneNode[] = [];
    e.documentChanges.forEach(change => {
      // Ignore events that aren't relevant
      if (change.type !== 'CREATE'
        && change.type !== 'PROPERTY_CHANGE')
          return;
      // Ignore events only effecting pluginData
      if (change.type === 'PROPERTY_CHANGE'
        && change.properties.includes('pluginData'))
          return;
      // TODO: track deletions
      if (change.node.removed)
        return;
      // Queue component to update
      if (change.node.type === 'COMPONENT') {
        updates.push(change.node as SceneNode);
      } else {
        const target = getComponentTarget(change.node as SceneNode);
        if (target) {
          updates.push(target);
        }
      }
    });

    // No updates, do nothing
    if (updates.length === 0) return;

    // Get updated targets and compile
    const update = getComponentTargets(updates);
    await compile(init, true, update);
    console.log('[update]', Array.from(update));
  });
}

export async function compile(
  components: Set<ComponentNode>,
  skipCache?: boolean,
  updated?: Set<ComponentNode>,
) {
  const _names = new Set<string>();
  const _iconsSets = new Set<string>();
  const _iconsUsed = new Set<string>();
  const _iconsList = new Set<string>();
  const _iconsMap = new Map<string, string>();
  const _assets: Record<string, ComponentAsset> = {};
  const _roster: ComponentRoster = {};
  let _links: ComponentLinks = {};

  let _total = 0;
  let _loaded = 0;
  let _cached = false;

  for await (const component of components) {
    if (component.name.startsWith('ph:')) continue;
    const isVariant = !!(component as SceneNode & VariantMixin).variantProperties;
    const masterNode = (isVariant ? component?.parent : component);
    const imageExport = false; // TODO: await (masterNode as ComponentNode).exportAsync({format: 'PNG'});
    const preview = imageExport ? `data:image/png;base64,${figma.base64Encode(imageExport)}` : '';
    const name = createIdentifierPascal(masterNode.name);
    const page = getPage(masterNode).name;
    const id = masterNode.id;
    _total++;
    _names.add(name);
    _roster[name] = {
      id,
      name,
      page,
      preview,
      loading: !skipCache,
    };
  }

  const index = generateIndex(_names, config.state, true);
  const targets = updated || components;

  for await (const component of targets) {
    wait(1); // Prevent UI from freezing
    if (component.name.startsWith('ph:')) continue;
    try {
      // Compile component
      const {bundle, cached} = await generateBundle(component, config.state, skipCache);

      // Derive data
      const {id, page, name, links, icons, assets} = bundle;
      const pages = figma.root.children?.map(p => p.name);

      // Aggregate data
      _loaded++;
      _cached = cached;
      _links = {..._links, ...links};
      _cache[component.id] = bundle;
      _roster[name] = {
        ..._roster[name],
        id,
        name,
        page,
        loading: false,
      };

      // Aggregate assets and icons
      Object.entries(icons?.map)?.map(([icon, nodeId]) => {
        _iconsMap.set(icon, nodeId);
      });
      icons?.list?.forEach(icon => {
        _iconsList.add(icon);
        _iconsSets.add(icon.split(':')[0]);
      });
      icons?.used?.forEach(icon => {
        _iconsUsed.add(icon);
      });
      assets?.forEach(asset => {
        _assets[asset.hash] = asset;
      });
      
      // Cache compilation to disk
      component.setSharedPluginData('f2rn', 'data', JSON.stringify(bundle));

      // Send compilation to interface
      emit<EventComponentBuild>('COMPONENT_BUILD', {
        index,
        pages,
        links: _links,
        total: _total,
        loaded: _loaded,
        roster: _roster,
        assets: _assets,
        assetMap: {},
        icons: {
          sets: Array.from(_iconsSets),
          used: Array.from(_iconsUsed),
          list: Array.from(_iconsList),
          map: Object.fromEntries(_iconsMap),
        },
      }, bundle);

      // console.log('[compile]', name, bundle);
    } catch (e) {
      console.error('Failed to export', component, e);
    }
  }

  return _cached;
}
