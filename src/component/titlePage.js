import React, {Component} from 'react';
import { observer } from 'mobx-react';

@observer
export default class TitlePage extends Component{
  render(){
    const {script} = this.props;
    // console.log(titlePage)
    return (
      <div className='dreamScriptPage titlePage' onBlur={(e) => script.handleTitle(e)}>
        <div contentEditable className='title_title' dangerouslySetInnerHTML={{__html: script.titlePage.title || ""}} />
        <div className='title_written' dangerouslySetInnerHTML={{__html: "Written by"}} />
        <div contentEditable className='title_author' dangerouslySetInnerHTML={{__html: script.titlePage.author || ""}} />
        <div contentEditable className='title_extra' dangerouslySetInnerHTML={{__html: script.titlePage.extra || ""}} />
        <div contentEditable className='title_contact' dangerouslySetInnerHTML={{__html: script.titlePage.contact || ""}} />
      </div>
    )
  }
}
