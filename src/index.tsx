import * as React from 'react';
import { render } from 'react-dom';
import { GeneratorComponent, JsxGenerator } from './GeneratorComponent';

async function* showHide({ update }: JsxGenerator) {
  let shown: boolean = false;

  const show = update(() => (shown = true));

  const hide = update(() => (shown = false));

  const render = () =>
    <div>
      {shown ? <p>OHAI</p> : null}
      <p>
        {shown
          ? <button onClick={hide}>Hide -</button>
          : <button onClick={show}>Show +</button>}
      </p>
    </div>;

  do {
    yield render();
  } while (yield);
}

async function* counter({ update }: JsxGenerator) {
  let count = 0;

  const ticker = setInterval(
    update(() => {
      count++;
    }),
    1000
  );

  const render = () =>
    <div>
      Count: {count}
    </div>;

  do {
    yield render();
  } while (yield);

  clearInterval(ticker);
}

render(
  <div>
    <GeneratorComponent generator={showHide} />
    <GeneratorComponent generator={counter} />
  </div>,
  document.getElementById('app')
);