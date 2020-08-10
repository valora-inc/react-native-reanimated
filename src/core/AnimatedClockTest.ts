import AnimatedNode from './AnimatedNode';
import AnimatedClock from './AnimatedClock';

class AnimatedClockTest extends AnimatedNode {
  _clockNode;

  constructor(clockNode) {
    super({ type: 'clockTest', clock: clockNode });
    this._clockNode = clockNode;
  }

  toString() {
    return `AnimatedClockTest, id: ${this.__nodeID}`;
  }

  __onEvaluate() {
    return this._clockNode.isStarted() ? 1 : 0;
  }
}

export function createAnimatedClockTest(
  clock: AnimatedClock
): AnimatedNode<0 | 1> {
  return new AnimatedClockTest(clock);
}
