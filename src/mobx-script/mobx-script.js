import { observable, action, computed } from 'mobx';

export default class mobxScript{
  // Paragraph array
  @observable page = [];
  // Page iter_indicator, star to end
  @observable.struct pages = [];
  // Paragraph selector
  @observable selectbox = {};
  // Paragraph type
  @observable.ref options =  ['para-scene', 'para-action','para-character','para-parenthetical','para-dialogue','para-transition','para-shot'];
  // Paragraph margins
  @observable.ref Hdata = {'para-fadein': 20, 'para-action': 20, 'para-scene': 30, 'para-shot': 30, 'para-character': 20, 'para-dialogue': 0, 'para-parenthetical': 0, 'para-transition': 20};


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
    this.page.push({type: 'para-fadein', focus: true, text: 'FADE IN:', selectionStart: 8, height: 16 + this.Hdata['para-fadein'], key: Math.random(), line: 1});
    this.pages.push([0,0]);
    this.selectbox = {top:0, left:0,right:0, display: 'none'};
  }


  // @computed get pageArray(){
  //   return this.page;
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
      const paraLength = this.page.length;

      for(;Iter < paraLength; Iter++){
        height += this.page[Iter].height;
        // console.log(height)
        if(height > 920 && height < 980){
          this.pages[pageCount] = [flag, Iter];
          height = 0;
          pageCount++;
          flag = Iter;

          this.pages[pageCount] = [flag, 0];
          console.log(pageCount)
        }

        else if(height > 950){
          // stay where you are
          this.pages[pageCount] = [flag, --Iter];
          height = 0;
          pageCount++;
          flag = Iter;

          this.pages[pageCount] = [flag, 0];
          console.log(pageCount)
        }
      }
      if(pageCount < pageNumOld){
        this.pages.splice(pageCount + 1);
      }
  };

  /* ------------------------------------------------------

    handle paragraph selection

  ------------------------------------------------------ */
  @action handleSelect(e, index){
    // console.log(e.target.value, index)

    e.preventDefault();
    let className = e.target.value;
    this.selectbox.display='none';

    this.page[index].type = className;
    this.page[index].height = 16 + this.Hdata[className];
    this.page[index].text = '';
    this.page[index].focus = true;
  }


  /* ------------------------------------------------------

    short-cut setting stuff...

  ------------------------------------------------------ */
  @action handleKey(e, index){
    // console.log(e.keyCode, e.target.selectionStart)
    // console.log(e.target.getBoundingClientRect());
    // console.log(e.target)

    /* ------------------------------------------------------
    calculate and update qurrent target height and line
    ------------------------------------------------------ */
    if(e.target.value != this.page[index].text){
      this.page[index].text = e.target.value;
      let targetHeight = 0;
      let cluster = this.page[index].type === 'para-dialogue' ? 35 : 61;
      let lineNum = this.page[index].text ? this.page[index].text.split('\n').length : 1;
      // count line number including wrap
      if(this.page[index].text){
        this.page[index].text.split('\n').forEach(line => {
          if(line.length > cluster){
            lineNum += parseInt(line.length/cluster)
          }
        })
      }
      targetHeight += (this.Hdata[this.page[index].type] + 16 * lineNum)

      if(this.page[index].height != targetHeight){
        this.page[index].height = targetHeight;
        this.page[index].line = lineNum;
      }
    }

    let newPara;
    let changingFlag = true;


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
      If current paragraph is empty, updating current focus target position
      for a selectbox
      ------------------------------------------------------ */
      if(!this.page[index].text){
        e.preventDefault();

        this.selectbox.top = e.target.getBoundingClientRect().top;
        this.selectbox.top += this.page[index].height;

        this.selectbox.left = e.target.getBoundingClientRect().left;
        this.selectbox.right = e.target.getBoundingClientRect().right;

        // show selectbox
        this.selectbox.index = index;
        this.selectbox.display = 'block';
        this.page[index].focus = false;

      }

      /* ------------------------------------------------------
      If current paragraph is not empty, adding a new paragraph
      ------------------------------------------------------ */
      newPara = {type: this.options[e.keyCode - 49], focus: true, height: 16 + this.Hdata[this.options[e.keyCode - 49]], key: Math.random(), line: 1};
      // case: ctrl+4 => parenthetical
      if(e.keyCode === 52){
        newPara.text = '()';
        newPara.selectionStart = 1
      }
      this.page.splice(index + 1, 0, newPara);
      this.page[index].focus = false;

      // console.log(this.page[index].type);
    }

    /* ------------------------------------------------------
      If keydown Enter:

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
      if(!this.page[index].text){
        e.preventDefault();

        this.selectbox.top = e.target.getBoundingClientRect().top;
        this.selectbox.top += this.page[index].height;

        this.selectbox.left = e.target.getBoundingClientRect().left;
        this.selectbox.right = e.target.getBoundingClientRect().right;

        // show selectbox
        this.selectbox.index = index;
        this.selectbox.display = 'block';
        this.page[index].focus = false;

      }

      /* ------------------------------------------------------
      If current paragraph is not empty, adding a new paragraph
      ------------------------------------------------------ */
      else if(!e.shiftKey){
        e.preventDefault();

        let className = e.target.className;
        switch (className) {
          case 'para-fadein':
            newPara = {type: 'para-scene', focus: true, height: 16 + this.Hdata['para-scene'], key: Math.random(), line: 1};
            this.page.splice(index + 1, 0, newPara);
            this.page[index].focus = false;
            break;
          case 'para-action':
            newPara = {type: 'para-action', focus: true, height: 16 + this.Hdata['para-action'], key: Math.random(), line: 1};
            this.page.splice(index + 1, 0, newPara);
            this.page[index].focus = false;
            break;
          case 'para-scene':
            newPara = {type: 'para-action', focus: true, height: 16 + this.Hdata['para-action'], key: Math.random(), line: 1};
            this.page.splice(index + 1, 0, newPara);
            this.page[index].focus = false;
            break;
          case 'para-character':
            newPara = {type: 'para-dialogue', focus: true, height: 16 + this.Hdata['para-dialogue'], key: Math.random(), line: 1};
            this.page.splice(index + 1, 0, newPara);
            this.page[index].focus = false;
            break;
          case 'para-parenthetical':
            newPara = {type: 'para-dialogue', focus: true, height: 16 + this.Hdata['para-dialogue'], key: Math.random(), line: 1};
            this.page.splice(index + 1, 0, newPara);
            this.page[index].focus = false;
            break;
          case 'para-dialogue':
            newPara = {type: 'para-action', focus: true, height: 16 + this.Hdata['para-action'], key: Math.random(), line: 1};
            this.page.splice(index + 1, 0, newPara);
            this.page[index].focus = false;
            break;
          case 'para-transition':
            newPara = {type: 'para-scene', focus: true, height: 16 + this.Hdata['para-scene'], key: Math.random(), line: 1};
            this.page.splice(index + 1, 0, newPara);
            this.page[index].focus = false;
            break;
          case 'para-shot':
            newPara = {type: 'para-action', focus: true, height: 16 + this.Hdata['para-action'], key: Math.random(), line: 1};
            this.page.splice(index + 1, 0, newPara);
            this.page[index].focus = false;
            break;
        }
      }
    }

    /* ------------------------------------------------------
      If keydown delete when empty text
    ------------------------------------------------------ */
    else if (e.keyCode === 8 && !this.page[index].text) {
      e.preventDefault();
      if(index != 0){
        this.page[index - 1].focus = true;
        this.page[index - 1].selectionStart = this.page[index - 1].text ? this.page[index - 1].text.length : 0;
        this.page.splice(index, 1);
      }
    }


    /* ------------------------------------------------------
    keys that have no effect on pageHeight
    ------------------------------------------------------ */
    else if([37, 38, 39, 40].indexOf(e.keyCode) != -1){
      changingFlag = false;
      /* ------------------------------------------------------
      If keydown backward when cursor at begining
      ------------------------------------------------------ */
      if(e.keyCode === 37 && e.target.selectionStart === 0){
        if(index != 0){
          e.preventDefault();
          this.page[index].focus = false;
          this.page[index - 1].focus = true;
          this.page[index - 1].selectionStart = this.page[index - 1].text ? this.page[index - 1].text.length : 0;
        }
      }

      /* ------------------------------------------------------
      If keydown forward when cursor at end
      ------------------------------------------------------ */
      else if(e.keyCode === 39 && e.target.selectionStart === this.page[index].text.length){
        if(index != this.page.length - 1){
          e.preventDefault();
          this.page[index].focus = false;
          this.page[index + 1].focus = true;
          this.page[index + 1].selectionStart = 0;
        }
      }

      /* ------------------------------------------------------
      If keydown up
      ------------------------------------------------------ */
      else if(e.keyCode === 38 && this.page[index].text.substr(0, e.target.selectionStart).split('\n').length === 1 ){
        if(index != 0){
          e.preventDefault();
          this.page[index].focus = false;
          this.page[index - 1].focus = true;
          // set cursor of prev paragraph relative to the first line of current paragraph
          this.page[index - 1].selectionStart =
          (this.page[index - 1].text.length - (this.page[index - 1].text.split('\n').reverse())[0].length) +
          ((this.page[index - 1].text.split('\n').reverse())[0].length) * ( e.target.selectionStart / this.page[index].text.split('\n')[0].length);
        }
      }

      /* ------------------------------------------------------
      If keydown down
      ------------------------------------------------------ */
      else if(e.keyCode === 40 && this.page[index].text.substr(0, e.target.selectionStart).split('\n').length === this.page[index].text.split('\n').length){
        if(index != this.page.length - 1){
          e.preventDefault();
          this.page[index].focus = false;
          this.page[index + 1].focus = true;
          // set cursor of next paragraph relative to the last line of current paragraph
          this.page[index + 1].selectionStart =
          (this.page[index + 1].text ? this.page[index + 1].text.split('\n')[0].length : 0)*
          ((e.target.selectionStart - this.page[index].text.lastIndexOf('\n')) / (this.page[index].text.split('\n').reverse())[0].length);
        }
      }
    }


    changingFlag ? this.pageSeperation_monitor(parseInt(e.target.attributes['data-pageNumber'].value)) : '';
  }

}
