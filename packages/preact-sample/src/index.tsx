import {h, render, Component, ComponentProps} from 'preact';
import fromGenerator from '@generator-components/preact';

(Symbol as any).asyncIterator =
  Symbol.asyncIterator !== undefined
    ? Symbol.asyncIterator
    : '__@@asyncIterator__';

function Container({ children }: ComponentProps<any>) {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {children}
    </div>
  );
}

interface Props {
  num: number;
  onChange(by: number): void;
}

const Counter = fromGenerator<Props>(async function* Counter({ props, update }) {
  // assume onChange doesn't actually... change
  console.log('Initial props:', props);

  const inc = update(() => props.onChange(1));
  const dec = update(() => props.onChange(-1));

  const render = ({ num: i }: Props) => (
    <Container>
      <p>Count: {i}</p>
      <p>
        <button onClick={inc}>+</button>
        <button onClick={dec}>-</button>
      </p>
    </Container>
  );

  do {
    yield render(props);
  } while (props = yield);
});


interface St { num: number };
class App extends Component<{}, St> {
  state = { num: 0 };

  onChange = (by: number) => {
    this.setState((prev: St) => ({ num: prev.num + by }));
  };

  render() {
    return (
      <div>
        <Counter num={this.state.num} onChange={this.onChange} />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
