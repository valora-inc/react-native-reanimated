import { block, cond, defined, neq, not, set, proc } from '../base';
import AnimatedValue from '../core/InternalAnimatedValue';
import { Adaptable } from '../types';
import AnimatedNode from '../core/AnimatedNode';

const procOnChange = proc(function (value, action, prevValue) {
  return block([
    cond(not(defined(prevValue)), set(prevValue, value)),
    cond(neq(value, prevValue), [set(prevValue, value), action]),
  ]);
});

export default function onChange(
  value: Adaptable<number>,
  action: Adaptable<number>
): AnimatedNode<number> {
  const prevValue = new AnimatedValue();
  return procOnChange(value, action, prevValue);
}
