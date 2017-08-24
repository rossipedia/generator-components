import { Component, createElement } from 'react';
import { driver } from '@generator-components/driver';

export default function(fn) {
  return class GeneratorComponent extends Component {
    constructor(props) {
      super(props);
      this.state = { child: null };
      this.driver = driver(fn, props, createElement, this.update.bind(this));
      this.driver.tick(props);
      this._isMounted = false;
    }

    update(child) {
      if (!this._isMounted) {
        this.state.child = child;
      } else {
        this.setState(() => ({ child }));
      }
    }

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillReceiveProps(nextProps) {
      this.driver.tick(nextProps);
    }

    render() {
      return this.state.child;
    }
  };
}
