import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ReactDOM from 'react-dom';

@observer
export default class Paragraph extends Component{
  componentDidMount(){
    if(this.props.para.focus){
      ReactDOM.findDOMNode(this).focus();
      if(this.props.para.text){
        let el = ReactDOM.findDOMNode(this);
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(el.childNodes[this.props.para.selectionStart.line], this.props.para.selectionStart.offset);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
  componentDidUpdate(param){
    // console.log(param.unique, 'updated');
    if(this.refs.true){
      ReactDOM.findDOMNode(this).focus();
      if(param.para.text){
        let el = ReactDOM.findDOMNode(this);
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(el.childNodes[param.para.selectionStart.line], param.para.selectionStart.offset);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
  render(){
    const para = this.props.para;

    return (
        <div
          spellCheck
          contentEditable
          className={para.type}
          id={'paragraph'}
          // autoHeight
          onBlur={() => para.focus = false}
          onFocus={() => para.focus = true}
          dangerouslySetInnerHTML={{__html: para.innerHTML || ""}}
          data-placeholder={para.type.slice(5)}
          ref={para.focus}
          data-unique={this.props.unique}
          data-pageNumber={this.props.pageNumber}
        />
    )
  }
}
