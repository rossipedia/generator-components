import {h, render, Component, ComponentProps} from 'preact';
import gl from 'glamorous';
import fromGenerator from '@generator-components/react';

const Container = gl.div({
  fontFamily: 'sans-serif',
});

interface Props {
  num: number;
  onChange(by: number): void;
}

const Counter = fromGenerator<Props>(function* Counter({ props, createElement }) {
  const inc = () => props.onChange(1);
  const dec = () => props.onChange(-1);

  do {
    props = yield (
      <Container>
        <p>
          Count: {props.num}
        </p>
        <p>
          <button onClick={inc}>+</button>
          <button onClick={dec}>-</button>
        </p>
      </Container>
    );
  } while (props);
});

const Clock = fromGenerator(function* Loader() {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  while (true) {
    yield Promise.resolve(
      <div>
        {new Date().toLocaleString()}
      </div>
    );
    yield delay(1000);
  }
});

class App extends Component<{}, { num: number }> {
  state = { num: 0 };

  onChange = (by: number) => {
    this.setState({ num: this.state.num + by });
  };

  render() {
    return (
      <div>
        <Counter num={this.state.num} onChange={this.onChange} />
        <hr />
        <Clock />
      </div>
    );
  }
}

render(h(App, {}), document.getElementById('app'));
