React bindings for [obcache]. A simple and powerful way to manage data fetching.

[obcache]: https://github.com/brigand/obcache

## Install

    npm install --save react-obcache obcache

Works in react versions with React.Component (0.13+). Requires an es6 shim.

## Usage

A high order component is provided which passes two props: cache, and onCacheFieldsChange.

You normally create your obcache in a module named cache.js:

```js
import ObCache from 'obcache';
var obcache = new ObCache;

// this would usually be an ajax request or other I/O operations
obcache.register('doubled', ([x]) => Promise.resolve(x*2));

export default obcache;
```


In your components call `this.props.onCacheFieldsChange` with the keys and cache observables you want
to be exposed. You can call this again at any time, and it diffs the object to determine if keys
were added/removed/changed, and handles fetching the values. Your data will never fall out of sync
because memoized observables are used internally.

```js
import {providesCache} from 'react-obcache';
import cache from './cache';

@providesCache()
class Foo extends React.Component {
  componentDidMount(){
    this.props.onCacheFieldsChange({
      num: cache.get('doubled', 5),
    })
  }
  render(){
    var {data, errors} = this.props.cache;
    if (data.num == null && errors.num == null) {
      return <div>Loading</div>;
    }
    if (data.num != null) {
      return <div>10 = {data.num}</div>
    }
    if (error.num != null) {
      return <div>There was an error!</div>
    }
  }
}
```

See the [obcache] readme for more information about configuring and using the cache.

## does this replace flux?

This replaces the usage of flux that's painful: data fetching. Flux is a great
tool for managin ui state, but quite awful for simple data fetching.


