(function(){
  $.fn.stripText = function(){
    $(this).each(function(i, el){
      var ref$, textPropName;
      if (this.nodeType === 3 && ((ref$ = this.parentNode) != null ? ref$.nodeName : void 8) !== 'SCRIPT') {
        textPropName = this.textContent === undefined ? 'nodeValue' : 'textContent';
        return this[textPropName] = '';
      } else {
        return $(this.childNodes).stripText();
      }
    });
    return this;
  };
}).call(this);
