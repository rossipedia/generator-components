export type Props = { [key: string]: any };
export interface JSXLike {
  type: string | Function;
  props: Props;
}

export interface CreateElementFn {
  (type: string | Function, props: Props, ...children: any[]): JSXLike;
}

export interface GeneratorArgs<P> {
  props: P;
  createElement: CreateElementFn;
}

export interface GeneratorFn<P> {
  (args: GeneratorArgs<P>): Iterator<JSXLike | Promise<any>>;
}


const isFn = (v: any) => typeof v === 'function';
const isProm = (v: any): v is Promise<any> => isFn(v.then);

const isJsx = (v: any): v is JSXLike => !!v && !!v.type && !!v.props;

export interface Driver<P> {
  tick(input: any): void;
  stop(): void;
}

export function driver<P>(
  fn: GeneratorFn<P>,
  props: P,
  createElement: CreateElementFn,
  render: (child: JSXLike) => void
): Driver<P> {
  const gen = fn({ props, createElement });
  let finished = false;

  function tick(input: any) {
    if (finished) return;
    const { value, done } = gen.next(input);
    if (done) return;
    if (isProm(value)) {
      value.then(v => {
        if (isJsx(v)) render(v);
        tick(undefined);
      });
    } else {
      render(value);
    }
  }

  function stop() {
    gen.return();
    finished = true;
  }

  return {
    tick,
    stop,
  };
}
