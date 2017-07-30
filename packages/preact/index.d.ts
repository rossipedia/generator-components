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

export default function<P = {}, TOut = any>(
  generator: GeneratorFn<P, TOut>,
  displayName?: string
): any;
// Until 'preact' fixes their typings we have to use 'any':
// https://github.com/developit/preact/issues/639
