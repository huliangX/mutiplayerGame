
 function getElementPosition(element) {
   var elem=element, tagname="", x=0, y=0;
  
   while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
      y += elem.offsetTop;
      x += elem.offsetLeft;
      tagname = elem.tagName.toUpperCase();

      if(tagname == "BODY")
         elem=0;

      if(typeof(elem) == "object") {
         if(typeof(elem.offsetParent) == "object")
            elem = elem.offsetParent;
      }
   }

   return {x: x, y: y};
}


var now = function () {
    return new Date().getTime();
}

     



function getCanvas(){
 return getElem("canvas");
}

function getElem(id) {
 return document.getElementById(id);
}



var _keyMap = {
    "jump": 1,  //jump
    "left": 2,   //left
    "right": 4,   //right
    "shoot":8,


    // black hole 与 transfer Gate 由服务器控制生成
    // game end
    // game pause
}     