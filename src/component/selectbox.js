import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactDOM from 'react-dom';

 @observer
export default class SelectBox extends Component{
  componentDidUpdate(param){
    if(param.script.selectbox.display === 'block' ){
      ReactDOM.findDOMNode(this).focus();
    }
  }
  render(){
    const { script } = this.props;
    let style = {display: script.selectbox.display, top: script.selectbox.top, right: script.selectbox.right, left: script.selectbox.left};
    // console.log(style)
    return (
      <select
        className='selectbox'
        style={style}
        size={script.options.length}
        onKeyPress={e => script.handleSelect(e, script.selectbox.index)}
        onBlur={() => script.selectbox.display = 'none'}
        onScroll={() => script.selectbox.display = 'none'}
        defaultValue='para-action'
        >
        {script.options.map((op, i) =>
          <option key={i} value={op} >{op.slice(5)}</option>
        )}
      </select>
    )
  }
}
