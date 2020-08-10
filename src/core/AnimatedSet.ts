import AnimatedNode from './AnimatedNode';
import invariant from 'fbjs/lib/invariant';
import { val } from '../val';
import { adapt } from './AnimatedBlock';
import { Value, Adaptable } from '../types';
import AnimatedValue from './AnimatedValue';

class AnimatedSet<T> extends AnimatedNode<T> {
  _what;
  _value;

  constructor(what, value) {
    invariant(
      what instanceof AnimatedNode,
      `Reanimated: Animated.set first argument should be of type AnimatedNode but got ${what}`
    );
    invariant(
      value instanceof AnimatedNode,
      `Reanimated: Animated.set second argument should be of type AnimatedNode, String or Number but got ${value}`
    );
    super({ type: 'set', what, value }, [value]);
    invariant(!what._constant, 'Value to be set cannot be constant');
    this._what = what;
    this._value = value;
  }

  toString() {
    return `AnimatedSet, id: ${this.__nodeID}`;
  }

  __onEvaluate() {
    const newValue = val(this._value);
    this._what.setValue(newValue);
    return newValue;
  }
}

export function createAnimatedSet<T extends Value>(
  what: AnimatedValue<T>,
  value: Adaptable<T>
): AnimatedNode<T> {
  return new AnimatedSet(what, adapt(value));
}
