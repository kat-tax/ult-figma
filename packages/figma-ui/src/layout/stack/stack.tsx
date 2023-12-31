import styles from './stack.module.css';

import {Children} from 'react';
import {createComponent} from '../../utilities/create-component.js';

import type {ReactNode} from 'react';
import type {Space} from '../../types/space.js';

export type StackProps = {
  children: ReactNode,
  space: StackSpace,
}

export type StackSpace = Space;

export const Stack = createComponent<HTMLDivElement, StackProps>(({
  children,
  space,
  ...rest
}, ref) => (
  <div {...rest} ref={ref} className={styles[space]}>
    {Children.toArray(children).map((element: ReactNode, i: number) => (
      <div key={i} className={styles.child}>
        {element}
      </div>
    ))}
  </div>
));
