import {
  ViewProps,
  TextProps,
  ImageProps,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  TransformsStyle,
  View as ReactNativeView,
  Text as ReactNativeText,
  Image as ReactNativeImage,
  ScrollView as ReactNativeScrollView,
} from 'react-native';
import AnimatedNode from './core/AnimatedNode';
import { Component } from 'react';

export type Nullable<T> = T | null | undefined;

export type Value = string | number | boolean;

export type Adaptable<T> =
  | T
  | AnimatedNode<T>
  | ReadonlyArray<T | AnimatedNode<T> | ReadonlyArray<T | AnimatedNode<T>>>;

export type TransformStyleTypes = TransformsStyle['transform'] extends
  | readonly (infer T)[]
  | undefined
  ? T
  : never;
export type AdaptTransforms<T> = {
  [P in keyof T]: Adaptable<T[P] extends string ? number | string : T[P]>;
};
export type AnimatedTransform = AdaptTransforms<TransformStyleTypes>[];

export type AnimateStyle<S extends object> = {
  [K in keyof S]: K extends 'transform'
    ? AnimatedTransform
    : S[K] extends ReadonlyArray<any>
    ? ReadonlyArray<AnimateStyle<S[K][0]>>
    : S[K] extends object
    ? AnimateStyle<S[K]>
    :
        | S[K]
        | AnimatedNode<
            // allow `number` where `string` normally is to support colors
            S[K] extends string | undefined ? S[K] | number : S[K]
          >;
};

export type AnimateProps<
  S extends object,
  P extends {
    style?: StyleProp<S>;
  }
> = {
  [K in keyof P]: K extends 'style'
    ? StyleProp<AnimateStyle<S>>
    : P[K] | AnimatedNode<P[K]>;
};

export class View extends Component<AnimateProps<ViewStyle, ViewProps>> {
  getNode(): ReactNativeView;
}
export class Text extends Component<AnimateProps<TextStyle, TextProps>> {
  getNode(): ReactNativeText;
}
export class Image extends Component<AnimateProps<ImageStyle, ImageProps>> {
  getNode(): ReactNativeImage;
}
export class ScrollView extends Component<
  AnimateProps<ViewStyle, ScrollViewProps>
> {
  getNode(): ReactNativeScrollView;
}
