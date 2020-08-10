import { useEffect } from 'react';
import { always, block } from '../base';
import { Nullable } from '../types';
import AnimatedNode from '../core/AnimatedNode';

/**
 * @callback NodeFactory
 * Function to create a node or an array of nodes.
 * @returns {(Node[] | Node | null | undefined | Boolean)}
 */

/**
 * React hook to run a node.
 * @param {NodeFactory} nodeFactory Function to build the node to run.
 * @param dependencies Array of dependencies. Refresh the node on changes.
 */
export default function useCode(
  nodeFactory: () =>
    | Nullable<AnimatedNode<number>[] | AnimatedNode<number>>
    | boolean,
  dependencies: any[]
): void {
  useEffect(() => {
    // check and correct 1st parameter
    if (!(nodeFactory instanceof Function)) {
      console.warn(
        'useCode() first argument should be a function that returns an animation node.'
      );

      const node = nodeFactory;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      nodeFactory = () => node;
    }

    let node = nodeFactory();
    if (node) {
      // allow factory to return array
      if (node instanceof Array) node = block(node);

      const animatedAlways = always(node);
      animatedAlways.__attach();

      // return undo function
      return () => animatedAlways.__detach();
    }
  }, dependencies);
}
