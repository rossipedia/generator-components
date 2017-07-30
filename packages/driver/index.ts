export interface AsyncIterator<T, TIn = any> {
    next(value?: TIn): Promise<IteratorResult<T>>;
    return?(value?: TIn): Promise<IteratorResult<T>>;
    throw?(e?: TIn): Promise<IteratorResult<T>>;
}

export interface UpdateFn {
  (): Promise<any>;
  <T extends Function>(fn: T): T;
}

export interface GeneratorArgs<P> {
  props: P;
  update: UpdateFn;
}

export interface GeneratorFn<P = {}, TOut = any> {
  ({ props, update }: GeneratorArgs<P>): AsyncIterator<TOut, P>;
}

interface IDriver {
  update: UpdateFn;
  stop(): void;
}

function createDriver<P, TOut = any>(
  generator: GeneratorFn<P>,
  props: () => P,
  render: (child: TOut) => void
): IDriver {
  let running = true;
  let gen: AsyncIterator<TOut, P>;

  function update<T extends Function>(fn?: T): Promise<any> | T {
    if (typeof fn === 'function') {
      return function(...args: any[]) {
        fn(...args);
        return update();
      } as any; // shut up typescript I know what I'm doing
    }

    return gen.next(props()).then(result => {
      if (!running || result.done || !result.value) return;
      render(result.value);
    });
  }

  // kick it off
  const initialProps = props();
  gen = generator({ props: initialProps, update } as GeneratorArgs<P>);
  return {
    update: update as UpdateFn,
    stop() {
      running = false;
      gen.next(undefined);
    },
  };
}


export function createWrapper(Component: any) {
  return function<P = {}, TOut = any>(generator: GeneratorFn<P, TOut>, displayName?: string) {
    type State = { child: TOut };
    class GeneratorComponent<P> extends Component {
      state: State = { child: null };
      driver: IDriver;

      componentWillMount() {
        this.driver = createDriver(
          generator,
          () => this.props,
          child => this.setState({ child })
        );
        this.driver.update();
      }

      componentDidUpdate() { this.driver.update(); }
      componentWillUnmount() { this.driver.stop(); }
      render() { return this.state.child || null; }
    }

    GeneratorComponent.displayName = displayName || generator.name;
    return GeneratorComponent as any;
  };
}
