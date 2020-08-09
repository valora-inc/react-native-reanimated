import AnimatedNode from './AnimatedNode';
import { createAnimatedCallFunc } from './AnimatedCallFunc';
import { createAnimatedParam } from './AnimatedParam';
import { val } from '../val';
import invariant from 'fbjs/lib/invariant';
import { Adaptable, Value } from '../types';

class AnimatedFunction<T extends Value> extends AnimatedNode<T> {
  _what;

  constructor(what, ...params) {
    invariant(
      what instanceof AnimatedNode,
      `Reanimated: AnimatedCallFunc 'what' argument should be of type AnimatedNode but got ${what}`
    );
    super(
      {
        type: 'func',
        what,
      },
      [what, ...params]
    );
    this._what = what;
    this.__attach();
  }

  __onEvaluate() {
    return val(this._what);
  }

  toString() {
    return `AnimatedFunction, id: ${this.__nodeID}`;
  }
}

export function createAnimatedFunction<
  T extends (Adaptable<Value> | undefined)[]
>(cb: (...args: T) => AnimatedNode<number>): typeof cb {
  const params = new Array(cb.length);
  for (let i = 0; i < params.length; i++) {
    params[i] = createAnimatedParam();
  }

  // @ts-ignore
  const what = cb(...params);
  const func = new AnimatedFunction(what, ...params);
  return (...args) => {
    if (args.length !== params.length) {
      throw new Error(
        'Parameter mismatch when calling reanimated function. Expected ' +
          params.length +
          ' parameters, got ' +
          args.length +
          '.'
      );
    }
    return createAnimatedCallFunc(func, args, params);
  };
}
