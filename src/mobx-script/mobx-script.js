import { observable, action } from 'mobx';

/*

  This class maintain page and paragraph state for REACT to render, and handle all the related keypress function

*/
export default class mobxScript{
  // Paragraph array
  @observable paragraphs = [];
  // Page iter_indicator, star to end
  @observable.struct pages = [];
  // Paragraph selector
  @observable selectbox = {};
  // Paragraph type
  @observable.ref options =  ['para-scene', 'para-action','para-character','para-parenthetical','para-dialogue','para-transition','para-shot'];
  // Paragraph margins
  @observable.ref Hdata = {'para-fadein': 20, 'para-action': 20, 'para-scene': 30, 'para-shot': 30, 'para-character': 20, 'para-dialogue': 0, 'para-parenthetical': 0, 'para-transition': 20};
  // char number in line of each type of paragraph, based on 12pt courier font family,
  // which is the standard font in movie script, so we really don't need the extra calculating work
  @observable.ref lineCharNum = {'para-fadein': 61, 'para-action': 61, 'para-scene': 61, 'para-shot': 61, 'para-character': 61, 'para-dialogue':35, 'para-parenthetical': 35, 'para-transition': 61};

  // @observable cursor = 0;
  //
  // @observable Action = [];
  // @observable Character = [];
  // @observable Scene = [];
  // @observable Dialogue = [];
  // @observable Shot = [];
  // @observable Transition = [];
  // @observable Parenthetical = [];
  // @observable General = [];


  constructor(){
    // First line is always FADE IN:
    this.paragraphs.push({type: 'para-fadein', focus: true, innerHTML: 'FADE IN:', text: 'FADE IN:', selectionStart: {line:0,offset:8}, height: 16 + this.Hdata['para-fadein'], key: Math.random(), line: 1});
    // Initialize first page
    this.pages.push([0,0]);
    // Initialize select box
    this.selectbox = {top:0, left:0,right:0, display: 'none'};
  }


  // @computed get pageArray(){
  //   return this.paragraphs;
  // }
  //
  // @computed get pageIter(){
  //   return this.pages;
  // }

  /* ------------------------------------------------------

    page separation monitor

  ------------------------------------------------------ */
  @action pageSeperation_monitor(current_page){
      //go back one more page when counting
      current_page = (current_page === 0 ? 0 : current_page -- );
      // console.log(current_page, this.pages.length, this.pages[0][0])

      let height = 0;
      let Iter = this.pages[current_page][0];
      let pageCount = current_page;
      let flag = this.pages[current_page][0];

      let pageNumOld = this.pages.length;
      const paraLength = this.paragraphs.length;

      /*
        How to maintain the certain height of script is join effort of both
        software and writer's personal preference, because it's the type of
        thing that hint about the rhythm and flow of a script...
        So, if you want to keep it short, just type in empty graphs with space.
        I leave the most area that you can work with.
      */
      for(;Iter < paraLength; Iter++){
        height += this.paragraphs[Iter].height;
        // console.log(height)
        if(height > 920 && height < 980){
          this.pages[pageCount] = [flag, Iter];
          height = 0;
          pageCount++;
          flag = Iter;

          this.pages[pageCount] = [flag, 0];
          // console.log(pageCount)
        }

        else if(height >= 980){
          // stay where you are
          this.pages[pageCount] = [flag, --Iter];
          height = 0;
          pageCount++;
          flag = Iter;

          this.pages[pageCount] = [flag, 0];
          // console.log(pageCount)
        }
      }
      if(pageCount < pageNumOld){
        this.pages.splice(pageCount + 1);
      }
  };

  /* ------------------------------------------------------

    handle paragraph selection

    Select Box will pop up under two condition:
      1. you press enter when your current paragraph is empty
      2. you make a short-cut call when your paragraph is empty

    which means, empty graphs is not allowed, If you want blank space,
    just type in space and leave it.

  ------------------------------------------------------ */
  @action handleSelect(e, index){
    // console.log(e.target.value, index, e.keyCode)

    e.preventDefault();
    let className = e.target.value;
    this.selectbox.display='none';

    this.paragraphs[index].type = className;
    this.paragraphs[index].height = 16 + this.Hdata[className];
    this.paragraphs[index].text = this.paragraphs[index].innerHTML = (className === 'para-parenthetical' ? "()" : "");
    this.paragraphs[index].focus = true;
    this.paragraphs[index].selectionStart = (className === 'para-parenthetical' ? {line:0,offset:1} : {line:0,offset:0});
    this.paragraphs[index].line = 1;
  }

  /*
    disappearing the select box when scrolling
  */
  // @action handleScroll(){
  //   this.selectbox.display='none';
  // }


  /* ------------------------------------------------------

    short-cut setting stuff...

  ------------------------------------------------------ */
  @action handleKey(e, index){
    const targetElement = e.target;
    const targetId = targetElement.id;
    const targetClassName = targetElement.className;
    const targetInnerHTML = targetElement.innerHTML;
    const targetText = targetElement.textContent;
    const targetHeight = targetElement.offsetHeight + this.Hdata[targetClassName];

    let newPara;
    let changingFlag = true;

    /*
      compute cursor line and offset in current div-editable
    */
    if(targetId === 'paragraph'){
      this.paragraphs[index].selectionStart.offset = RecursionCounter(targetElement)[0];
      this.paragraphs[index].selectionStart.line = parseInt(this.paragraphs[index].selectionStart.offset / this.lineCharNum[targetClassName]);
    }

    /* ------------------------------------------------------
      calculate and update qurrent target height and line
    ------------------------------------------------------ */
    if(targetInnerHTML != this.paragraphs[index].innerHTML){
      // we need them both
      this.paragraphs[index].innerHTML = targetInnerHTML;
      this.paragraphs[index].text = targetText;
      this.paragraphs[index].height = targetHeight;

      // updating line number
      this.paragraphs[index].line = parseInt(targetText.length / this.lineCharNum[targetClassName]) + 1;
    }

    //// ======================     DEBUG HERE    ========================================== ////

    // console.log(this.paragraphs[index].selectionStart.offset, this.paragraphs[index].text.length)
    // console.log(this.paragraphs[index].line, this.paragraphs[index].selectionStart.line)

    //// ======================     DEBUG HERE    ========================================== ////


    /* ------------------------------------------------------
      ctrl is bind fro mac, windows not considered... sorry

      ctrl + 1 => Scene Heading
      ctrl + 2 => Action
      ctrl + 3 => Character
      ctrl + 4 => Parenthetical
      ctrl + 5 => Dialogue
      ctrl + 6 => Transition
      ctrl + 7 => Shot
    ------------------------------------------------------ */
    if(e.ctrlKey && [49,50,51,52,53,54,55].indexOf(e.keyCode) != -1){

      /* ------------------------------------------------------
        If current paragraph is empty, updating current focus
        target position for a selectbox
      ------------------------------------------------------ */
      if(this.paragraphs[index].innerHTML.length === 0){
        e.preventDefault();
        const ClientRect = targetElement.getBoundingClientRect();

        this.selectbox.top = ClientRect.top;
        this.selectbox.top += this.paragraphs[index].height;

        this.selectbox.left = ClientRect.left;
        this.selectbox.right = ClientRect.right;

        // show selectbox
        this.selectbox.index = index;
        this.selectbox.display = 'block';
        this.paragraphs[index].focus = false;
      }else{

        /* ------------------------------------------------------
          If current paragraph is not empty, adding a new paragraph
        ------------------------------------------------------ */
        newPara = {type: this.options[e.keyCode - 49], focus: true, height: 16 + this.Hdata[this.options[e.keyCode - 49]], key: Math.random(), line: 1, selectionStart: {line:0,offset:0}};
        // case: ctrl+4 => parenthetical
        if(e.keyCode === 52){
          newPara.innerHTML = newPara.text = "()";
          newPara.selectionStart = {line:0,offset:1}
        }
        this.paragraphs.splice(index + 1, 0, newPara);
        this.paragraphs[index].focus = false;

        // console.log(this.paragraphs[index].type);
      }

    }

    /* ------------------------------------------------------
      If keydown Enter, logic goes this:

      FadeIn => new Scene
      Action => new Action
      Scene => new Action
      Character => new Dialogue
      Parenthetical => new Dialogue
      Dialogue => new Action
      Transition => new Scene
      Shot => new Action
    ------------------------------------------------------ */
    else if(e.keyCode === 13){
      /* ------------------------------------------------------
        If current paragraph is empty, updating current focus target position
        for a selectbox
      ------------------------------------------------------ */
      if(this.paragraphs[index].innerHTML.length === 0){
        e.preventDefault();
        const ClientRect = targetElement.getBoundingClientRect();

        this.selectbox.top = ClientRect.top;
        this.selectbox.top += this.paragraphs[index].height;

        this.selectbox.left = ClientRect.left;
        this.selectbox.right = ClientRect.right;

        // show selectbox
        this.selectbox.index = index;
        this.selectbox.display = 'block';
        this.paragraphs[index].focus = false;
      }

      /* ------------------------------------------------------
        If current paragraph is not empty, adding a new paragraph
        Do not allowed shift-enter, just satrt a new paragraph
      ------------------------------------------------------ */
      else{
        e.preventDefault();

        switch (targetClassName) {
          case 'para-fadein':
            newPara = {type: 'para-scene', focus: true, height: 16 + this.Hdata['para-scene'], key: Math.random(), line: 1, selectionStart: {line:0,offset:0}};
            this.paragraphs.splice(index + 1, 0, newPara);
            this.paragraphs[index].focus = false;
            break;
          case 'para-action':
            newPara = {type: 'para-action', focus: true, height: 16 + this.Hdata['para-action'], key: Math.random(), line: 1, selectionStart: {line:0,offset:0}};
            this.paragraphs.splice(index + 1, 0, newPara);
            this.paragraphs[index].focus = false;
            break;
          case 'para-scene':
            newPara = {type: 'para-action', focus: true, height: 16 + this.Hdata['para-action'], key: Math.random(), line: 1, selectionStart: {line:0,offset:0}};
            this.paragraphs.splice(index + 1, 0, newPara);
            this.paragraphs[index].focus = false;
            break;
          case 'para-character':
            newPara = {type: 'para-dialogue', focus: true, height: 16 + this.Hdata['para-dialogue'], key: Math.random(), line: 1, selectionStart: {line:0,offset:0}};
            this.paragraphs.splice(index + 1, 0, newPara);
            this.paragraphs[index].focus = false;
            break;
          case 'para-parenthetical':
            newPara = {type: 'para-dialogue', focus: true, height: 16 + this.Hdata['para-dialogue'], key: Math.random(), line: 1, selectionStart: {line:0,offset:0}};
            this.paragraphs.splice(index + 1, 0, newPara);
            this.paragraphs[index].focus = false;
            break;
          case 'para-dialogue':
            newPara = {type: 'para-action', focus: true, height: 16 + this.Hdata['para-action'], key: Math.random(), line: 1, selectionStart: {line:0,offset:0}};
            this.paragraphs.splice(index + 1, 0, newPara);
            this.paragraphs[index].focus = false;
            break;
          case 'para-transition':
            newPara = {type: 'para-scene', focus: true, height: 16 + this.Hdata['para-scene'], key: Math.random(), line: 1, selectionStart: {line:0,offset:0}};
            this.paragraphs.splice(index + 1, 0, newPara);
            this.paragraphs[index].focus = false;
            break;
          case 'para-shot':
            newPara = {type: 'para-action', focus: true, height: 16 + this.Hdata['para-action'], key: Math.random(), line: 1, selectionStart: {line:0,offset:0}};
            this.paragraphs.splice(index + 1, 0, newPara);
            this.paragraphs[index].focus = false;
            break;
        }
      }
    }

    /* ------------------------------------------------------
      If keydown delete when empty text
    ------------------------------------------------------ */
    else if (e.keyCode === 8 && !this.paragraphs[index].innerHTML) {
      e.preventDefault();
      if(index != 0){
        this.paragraphs[index - 1].focus = true;
        this.paragraphs[index - 1].selectionStart = {line: this.paragraphs[index - 1].line - 1, offset: this.paragraphs[index - 1].text.length};
        this.paragraphs.splice(index, 1);
      }
    }



    /* ------------------------------------------------------
      If keydown backward when cursor at begining
    ------------------------------------------------------ */
    else if(e.keyCode === 37 && this.paragraphs[index].selectionStart.offset === 0){
      if(index != 0){
        e.preventDefault();
        this.paragraphs[index].focus = false;
        this.paragraphs[index - 1].focus = true;
        this.paragraphs[index - 1].selectionStart = {line: this.paragraphs[index - 1].line - 1, offset: this.paragraphs[index - 1].text.length};
      }
    }

    /* ------------------------------------------------------
      If keydown forward when cursor at end
    ------------------------------------------------------ */
    else if(e.keyCode === 39 && this.paragraphs[index].selectionStart.offset === this.paragraphs[index].text.length){
      if(index != this.paragraphs.length - 1){
        e.preventDefault();
        this.paragraphs[index].focus = false;
        this.paragraphs[index + 1].focus = true;
        this.paragraphs[index + 1].selectionStart = {line: 0, offset: 0};
      }
    }

    /* ------------------------------------------------------
      If keydown up
    ------------------------------------------------------ */
    else if(e.keyCode === 38 && this.paragraphs[index].selectionStart.line === 0){
      if(index != 0){
        e.preventDefault();
        this.paragraphs[index].focus = false;
        this.paragraphs[index - 1].focus = true;
        // set cursor of prev paragraph relative to the first line of current paragraph
        this.paragraphs[index - 1].selectionStart = {line: this.paragraphs[index - 1].line - 1, offset: 0}
      }
    }

    /* ------------------------------------------------------
      If keydown down
    ------------------------------------------------------ */
    else if(e.keyCode === 40 && this.paragraphs[index].selectionStart.line === this.paragraphs[index].line - 1){
      if(index != this.paragraphs.length - 1){
        e.preventDefault();
        this.paragraphs[index].focus = false;
        this.paragraphs[index + 1].focus = true;
        // set cursor of next paragraph relative to the last line of current paragraph
        this.paragraphs[index + 1].selectionStart = {line: 0, offset: 0}
      }
    }

    /* ------------------------------------------------------
      Paragraphs do not need to reArranging into pages
    ------------------------------------------------------ */
    // TODOS...

    /* ------------------------------------------------------
      ReArranging Paragraphs into Pages
    ------------------------------------------------------ */
    if(changingFlag){
      this.pageSeperation_monitor(parseInt(targetElement.attributes['data-pageNumber'].value))
    }
  }

} // End of mobx-script

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
