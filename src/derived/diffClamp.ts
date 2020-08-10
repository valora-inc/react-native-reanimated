import { cond, defined, set, add, min, max } from '../base';
import AnimatedValue from '../core/InternalAnimatedValue';
import diff from './diff';
import { Adaptable } from '../types';
import AnimatedNode from '../core/AnimatedNode';

export default function diffClamp(
  a: Adaptable<number>,
  minVal: Adaptable<number>,
  maxVal: Adaptable<number>
): AnimatedNode<number> {
  const value = new AnimatedValue();
  return set(
    value,
    min(max(add(cond(defined(value), value, a), diff(a)), minVal), maxVal)
  );
}
