
//*****************************************************************************
//******************************UserInputManager*******************************
//*****************************************************************************

 
var km_list = [];

function UserInputManager () {

//var __keyStatusQueue = [];

var userinputmanager = {
 keyStatus:0,
 goLeft:false,
 goRight:false,
 Jump:false,

 mouseX:0, 
 mouseY:0,
 initX:0,
 initY:0,

 isMouseDown:0,  // dispatch event  通知 canvas 绘制 瞄准 辅助
 isMouseUp:false,  // dispatch event 删除辅助
 isMouseMove:false, // dispatch event 力量槽 
 isShootable:false,
 prePareShoot:false,

 forceX:0,
 forceY:0,

 music:false, //
 gameover:false,
 pause:false,

 last_jump_time:0,
 last_attack_time:0, 


//var mousePVec,  selectedBody, mouseJoint,body,

//通过ID 拿到canvas
  canvas:0,
//var canvas          = canvas_;
  canvasPosition:0,
  context:0,
  canvasPositionX:0 ,canvasPositionY:0,


//优化
  u:0,
  detectbrowser:0,

};
 km_list.push(userinputmanager);

 userinputmanager.__proto__ = UserInputManager.prototype;
 return userinputmanager;

//跳跃和 发射都有CD， CD 时间相同  定位 600毫秒
}


UserInputManager.prototype.initListener = function(res) 
{
   this.canvas = document.getElementsByTagName('canvas')[0];  
   //this.canvas = document.getElementById("canvas");
   this.context = this.canvas.getContext("2d");
   this.canvasPosition = getElementPosition(this.canvas);
   this.canvasPositionX = this.canvasPosition.x;
   this.canvasPositionY = this.canvasPosition.y;   
   this.u = navigator.userAgent;
   this.detectbrowser   = (this.u.match(/AppleWebKit.*Mobile.*/));


//
//           移动端口  事件

if(this.detectbrowser||window.opera){
   console.log("on mobile");

//
//           移动端口  开始触摸
/*
   this.canvas.addEventListener("touchstart", function(e) {
//
//           移动端口  结束触摸
this.canvas.addEventListener("touchend", function(e) {
//
//           移动端口  划动
this.canvas.addEventListener("touchmove", function(e){

}
*/
}
//
//           PC  事件
else{

//
//           PC  鼠标点击
   this.canvas.addEventListener("mousedown", function(e) {
  // console.log("mousedown");
  //cd 
   km_list[0].isMouseDown = true;
   km_list[0].isMouseUp=false;
   km_list[0].isShootable =false;
   km_list[0].prePareShoot =true;

   //handleMouseMove(e);
   km_list[0].initX = (e.clientX - km_list[0].canvasPositionX) / 30;
   km_list[0].initY = (e.clientY - km_list[0].canvasPositionY) / 30;

   //document.addEventListener("mousemove", handleMouseMove, true);
}, true);

//
//           PC  鼠标放开

this.canvas.addEventListener("mouseup", function(e) {
//console.log("mouseup");
if(km_list[0].isMouseDown)
{
   km_list[0].isShootable = true;
   km_list[0].isMouseDown = false;
 }

   km_list[0].isMouseUp=true;
   km_list[0].last_attack_time = now();

   km_list[0].mouseX = (e.clientX - km_list[0].canvasPositionX) / 30;
   km_list[0].mouseY = (e.clientY - km_list[0].canvasPositionY) / 30;

   //console.log("initX:"+km_list[0].initX+"   mouseX:"+km_list[0].mouseX+"  initY:"+km_list[0].initY+"   mouseY:"+km_list[0].mouseY);


   km_list[0].forceX = 70*(km_list[0].mouseX-km_list[0].initX);
   km_list[0].forceY = 90*(km_list[0].mouseY-km_list[0].initY);
 //}

}, true);

//
//           PC  鼠标移动

this.canvas.addEventListener("mousemove", function(e){
   if(!this.isMouseDown) return;   
   km_list[0].isMouseMove = true;
   km_list[0].mouseX = (e.clientX - km_list[0].canvasPositionX) / 30;
   km_list[0].mouseY = (e.clientY - km_list[0].canvasPositionY) / 30;

}, true);


} //else   


// 按键事件 
       var button = document.getElementById("left");
       button.addEventListener("mousedown", function(e) {km_list[0].goLeft = true;},false)
       //button.addEventListener("mouseup", function(e) {  km_list[0].goLeft = false;},false)
       button.addEventListener("touchstart", function(e) { km_list[0].goLeft = true;},false)
       //button.addEventListener("touchend", function(e) {  km_list[0].goLeft = false;},false)

       button = document.getElementById("right");
       button.addEventListener("mousedown", function(e) { km_list[0].goRight = true;},false)
       //button.addEventListener("mouseup", function(e) {  km_list[0].goRight = false;},false)
       button.addEventListener("touchstart", function(e) { km_list[0].goRight = true;},false)
       //button.addEventListener("touchend", function(e) { km_list[0].goRight = false;},false) 

       button = document.getElementById("jump");
       button.addEventListener("mousedown", function(e) 
         { 
         //   console.log("jump");
        //    if( (now()-this.last_jump_time) < 600 )   //CD为0.6秒，因该越接近实际腾空时间越好
        //       return;
            km_list[0].last_jump_time = now();
            //this.Jump = true;
            km_list[0].Jump = true;            
         },false)

       button.addEventListener("touchstart",function(e) 
         {
       //    if( (now()-km_list[0].last_jump_time) < 600 )   //CD为0.6秒，因该越接近实际腾空时间越好
       //        return;
            km_list[0].last_jump_time = now();
           // this.Jump = true;
            km_list[0].Jump = true;            
         }
         , false)
     //  button.addEventListener("touchend", function(e) { this.Jump = false;}, false) 
        

       button = document.getElementById("Start");
       button.addEventListener("mousedown", function(e) 
        { 
          var playname = getElem("playerName").value;
          var position = getElem("playerPosition").value;         
                     //因该从表单处发到 express 
           //name 
           //isMain
           //tankType
           socket.emit('register',{name:playname, isMain: position });   
        }, false)
                
} // initListener 


UserInputManager.prototype.resetKey = function() 
{
  km_list[0].mouseup = false;
  //km_list[0].mousedown = false;
  km_list[0].Jump = false;
  km_list[0].goRight =false;
  km_list[0].goLeft =false;    
}



UserInputManager.prototype.resetMsg = function() 
{
//this.keyMsg = { 0,0,0,0,0,0 };
//console.log(this.keyMsg);
this.gameover = 0;
this.pause = 0;

this.isMouseUp = 0;
this.forceX = 0;
this.forceY = 0;

this.keyStatus = 0;
}

var _keyMap = {
    "jump": 1,  //jump
    "left": 2,   //left
    "right": 4,   //right
    "shoot":8,

}


UserInputManager.prototype.gen_key_msg = function(res) 
{
//服务器会在socket.io 存储 player信息,所以会对号入座

km_list[0].keyStatus = 0;

if(km_list[0].Jump)    km_list[0].keyStatus|= _keyMap["jump"];
if(km_list[0].goLeft)  km_list[0].keyStatus|= _keyMap["left"];
if(km_list[0].goRight) km_list[0].keyStatus|= _keyMap["right"];

 //console.log("[isShootable]",km_list[0].isShootable);

var dis = Math.sqrt(km_list[0].mouseX-km_list[0].initX) +  Math.sqrt(km_list[0].mouseY-km_list[0].initY );
if( dis >1.5 ) // 屏蔽 误操作
{
  if(km_list[0].isShootable && km_list[0].prePareShoot)
  {
      km_list[0].keyStatus |= 8;
      km_list[0].prePareShoot = false;

   // console.log("[x]",km_list[0].forceX);
    //console.log("[y]",km_list[0].forceY);    
  }
  else
  {
    //console.log("[isShootable]",km_list[0].isShootable);
    //console.log("[prePareShoot]",km_list[0].prePareShoot);
  }

}

  //引用传递,直接赋值是不行的
   var res =
   {
   "gameover": km_list[0].gameover, //游戏结束
   "pause":km_list[0].pause,       // 暂停
   "key": km_list[0].keyStatus, // 左 跳 右
   //"shoot":km_list[0].isShootable ,   //只有在发射炸弹时发生, 点击屏幕只默认一个目的：发射导弹 ,相当于 shootable
   "forceX":km_list[0].forceX, // 根据发射的 拉扯距离,发射角度，计算出 水平 和 垂直 力
   "forceY":km_list[0].forceY, //   
   };


//clear
  //km_list[0].mouseup = false;
  //km_list[0].mousedown = false;
  km_list[0].Jump = false;
  km_list[0].goRight =false;
  km_list[0].goLeft =false;


// "sync"

  return res

}
//*****************************************************************************
//******************************UserInputManager*******************************
//*****************************************************************************


