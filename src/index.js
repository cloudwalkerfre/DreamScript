import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Router, Route, browserHistory } from 'react-router';
import path from 'path';
import Datastore from "nedb";

import scripts from './mobx-script/mobx-script';
import DashBoard from './component/dashBoard';
import Script from './component/script';

const db = new Datastore({filename: getDatabasePath('scripts'), autoload: true});
const MobxScript = new scripts(db);

/*
  MobxScript will keep a index info of scripts for DashBoard
  the detail script will load from nedb when Script Component init
*/
const routes = (
  <Provider MobxScript={MobxScript}>
    <Router history={browserHistory}>
      <Route path='/' component={DashBoard} />
      <Route path='/:id' component={Script} />
      {/* <Route path='*' component={Script} /> */}
    </Router>
  </Provider>
)

ReactDOM.render(routes, document.querySelector('#root'));

function getDatabasePath(name){
  return path.join(__dirname, 'data', name + '.db');
}

// window.addEventListener('scroll', () => {
//   script.handleScroll();
// })
window.addEventListener('keydown',(e) => {
  if(e.target.id === 'paragraph'){
    MobxScript.handleKey(e, parseInt(e.target.attributes['data-unique'].value));
  }
});
// saving after char is putIn => keyUp instead of keyPress
// otherwise the last input char will not be saved when pressing save button
// but it's minor issue...
window.addEventListener('keyup',(e) => {
  if(e.target.id === 'paragraph'){
    MobxScript.handleText(e, parseInt(e.target.attributes['data-unique'].value));
  }
});
