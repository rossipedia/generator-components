import * as React from 'react';

(Symbol as any).asyncIterator =
  Symbol.asyncIterator !== undefined
    ? Symbol.asyncIterator
    : '__@@asyncIterator__';

export interface UpdateFn {
  (): Promise<any>;
  <T extends Function>(fn: T): T;
}

export interface JsxGenerator<P = {}> {
  props: P;
  update: UpdateFn;
}

type Props = {
  generator({ props, update: UpdateFn }): AsyncIterableIterator<JSX.Element>;
  childProps?: any;
};

type State = { child: JSX.Element };

export class GeneratorComponent extends React.Component<Props, State> {
  state = { child: null };
  running: boolean = false;
  gen: AsyncIterableIterator<JSX.Element>;

  static defaultProps = {
    childProps: {},
  };

  componentWillMount() {
    const { generator, childProps } = this.props;
    this.gen = generator({ props: childProps, update: this.update });
    this.running = true;
    this.update();
  }

  update = (fn?: Function): Function | Promise<any> => {
    if (typeof fn === 'function')
      return (...args: any[]) => (fn(...args), this.update());

    this.gen.next(this.props.childProps).then(result => {
      if (!this.running || result.done) return;
      if (result.value === undefined) return setTimeout(this.update, 0);
      if (result.value !== null) this.setState({ child: result.value });
    });
  };

  componentWillUnmount() {
    this.running = false;
    this.gen.next(undefined);
  }

  render() {
    const { child } = this.state;
    if (child === null) return null;
    return React.Children.only(this.state.child);
  }
}