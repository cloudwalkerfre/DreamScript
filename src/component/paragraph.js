import React, { Component } from 'react';
import { TextArea } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react';
import ReactDOM from 'react-dom';

@inject('script') @observer
export default class Paragraph extends Component{
  componentDidMount(){
    // console.log(this.props.script.page[this.props.index].selectionStart)
    this.refs.true ? ReactDOM.findDOMNode(this).focus():'';
    ReactDOM.findDOMNode(this).selectionStart = this.props.script.page[this.props.index].selectionStart;
    ReactDOM.findDOMNode(this).selectionEnd = this.props.script.page[this.props.index].selectionStart;
  }
  componentDidUpdate(param){
    if(this.refs.true){
      ReactDOM.findDOMNode(this).focus();
      // ReactDOM.findDOMNode(this).selectionStart = param.script.page[param.index].selectionStart;
      // ReactDOM.findDOMNode(this).selectionEnd = param.script.page[param.index].selectionStart;
      // console.log(param.script.page[param.index].selectionStart);
      // console.log(param.script.page[param.index].line, param.script.page[param.index].height);
      // console.log(ReactDOM.findDOMNode(this).getBoundingClientRect())
    }
  }
  render(){
    const {script} = this.props;
    const index = this.props.index;
    // let type = this.props.type;
    // let text = this.props.text;
    // console.log(index);

    return (
      // <div className='paragraph'>
        <TextArea
          className={script.page[index].type}
          id={'paragraph'}
          autoHeight
          spellCheck="true"
          // onInput={script.page[index].text = this.value}
          onKeyDown={e => script.handleKey(e, index)}
          onBlur={() => script.page[index].focus = false}
          onFocus={() => script.page[index].focus = true}
          defaultValue={script.page[index].text ? script.page[index].text: ''}
          placeholder={script.page[index].type}
          ref={script.page[index].focus}
          // selectionStart={script.page[index].selectionStart}
          // selectionEnd={script.page[index].selectionStart}
        />
      // </div>
    )
  }
}
