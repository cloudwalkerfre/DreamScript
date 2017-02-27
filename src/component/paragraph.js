import React, { Component } from 'react';
import { TextArea } from 'semantic-ui-react'
import { observer } from 'mobx-react';
import ReactDOM from 'react-dom';

@observer
export default class Paragraph extends Component{
  componentDidMount(){
    this.props.para.focus ? ReactDOM.findDOMNode(this).focus():'';
    ReactDOM.findDOMNode(this).selectionStart = this.props.para.selectionStart;
    ReactDOM.findDOMNode(this).selectionEnd = this.props.para.selectionStart;
  }
  componentDidUpdate(param){
    // console.log(param.unique, 'updated');
    if(this.refs.true){
      ReactDOM.findDOMNode(this).focus();
    }
  }
  render(){
    const para = this.props.para;

    return (
        <TextArea
          className={para.type}
          id={'paragraph'}
          autoHeight
          spellCheck="true"
          onBlur={() => para.focus = false}
          onFocus={() => para.focus = true}
          defaultValue={para.text ? para.text: ''}
          placeholder={para.type}
          ref={para.focus}
          data-unique={this.props.unique}
          data-pageNumber={this.props.pageNumber}
        />
    )
  }
}
