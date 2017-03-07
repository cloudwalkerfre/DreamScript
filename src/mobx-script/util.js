export default class util{
  /* ------------------------------------------------------
    div-contentEditable cursor position calculator
    dealing with <b> <i> and so on...
  ------------------------------------------------------ */
  static RecursionCounter(el){
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
        let tmp = this.RecursionCounter(node);
        textCount += tmp[0];
        if(tmp[1]){
          return ([textCount, true]);
        }
      }
    }
    return ([textCount, false]);
  }

  /* ------------------------------------------------------
    Find and place cursor in div-editable
  ------------------------------------------------------ */
  static SetCaretPosition(el, offset){
    for(let node of el.childNodes){
      if(node.nodeType == 3){
        if(node.length >= offset){
          // stop here
          let range = document.createRange();
          let sel = window.getSelection();
          range.setStart(node, offset);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          return -1;
        }
        offset -= node.length;
      }else{
        offset = this.SetCaretPosition(node, offset);
        if(offset == -1){
          return -1;
        }
      }
    }
    return offset;
  }

  /* ------------------------------------------------------
    delete selected content
  ------------------------------------------------------ */
  static deleteContent(){
    window.getSelection().getRangeAt(0).deleteContents()
  }

  /* ------------------------------------------------------
    return true if startOffSet != endOffSet
  ------------------------------------------------------ */
  static isSelected(){
    let range = window.getSelection().getRangeAt(0);
    return range.startOffset != range.endOffset
  }

}
