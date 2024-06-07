import {createIdentifierPascal, createIdentifierCamel} from 'common/string';
import {getPage, getSection} from './traverse';
import type {ComponentInfo} from 'types/component';

export function getComponentInfo(node: BaseNode): ComponentInfo | null {
  if (node.type !== 'COMPONENT'
    && node.type !== 'INSTANCE'
    && node.type !== 'COMPONENT_SET') return null;

  const isVariant = node?.parent?.type === 'COMPONENT_SET';
  const isInstance = node?.type === 'INSTANCE';
  const target = isVariant
    ? node.parent
    : isInstance
      ? node.mainComponent
      : node;

  const name = createIdentifierPascal(target.name);
  const section = getSection(target);
  const page = getPage(target);
  const path = 'components/'
    + createIdentifierCamel(page?.name?.toLowerCase() || 'common')
    + '/'
    + createIdentifierCamel(section?.name?.toLowerCase() || 'base')
    + '/'
    + createIdentifierCamel(target.name);
  
  // Find the selected variant (if applicable)
  // TODO: fix this?, it should use the node target?
  const selectedVariant = (isVariant
    ? target.children.filter((n) => figma.currentPage.selection.includes(n)).pop()
    : undefined) as VariantMixin;
    
  // Override propDefs values with selected variant values
  const propDefs = target.componentPropertyDefinitions;
  if (selectedVariant) {
    Object.entries(selectedVariant?.variantProperties).forEach((v: any) => {
      propDefs[v[0]].defaultValue = v[1];
    });
  }

  return {target, name, page, section, path, propDefs, isVariant, isInstance};
}

export function getComponentPropName(value: string) {
  if (!value) return '';
  return createIdentifierCamel(value.split('#').shift());
}

export function getComponentInstanceInfo(node: InstanceNode) {
  const isInstance = node.type === 'INSTANCE';
  const isVariant = !!node.variantProperties;
  const main = isVariant ? node.mainComponent.parent : node.mainComponent;
  const props = node.componentProperties;
  const propId = node.componentPropertyReferences?.mainComponent;
  const propName = propId ? getComponentPropName(propId) : null;
  return {node, main, props, propName, isInstance};
}

export function getComponentCustomReaction(node: ComponentNode | InstanceNode) {
  return node.reactions
    ?.filter(r => r.trigger?.type === 'ON_CLICK'
      && r.action?.type === 'URL')[0]?.action;
}

export function getComponentPressReaction(node: ComponentNode | InstanceNode) {
  return node.reactions?.filter(r => r.trigger?.type === 'ON_PRESS')?.[0];
}


export function sortComponentProps(a: any, b: any) {
  // Booleans are always first
  if (a[1].type === 'BOOLEAN' && b[1].type !== 'BOOLEAN') {
    return -1;
  // Otherwise sort alphabetically
  } else {
    return a[0].localeCompare(b[0]);
  }
}

export function sortComponentPropsDef(a: any, b: any) {
  const isCondA = a[1].type === 'BOOLEAN' || a[1].type === 'INSTANCE_SWAP';
  const isCondB = b[1].type === 'BOOLEAN' || b[1].type === 'INSTANCE_SWAP';
  // Conditional types are last if different
  if (isCondA !== isCondB)
    return isCondA ? 1 : -1;
  // Sort by type alphabetically if different
  if (a[1].type !== b[1].type)
    return a[1].type.localeCompare(b[1].type);
  // Otherwise sort prop name alphabetically
  return a[0].localeCompare(b[0]);
}