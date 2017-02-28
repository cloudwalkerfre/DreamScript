import React, { Component } from 'react';
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

    for(let index = pageIter[0]; index < (pageIter[1] === 0 ? script.paragraphs.length : Math.min(script.paragraphs.length, pageIter[1])); index++){
      Paras.push(<Paragraph key={script.paragraphs[index].key}  para={script.paragraphs[index]} unique={index} pageNumber={pageNumber} />)
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
