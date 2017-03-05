import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import Paragraph from './paragraph'


@observer
export default class Script extends Component{
  // constructor(props){
  //   super(props)
  //   this.props.script.edit = true;
  // }
  // setEditable(){
  //   // console.log('page click')
  //   this.props.script.edit = false;
  // }
  render(){
    const {script} = this.props;
    const pageIter = this.props.pageIter;
    const pageNumber = this.props.pageNumber;

    // console.log('iter', pageIter[0], 'number', pageNumber, '!', script.paragraphs.length)

    //Paragraphs go in here
    const Paras = [];

    // console.log('what\'s here', toJS(script.paragraphs))
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
