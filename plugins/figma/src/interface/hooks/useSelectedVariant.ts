import {useState, useEffect} from 'react';
import {on} from '@create-figma-plugin/utilities';

import type {EventSelectVariant} from 'types/events';

export function useSelectedVariant() {
  const [name, setName] = useState<string>('');
  const [props, setProps] = useState<{[property: string]: string}>({});

  useEffect(() => on<EventSelectVariant>('SELECT_VARIANT', (name, props) => {
    setName(name);
    setProps(props);
  }), []);

  return {props, name};
}
