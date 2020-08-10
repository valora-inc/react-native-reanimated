import {
  cond,
  sub,
  pow,
  divide,
  multiply,
  add,
  block,
  set,
  lessThan,
  proc,
  abs,
} from '../base';
import { PhysicsAnimationState } from './spring';
import AnimatedClock from '../core/AnimatedClock';
import { Adaptable } from '../types';
import AnimatedNode from '../core/AnimatedNode';
import { BackwardCompatibleWrapper } from './backwardCompatibleAnimWrapper';

const VELOCITY_EPS = 5;

function decay(clock, state, config) {
  const lastTime = cond(state.time, state.time, clock);
  const deltaTime = sub(clock, lastTime);

  // v0 = v / 1000
  // v = v0 * powf(deceleration, dt);
  // v = v * 1000;

  // x0 = x;
  // x = x0 + v0 * deceleration * (1 - powf(deceleration, dt)) / (1 - deceleration)
  const kv = pow(config.deceleration, deltaTime);
  const kx = divide(
    multiply(config.deceleration, sub(1, kv)),
    sub(1, config.deceleration)
  );
  const v0 = divide(state.velocity, 1000);
  const v = multiply(v0, kv, 1000);
  const x = add(state.position, multiply(v0, kx));
  return block([
    set(state.position, x),
    set(state.velocity, v),
    set(state.time, clock),
    cond(lessThan(abs(v), VELOCITY_EPS), set(state.finished, 1)),
  ]);
}

const procDecay = proc(
  (clock, time, velocity, position, finished, deceleration) =>
    decay(clock, { time, velocity, position, finished }, { deceleration })
);
export interface DecayConfig {
  deceleration: Adaptable<number>;
}
export type DecayState = PhysicsAnimationState;

export function decay(
  node: AnimatedNode<number>,
  config: DecayConfig
): BackwardCompatibleWrapper;

export default (
  clock: AnimatedClock,
  { time, velocity, position, finished }: DecayState,
  { deceleration }: DecayConfig
): AnimatedNode<number> =>
  procDecay(clock, time, velocity, position, finished, deceleration);
