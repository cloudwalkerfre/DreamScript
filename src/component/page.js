import React, { Component } from 'react';
// import { TextArea } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react';
import Paragraph from './paragraph'


@inject('script') @observer
export default class Script extends Component{

  render(){
    const {script} = this.props;
    const pageIter = this.props.pageIter;
    const pageNumber = this.props.pageNumber;

    //Paragraphs go in here
    const Paras = [];

    // console.log(pageIter)

    for(let index = pageIter[0]; index < (pageIter[1] === 0 ? script.page.length : Math.min(script.page.length, pageIter[1])); index++){
      Paras.push(<Paragraph key={script.page[index].key}  index={index} />)
    }
    return (
      <div className='page'>
        <span className='pageNumber'>
          {pageNumber + 1}.
        </span>
        <div className='paragraphs'>
          {Paras}
        </div>
      </div>
    )
  }
}
