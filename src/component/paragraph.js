import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ReactDOM from 'react-dom';
import util from '../mobx-script/util'


@observer
export default class Paragraph extends Component{
  componentDidMount(){
    if(this.props.para.focus){
      ReactDOM.findDOMNode(this).focus();
      if(this.props.para.text){
        util.SetCaretPosition(ReactDOM.findDOMNode(this), this.props.para.selectionStart.offset);
      }
    }
  }
  componentDidUpdate(param){
    // console.log(param.unique, 'updated', param.para.selectionStart.offset);
    if(this.refs.true){
      ReactDOM.findDOMNode(this).focus();
      if(param.para.text){
        util.SetCaretPosition(ReactDOM.findDOMNode(this), param.para.selectionStart.offset);
      }
    }
  }
  handlePaste(e){
    e.preventDefault();
    // console.log('pasting!')

    // incase there is a selection need to be replaced
    util.deleteContent();

    // clipboard only take palin text
    let copyStuff = e.clipboardData.getData('text/plain');
    let tmpOffSet = util.RecursionCounter(e.target)[0];

    let tmpHead = e.target.innerHTML.slice(0, tmpOffSet);
    let tmpTail = e.target.innerHTML.slice(tmpOffSet);

    // this.props.para.selectionStart.offset = tmpOffSet + copyStuff.length;
    e.target.innerHTML = tmpHead.concat(copyStuff,tmpTail);

    // update cursor after paste
    util.SetCaretPosition(e.target, tmpOffSet + copyStuff.length);
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
          onPaste={(e) => this.handlePaste(e)}
          dangerouslySetInnerHTML={{__html: para.innerHTML || ""}}
          data-placeholder={para.type.slice(5)}
          ref={para.focus}
          data-unique={this.props.unique}
          data-pageNumber={this.props.pageNumber}
        />
    )
  }
}
