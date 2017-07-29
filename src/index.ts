import reactGen from './react';
import preactGen from './preact';

import { render as preactRender } from 'preact';
import { render as reactRender } from 'react-dom';


(Symbol as any).asyncIterator =
  Symbol.asyncIterator !== undefined
    ? Symbol.asyncIterator
    : '__@@asyncIterator__';

