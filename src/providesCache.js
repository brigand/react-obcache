import React from 'react';

export default function providesCache(opts, Component){
  if (typeof opts === 'function') return providesCache({}, Component);
  if (arguments.length < 2) return providesCache.bind(null, opts || {});

  class CacheProvider extends React.Component {
    constructor(){
      super();
      this.state = {data: {}, errors: {}};
      this.observables = {};
      this.subscriptions = {};
    }

    handleCacheFieldsChange(fields){
      var data = {}, errors = {}, hitKeys = {};
      Object.keys(fields).forEach((key) => {
        hitKeys[key] = true;
        var field = fields[key];
        var previous = this.observables[key];

        // no change
        if (field === previous) {
          data[key] = this.state.data[key];
          errors[key] = this.state.errors[key];
          return;
        }

        // its changed or added
        // check if we need to clean up
        if (previous) {
           this.cleanUp(key);
        }

        this.subscriptions[key] = field.listen({
          okay: (value) => {
            this.update('data', key, value);
          },
          error: (error) => {
            this.update('errors', key, error);
          },
        });
      });

      // check for key removal
      Object.keys(this.subscriptions).forEach((key) => {
        if (!hitKeys[key]) {
          this.cleanUp(key);
        }
      });
    }

    update(type, key, value){
      this.setState((state) => ({
        [type]: Object.assign({}, state[type], {[key]: value})
      }))
    }

    cleanUp(key){
      if (this.subscriptions[key]) {
        this.subscriptions[key]();
      }
      if (this.observables[key]) {
        delete this.observables[key];
      }
    }

    render(){
      return (
        <Component {...this.props}
          cache={this.state}
          onCacheFieldsChange={(o) => this.handleCacheFieldsChange(o)}
        />
      );
    }
  }
  console.log(Object.getOwnPropertyNames(Component));
  Object.keys(Component).forEach((key) => {
    if (['length', 'name', 'prototype', 'toString', 'displayName'].indexOf(key) !== -1) {
      return;
    }

    if (key === 'propTypes') {
      var propTypes = Object.assign({}, Component.propTypes, {cache: undefined, onCacheFieldsChange: undefined});
      CacheProvier.propTypes = propTypes; 
    }
    else {
      CacheProvider[key] = Component[key];
    }
  });
  return CacheProvider;
}

