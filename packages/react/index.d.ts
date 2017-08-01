import * as React from 'react';

export interface AsyncIterator<T, TIn = any> {
  next(value?: TIn): Promise<IteratorResult<T>>;
  return?(value?: TIn): Promise<IteratorResult<T>>;
  throw?(e?: TIn): Promise<IteratorResult<T>>;
}
export interface UpdateFn {
  (): Promise<any>;
  <T extends Function>(fn: T): T;
}
export declare namespace JSX {
  interface Element {}
}
export interface CreateElementFn {
  (type: any, attributes: any, ...children: any[]): JSX.Element;
}
export interface GeneratorArgs<P> {
  props: P;
  update: UpdateFn;
  createElement?: CreateElementFn;
}
export interface GeneratorFn<P = {}, TOut = any> {
  ({ props, update }: GeneratorArgs<P>): AsyncIterator<TOut, P>;
}

export default function<P = {}, TOut = any>(
  generator: GeneratorFn<P, TOut>,
  displayName?: string
): React.ComponentClass<P>;
