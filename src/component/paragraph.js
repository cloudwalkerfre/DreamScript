import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ReactDOM from 'react-dom';

/*
  Find and place cursor in div-editable
*/
function SetCaretPosition(el, offset){
  for(let node of el.childNodes){
    if(node.nodeType == 3){
      if(node.length >= offset){
        // stop here
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(node, offset);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return -1;
      }
      offset -= node.length;
    }else{
      offset = SetCaretPosition(node, offset);
      if(offset == -1){
          return -1;
      }
    }
  }
  return offset;
}

@observer
export default class Paragraph extends Component{
  componentDidMount(){
    if(this.props.para.focus){
      ReactDOM.findDOMNode(this).focus();
      if(this.props.para.text){
        let el = ReactDOM.findDOMNode(this);
        SetCaretPosition(el, this.props.para.selectionStart.offset);
      }
    }
  }
  componentDidUpdate(param){
    // console.log(param.unique, 'updated');
    if(this.refs.true){
      ReactDOM.findDOMNode(this).focus();
      if(param.para.text){
        let el = ReactDOM.findDOMNode(this);
        SetCaretPosition(el, param.para.selectionStart.offset);
      }
    }
  }
  render(){
    const para = this.props.para;
    // const edit = this.props.edit;

    return (
        <div
          spellCheck
          contentEditable
          className={para.type}
          id={'paragraph'}
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
