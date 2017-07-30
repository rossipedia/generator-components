export interface UpdateFn {
  (): Promise<any>;
  <T extends Function>(fn: T): T;
}

export interface JsxGeneratorArgs<P> {
  props: P;
  update: UpdateFn;
}

export interface JsxGenerator<P = {}> {
  ({ props, update }: JsxGeneratorArgs<P>): AsyncIterableIterator<JSX.Element>;
}

interface IDriver {
  update: UpdateFn;
  stop(): void;
}

function createDriver<P>(
  generator: JsxGenerator<P>,
  props: () => P,
  render: (child: JSX.Element) => void
): IDriver {
  let running = true;
  let gen: AsyncIterableIterator<JSX.Element>;

  function update(fn?: Function): Promise<any> | Function {
    if (typeof fn === 'function') {
      return function(...args: any[]) {
        fn(...args);
        return update();
      };
    }

    return gen.next(props()).then(result => {
      if (!running || result.done || !result.value) return;
      render(result.value);
    });
  }

  // kick it off
  const initialProps = props();
  gen = generator({ props: initialProps, update } as JsxGeneratorArgs<P>);
  return {
    update: update as UpdateFn,
    stop() {
      running = false;
      gen.next(undefined);
    },
  };
}

export type JSXFactory = (type: any, props: any, ...children: any[]) => JSX.Element;

export function createWrapper(h: JSXFactory , Component: any) {
  return function<P = {}>(generator: JsxGenerator<P>, displayName?: string) {

    type State = { child: JSX.Element };

    class GeneratorComponent<P> extends Component<P, State> {
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

      componentDidUpdate() {
        this.driver.update();
      }

      componentWillUnmount() {
        this.driver.stop();
      }

      // TODO:
      /*
      shouldComponentUpdate() {

      }
      */

      /*
      componentWillReceiveProps() {

      }
      */

      render() {
        const { child } = this.state;
        return child ? child : null;
      }
    }

    GeneratorComponent.displayName = displayName || generator.name;
    return GeneratorComponent as any;
  };
}
