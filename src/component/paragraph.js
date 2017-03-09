import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ReactDOM from 'react-dom';
import util from '../mobx-script/util'


@observer
export default class Paragraph extends Component{
  componentDidMount(){
    if(this.props.para.focus){
      // console.log('mount', this.props.unique)
      ReactDOM.findDOMNode(this).focus();
      if(this.props.para.text){
        // set cursor to position
        util.SetCaretPosition(ReactDOM.findDOMNode(this), this.props.para.selectionStart.offset);
      }
    }
  }
  componentDidUpdate(param){
    // console.log(param.unique, 'updated', param.para.selectionStart.offset);
    if(this.refs.true){
      // console.log('update', param.unique)
      ReactDOM.findDOMNode(this).focus();
      if(param.para.text){
        // set cursor to position
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
    // the same function may running twice if paste cause paragraph height changing which will case pageSeperation_monitor()
    // if pageSeperation_monitor decided to reRender page, componentDidUpdate will be called, but it's not big of a deal
    util.SetCaretPosition(e.target, tmpOffSet + copyStuff.length);
  }
  render(){
    const para = this.props.para;
    /*------------------------------------------------------

      This is a home-made contentEditable div
      It's rough and simple and dumb as fuck, but => it's working !
      And I think that's what matters here

      I once read a CKEditor developer's post on stackoverflow:
        - you can dive in this and hard coding all you want
        - but you'll GET LOST
        - because no matter what you do, html text editor will always be buggy
        - that's just the way it is

      I set a goal before doing all of this:  - as simple as possible -
      But somewhere in the middle I find myself dealing with paste, cursor position and all those dirty stuff
      And I don't see a way out ...

      So I made my call =>
        Can you write a script based on what we have, yes you can, and that's enough

      Not excusing myself, you can try write a story, and see for yourself if it's enough

      ===================== read below =====================

      There's two state of text, just like other react apps
        - the one in Store(MobxScript), and the one in View(<Paragraph>)

      Those two will synchronize:
        - when a Blur event happen - user start a new paragraph or save (MobxScript.handleBlur)
        - when Paragraph's height changing - pageSeperation_monitor decided to reRender page (MobxScript.handleKey)
      That's basicly the minimum Store changing, text is not an issue for rendering, yet it can go 100+ or even 200+ pages
      So we keep it as low as possible

      Action between paragraphs:
        - key up, focus on previous one if cursor at line top, and set cursor at previous' line bottom
        - key down, focus on next one if cursor at line bottom, and set cursor at next's line top
        - key delete, when cursor at text-start,
          focus on previous one if both this and prevous one is not empty, and set cursor at end of previous
          else if this one is empty, delete this one, else if previous one is empty, then delete previous one
        - key backward, focus on previous one if cursor at text-start, and set cursor at end of previous
        - key forward, focus on next one if cursor at text-end, and set cursor at start of next

        -key enter
          if current paragraph is not empty, start a new paragraph based on current one's type:
              FadeIn => new Scene
              Action => new Action
              Scene => new Action
              Character => new Dialogue
              Parenthetical => new Dialogue
              Dialogue => new Action
              Transition => new Scene
              Shot => new Action
          else pop up selectbox

        - short-cut
          if current paragraph is not empty, start a new paragraph:
              ctrl + 1 => new Scene Heading
              ctrl + 2 => new Action
              ctrl + 3 => new Character
              ctrl + 4 => new Parenthetical
              ctrl + 5 => new Dialogue
              ctrl + 6 => new Transition
              ctrl + 7 => new Shot
          else pop up selectbox

        - paste
          paste will only return plain text, with format is not possible, beacuse it's uncontrollable

        - other
          command + b will generate bold font
          command + i will generate italic font

      There you have it, folks, my shitty editor, aka DreamScript.


    ------------------------------------------------------*/
    return (
        <div
          spellCheck
          contentEditable
          className={para.type}
          id={'paragraph'}
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
