import { set, add, proc } from '../base';
import AnimatedValue from '../core/InternalAnimatedValue';
import { Adaptable } from '../types';
import AnimatedNode from '../core/AnimatedNode';

const procAcc = proc(function (v, acc) {
  return set(acc, add(acc, v));
});

export default function acc(v: Adaptable<number>): AnimatedNode<number> {
  const acc = new AnimatedValue(0);
  return procAcc(v, acc);
}
