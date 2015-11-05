import 'babel-polyfill';
import {expect} from 'chai';
import jsdom from 'mocha-jsdom';
import providesCache from '../providesCache';
import React from 'react';
import ReactDOM from 'react-dom';
import ObCache from 'obcache';

describe('providesCache', () => {
  jsdom();
  var render, inst, node, cache, obs;
  beforeEach(() => {
    var el = document.createElement('div');
    document.body.appendChild(el);
    cache = new ObCache();
    cache.register('id', async ([x]) => x);
    obs = cache.get('id', 'a');
    obs.set('b');

    render = (reactElement) => {
      inst = ReactDOM.render(reactElement, el);
      node = ReactDOM.findDOMNode(inst);
      return inst;
    }
  });

  it('is a sane testing environment', () => {
    render(<div>x</div>);
    expect(node.textContent).to.equal('x');
    console.error(inst.children);
    expect(inst.props.children).to.equal('x');
  })

});

