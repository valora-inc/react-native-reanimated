import { useRef } from 'react';
import AnimatedValue from './core/AnimatedValue';
import { Value } from './types';

export default function useValue<T extends Value>(
  initialValue: T
): AnimatedValue<T> {
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = new AnimatedValue(initialValue);
  }
  return ref.current;
}
