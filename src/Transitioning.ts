import React, { Component, ComponentClass, createContext } from 'react';
import { View, findNodeHandle } from 'react-native';
import ReanimatedModule from './ReanimatedModule';

const TransitioningContext = createContext();

function configFromProps(type, props) {
  const config = { type };
  if ('durationMs' in props) {
    config.durationMs = props.durationMs;
  }
  if ('interpolation' in props) {
    config.interpolation = props.interpolation;
  }
  if ('type' in props) {
    config.animation = props.type;
  }
  if ('delayMs' in props) {
    config.delayMs = props.delayMs;
  }
  if ('propagation' in props) {
    config.propagation = props.propagation;
  }
  return config;
}

/**
 * The below wrapper is used to support legacy context API with Context.Consumer
 * render prop. We need it as we want to access `context` from within
 * `componentDidMount` callback. If we decided to drop support for older
 * react native we could rewrite it using hooks or `static contextType` API.
 */
function wrapTransitioningContext(Comp) {
  return (props) => {
    return (
      <TransitioningContext.Consumer>
        {(context) => <Comp context={context} {...props} />}
      </TransitioningContext.Consumer>
    );
  };
}

class In extends React.Component {
  componentDidMount() {
    this.props.context.push(configFromProps('in', this.props));
  }

  render() {
    return this.props.children || null;
  }
}

class Change extends React.Component {
  componentDidMount() {
    this.props.context.push(configFromProps('change', this.props));
  }

  render() {
    return this.props.children || null;
  }
}

class Out extends React.Component {
  componentDidMount() {
    this.props.context.push(configFromProps('out', this.props));
  }

  render() {
    return this.props.children || null;
  }
}

class Together extends React.Component {
  transitions = [];
  componentDidMount() {
    const config = configFromProps('group', this.props);
    config.transitions = this.transitions;
    this.props.context.push(config);
  }

  render() {
    return (
      <TransitioningContext.Provider value={this.transitions}>
        {this.props.children}
      </TransitioningContext.Provider>
    );
  }
}

class Sequence extends React.Component {
  transitions = [];
  componentDidMount() {
    const config = configFromProps('group', this.props);
    config.sequence = true;
    config.transitions = this.transitions;
    this.props.context.push(config);
  }

  render() {
    return (
      <TransitioningContext.Provider value={this.transitions}>
        {this.props.children}
      </TransitioningContext.Provider>
    );
  }
}

function createTransitioningComponent(Component) {
  class Wrapped extends React.Component {
    propTypes = Component.propTypes;
    transitions = [];
    viewRef = React.createRef();

    componentDidMount() {
      if (this.props.animateMount) {
        this.animateNextTransition();
      }
    }

    setNativeProps(props) {
      this.viewRef.current.setNativeProps(props);
    }

    animateNextTransition() {
      const viewTag = findNodeHandle(this.viewRef.current);
      ReanimatedModule.animateNextTransition(viewTag, {
        transitions: this.transitions,
      });
    }

    render() {
      const { transition, ...rest } = this.props;
      return (
        <React.Fragment>
          <TransitioningContext.Provider value={this.transitions}>
            {transition}
          </TransitioningContext.Provider>
          <Component {...rest} ref={this.viewRef} collapsable={false} />
        </React.Fragment>
      );
    }
  }
  return Wrapped;
}
export interface TransitionProps {
  delayMs?: number;
  durationMs?: number;
  interpolation?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  propagation?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TransitioningViewProps extends ViewProps {
  transition: ReactNode;
}

export class TransitioningView extends Component<TransitioningViewProps> {
  animateNextTransition(): void;
}

export class Transitioning extends Component {
  static View: typeof TransitioningView;
}

export interface TransitionInOutProps extends TransitionProps {
  type?:
    | 'fade'
    | 'scale'
    | 'slide-top'
    | 'slide-bottom'
    | 'slide-right'
    | 'slide-left';
}

export class Transition extends Component {
  static In: ComponentClass<TransitionInOutProps>;
  static Out: ComponentClass<TransitionInOutProps>;
  static Change: ComponentClass<TransitionProps>;
  static Together: ComponentClass<{}>;
  static Sequence: ComponentClass<{}>;
}

const Transitioning = {
  View: createTransitioningComponent(View),
};

const Transition = {
  Sequence: wrapTransitioningContext(Sequence),
  Together: wrapTransitioningContext(Together),
  In: wrapTransitioningContext(In),
  Out: wrapTransitioningContext(Out),
  Change: wrapTransitioningContext(Change),
};

export { Transitioning, Transition, createTransitioningComponent };
