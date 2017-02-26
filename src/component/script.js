import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactDOM from 'react-dom';

import Page from './page'
import SelectBox from './selectbox'



@inject('script') @observer
export default class Script extends Component{

  render(){
    const {script} = this.props;
    return (
      <div className='script'>
        <SelectBox selectbox={script.selectbox}/>
        {script.pages.map( (pageIter, i) =>
          <Page key={i} pageIter={pageIter} pageNumber={i}/>
       )}
      </div>
    )
  }
}
