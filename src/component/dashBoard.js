import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';

@inject('MobxScript') @observer
export default class DashBoard extends Component{
  handleClick(e, i){
    if(e.target.className != 'script_delete'){
      browserHistory.push('/'+i);
    }
  }
  render(){
    const { MobxScript }=this.props;
    // console.log(MobxScript.length)

    return (
      <div className='dashboard'>
        {MobxScript.scripts.map((s, i) =>
          <div className='scriptbox' key={i} onClick={(e) => this.handleClick(e, s._id)}>
            <h3>{s.titlePage.title}</h3>
            <div className='script_author'>{s.titlePage.author}</div>
            <div className='script_extra'>{s.titlePage.extra}</div>
            {/* <div className='script_time'>{s._id}</div> */}
            <div className='script_delete' onClick={(e) => MobxScript.deleteScript(i)}>x</div>
          </div>
        )}
        <div className='scriptbox script_add' onClick={() => MobxScript.addNewScript()}>
          <div className='script_add_ico'>
            <h3>+</h3>
          </div>
        </div>
      </div>
    )
  }
}
