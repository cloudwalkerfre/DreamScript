import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
// import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import mobxScript from './mobx-script/mobx-script'

import Script from './component/script';

const script = new mobxScript();

const routes = (
  <Provider script={script}>
    <Script />
  </Provider>
)

ReactDOM.render(routes, document.querySelector('#root'));
