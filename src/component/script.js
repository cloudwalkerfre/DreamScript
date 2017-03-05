import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {toJS} from 'mobx';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';


import Page from './page'
import TitlePage from './titlePage'
import SelectBox from './selectbox'

@inject('MobxScript') @observer
export default class Script extends Component{
  constructor(props){
    super(props);

    this.id = props.params.id;

    // using _id to get script from db
    props.MobxScript.db.find({_id: parseInt(this.id)}, (err, doc) => {
      // console.log(this.id, doc)
      if(doc.length != 0){
        // console.log(doc[0].content, toJS(props.MobxScript.paragraphs))
        props.MobxScript.paragraphs = doc[0].content;
        props.MobxScript.pages = doc[0].pages;
        props.MobxScript.titlePage = doc[0].titlePage;
        props.MobxScript.lastSave = doc[0]._id;
      }else{
        console.log('Can not find script in Database !' )
      }
    });
  }
  // componentWillUpdate(a,b){
  //   // console.log(123);
  //   return false;
  // }
  handleBack(){
    this.props.MobxScript.saveScript();
    browserHistory.replace('/');
  }

  render(){
    const {MobxScript} = this.props;
    return (
      <div className='script'>
        <div className='script_tool'>
          <div className='script_save' onClick={() => MobxScript.saveScript()}>save</div>
          <div className='script_back' onClick={() => this.handleBack()}>back</div>
        </div>

        <TitlePage titlePage={MobxScript.titlePage} />
        <SelectBox script={MobxScript}/>

        {MobxScript.pages.map( (pageIter, i) =>
          <Page key={i} pageIter={pageIter} pageNumber={i} script={MobxScript}/>
       )}
      </div>
    )
  }
}
