import React, {Component} from 'react';
import { observer } from 'mobx-react';

@observer
export default class TitlePage extends Component{
  render(){
    const {titlePage} = this.props;
    // console.log(titlePage)
    return (
      <div contentEditable className='page titlePage'>
        <div className='title_title'>{titlePage.title}</div>
        <div className='title_written'>Written by</div>
        <div className='title_author'>{titlePage.author}</div>
        <div className='title_extra'>{titlePage.extra}</div>
        <div className='title_contact'>{titlePage.contact}</div>
      </div>
    )
  }
}
