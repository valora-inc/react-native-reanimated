import { createAnimatedOperator } from './core/AnimatedOperator';
import { Adaptable, Value } from './types';
import AnimatedNode from './core/AnimatedNode';

const operator = createAnimatedOperator;

type BinaryOperator<T = number> = (
  left: Adaptable<number>,
  right: Adaptable<number>
) => AnimatedNode<T>;

type UnaryOperator = (value: Adaptable<number>) => AnimatedNode<number>;

type MultiOperator<T = number> = (
  a: Adaptable<number>,
  b: Adaptable<number>,
  ...others: Adaptable<number>[]
) => AnimatedNode<T>;

export const add: MultiOperator = operator('add');
export const sub: MultiOperator = operator('sub');
export const multiply: MultiOperator = operator('multiply');
export const divide: MultiOperator = operator('divide');
export const pow: MultiOperator = operator('pow');
export const modulo: MultiOperator = operator('modulo');
export const sqrt: UnaryOperator = operator('sqrt');
export const log: UnaryOperator = operator('log');
export const sin: UnaryOperator = operator('sin');
export const cos: UnaryOperator = operator('cos');
export const exp: UnaryOperator = operator('exp');
export const round: UnaryOperator = operator('round');
export const lessThan: BinaryOperator<0 | 1> = operator('lessThan');
export const eq: BinaryOperator<0 | 1> = operator('eq');
export const greaterThan: BinaryOperator<0 | 1> = operator('greaterThan');
export const lessOrEq: BinaryOperator<0 | 1> = operator('lessOrEq');
export const greaterOrEq: BinaryOperator<0 | 1> = operator('greaterOrEq');
export const neq: BinaryOperator<0 | 1> = operator('neq');
export const and: MultiOperator<0 | 1> = operator('and');
export const or: MultiOperator<0 | 1> = operator('or');
export const defined: (value: Adaptable<any>) => AnimatedNode<0 | 1> = operator(
  'defined'
);
export const not: (value: Adaptable<any>) => AnimatedNode<0 | 1> = operator(
  'not'
);
export const tan: UnaryOperator = operator('tan');
export const acos: UnaryOperator = operator('acos');
export const asin: UnaryOperator = operator('asin');
export const atan: UnaryOperator = operator('atan');
export const abs: UnaryOperator = operator('abs');
export const ceil: UnaryOperator = operator('ceil');
export const floor: UnaryOperator = operator('floor');
export const max: BinaryOperator = operator('max');
export const min: BinaryOperator = operator('min');
