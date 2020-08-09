export default {
  async disconnectNodeFromView(nodeID, viewTag) {
    // noop
  },
  async attachEvent(viewTag, eventName, nodeID) {
    // noop
  },
  async detachEvent(viewTag, eventName, nodeID) {
    // noop
  },
  async createNode(nodeID, config) {
    // noop
  },
  async dropNode(nodeID) {
    // noop
  },
  async configureProps(nativePropsArray, uiPropsArray) {
    // noop
  },
  async disconnectNodes(parentID, childID) {
    // noop
  },
  async animateNextTransition() {
    console.warn(
      'Reanimated: animateNextTransition is unimplemented on current platform'
    );
  },
};
