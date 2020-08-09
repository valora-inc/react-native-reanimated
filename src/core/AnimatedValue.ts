import { createAnimatedSet as set } from './AnimatedSet';
import interpolate, { InterpolationConfig } from '../derived/interpolate';
import InternalAnimatedValue from './InternalAnimatedValue';
import { Platform } from 'react-native';
import { evaluateOnce } from '../derived/evaluateOnce';
import ReanimatedModule from '../ReanimatedModule';
import { val } from '../val';
import type { Value, Adaptable } from '../types';
import type AnimatedNode from './AnimatedNode';

// Animated value wrapped with extra methods for omit cycle of dependencies
class AnimatedValue<T extends Value> extends InternalAnimatedValue<T> {
  setValue(value: Adaptable<T>): void {
    this.__detachAnimation(this._animation);
    if (
      Platform.OS === 'web' ||
      Platform.OS === 'windows' ||
      Platform.OS === 'macos'
    ) {
      this._updateValue(val(value));
    } else {
      if (ReanimatedModule.setValue && typeof value === 'number') {
        // FIXME Remove it after some time
        // For OTA-safety
        // FIXME handle setting value with a node
        ReanimatedModule.setValue(this.__nodeID, value);
      } else {
        evaluateOnce(set(this, value), this);
      }
    }
  }

  toString() {
    return `AnimatedValue, id: ${this.__nodeID}`;
  }

  interpolate(config: InterpolationConfig): AnimatedNode<number> {
    return interpolate(this, config);
  }
}

export default AnimatedValue;
