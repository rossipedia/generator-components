import * as React from 'react';
import { createWrapper, JsxGenerator } from '@generator-components/driver';


const wrapper = createWrapper(React.createElement, React.Component);

export default function <P>(gen: JsxGenerator<P>) {
  return wrapper(gen) as React.ComponentClass<P>;
};