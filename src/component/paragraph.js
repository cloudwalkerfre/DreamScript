import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ReactDOM from 'react-dom';


@observer
export default class Paragraph extends Component{
  componentDidMount(){
    if(this.props.para.focus){
      ReactDOM.findDOMNode(this).focus();
      if(this.props.para.text){
        SetCaretPosition(ReactDOM.findDOMNode(this), this.props.para.selectionStart.offset);
      }
    }
  }
  componentDidUpdate(param){
    // console.log(param.unique, 'updated', param.para.selectionStart.offset);
    if(this.refs.true){
      ReactDOM.findDOMNode(this).focus();
      if(param.para.text){
        SetCaretPosition(ReactDOM.findDOMNode(this), param.para.selectionStart.offset);
      }
    }
  }
  handlePaste(e){
    e.preventDefault();
    let copyStuff = e.clipboardData.getData('Text');
    let currentOffSet = RecursionCounter(e.target)[0];

    this.props.para.selectionStart.offset = currentOffSet + copyStuff.length;
    console.log(this.props.para.selectionStart.offset)

    let tmpHead = e.target.innerHTML.slice(0, currentOffSet);
    let tmpTail = e.target.innerHTML.slice(currentOffSet);
    this.props.para.innerHTML = tmpHead.concat(copyStuff,tmpTail);


    // e.target.innerHTML = this.props.para.innerHTML;
    // SetCaretPosition(ReactDOM.findDOMNode(this), this.props.para.selectionStart.offset);
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
          // onPaste={(e) => this.handlePaste(e)}
          dangerouslySetInnerHTML={{__html: para.innerHTML || ""}}
          data-placeholder={para.type.slice(5)}
          ref={para.focus}
          data-unique={this.props.unique}
          data-pageNumber={this.props.pageNumber}
        />
    )
  }
}

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


/* ------------------------------------------------------
  div-contentEditable cursor position calculator
  dealing with <b> <i> and so on...
------------------------------------------------------ */
function RecursionCounter(el){
  let textCount = 0;
  for(let node of el.childNodes){
    if(node.nodeType === 3){
      let range = window.getSelection().getRangeAt(0);
      let containerNode = range.startContainer;

      if(containerNode === node){
        textCount += range.startOffset;
        return ([textCount, true]);
      }
      textCount += node.textContent.length;
    }else{
      let tmp = RecursionCounter(node);
      textCount += tmp[0];
      if(tmp[1]){
        return ([textCount, true]);
      }
    }
  }
  return ([textCount, false]);
}
