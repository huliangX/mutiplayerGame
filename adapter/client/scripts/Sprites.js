//******************************************************************************************************
//*********************************************Sprites**************************************************
//******************************************************************************************************
    var stage;
    var screen_width;
    var screen_height;
    var bmpAnimation;
    var bmpAnimationIdle;

    var numberOfImagesLoaded = 0;
    var keyManager;
    var keyStatus_list = [];
    var socket;

    var enermy;
    var myself;

//for userData
function userInfo( name_ )
{
  //这样 {} 内全是私有的
var msg =  {
   name: name_,        
   isDead:false,      
   hp: 0, 
};
 
msg.__proto__ = userInfo.prototype;
return msg;
}


function initGame()
{
    socket = io.connect("http://localhost", {port: 8888, transports: ["websocket"]});
    keyManager = new UserInputManager();
    keyManager.initListener();    

    socket.on('sync', function(data){
      keyStatus_list.push(data);
      console.log("<sync>",data.key);
    });    

    socket.on('GameStart', function(data){
    //  keyStatus_list.push(data);
      console.log("<GameStart>",data.me);
      mainEntrance(data);
    });   
    socket.on('error', function(data){
    //  keyStatus_list.push(data);
      console.log("<error>","");
      
    });      
}
//******************************************************************************************************
//***********************************************Game**mainEntrance*************************************
//******************************************************************************************************
    // window.onload=init;
      function mainEntrance(data) {


             var  b2Vec2         = Box2D.Common.Math.b2Vec2;
             var  b2AABB         = Box2D.Collision.b2AABB;
             var  b2BodyDef      = Box2D.Dynamics.b2BodyDef;
             var  b2Body         = Box2D.Dynamics.b2Body;
             var  b2FixtureDef   = Box2D.Dynamics.b2FixtureDef;
             var  b2Fixture      = Box2D.Dynamics.b2Fixture;
             var  b2World        = Box2D.Dynamics.b2World;
             var  b2MassData     = Box2D.Collision.Shapes.b2MassData;
             var  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
             var  b2CircleShape  = Box2D.Collision.Shapes.b2CircleShape;
             var  b2DebugDraw    = Box2D.Dynamics.b2DebugDraw;
             var  b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
             var  b2MouseJointDef    = Box2D.Dynamics.Joints.b2MouseJointDef;
           
          
             var world = new b2World(
                 new b2Vec2(0,20)     //gravity tips:try changing according to time
              ,  true                 //allow sleep
             );


           var car;    
           var car2; 

           var info1 = new userInfo("p1");
           var info2 = new userInfo("p2"); 

          function createCar(pos){

          var bodyDefcar = new b2BodyDef;
          var fixDef = new b2FixtureDef;
          bodyDefcar.type = b2Body.b2_dynamicBody;

          bodyDefcar.fixedRotation =true;
          bodyDefcar.allowSleep = false;

          fixDef.density = 10;
          fixDef.friction = 0.3;           
          fixDef.restitution = 0.3;
          fixDef.shape = new b2PolygonShape;
          fixDef.shape.SetAsArray([new b2Vec2(1 , -1.2),new b2Vec2(1.5, -0.5),new b2Vec2(1.3 , 0),new b2Vec2(-1.3, 0),new b2Vec2(-1.5, -0.5),new b2Vec2(-0.3 , -1.2)]);
 

          if(pos==1)
          {
             bodyDefcar.position.Set(20,14);
             bodyDefcar.userData = info1;
             car = world.CreateBody(bodyDefcar);
             car.CreateFixture(fixDef);             
          }
          else
          {
             bodyDefcar.position.Set(10,14);
             bodyDefcar.userData = info2;
             car2 = world.CreateBody(bodyDefcar);
             car2.CreateFixture(fixDef);                         
          }

         }  //create car 

         createCar(1);
         createCar(2);


           if(data.me ==1 )
           {
            enermy = car2;
            myself = car;
           }
           else
           {
            enermy = car;
            myself = car2;            
           }

           
         var bodyDef = new b2BodyDef,holder,holderDef,holderfixDef,blackholeDef,blackholefixDef,blackhole,
         attholeDef,attholefixDef,atthole,bow,gate1Def,gate1fixDef,gate1,gate2Def,gate2fixDef,gate2,
         holderExists = false,bowExists = false,gate1Exists = false,gate2Exists = false,
         blackholeExists = false,attholeExists = false;

           function createBlackHole(){
             blackholeDef = new b2BodyDef;
             blackholefixDef = new b2FixtureDef;
             blackholeDef.type = b2Body.b2_staticBody;
             blackholeDef.userData = 'BlackHole';
             blackholefixDef.shape = new b2PolygonShape;
             blackholefixDef.shape.SetAsBox(0.3, 0.1);
             blackholefixDef.restitution =0;
             blackholeDef.position.Set(5, 8);
             blackhole = world.CreateBody(blackholeDef);
             blackhole.CreateFixture(blackholefixDef);
             blackholeExists = true;
         }

         //createBlackHole();
            
          function createAttractiveHole(){
            attholeDef = new b2BodyDef;
            attholefixDef = new b2FixtureDef;
            attholeDef.type = b2Body.b2_staticBody;
            attholeDef.userData = 'AttractiveHole';
            attholefixDef.shape = new b2PolygonShape;
            attholefixDef.shape.SetAsBox(0.3, 0.1);
            attholefixDef.restitution =0;
            attholeDef.position.Set(15, 8);
            atthole = world.CreateBody(attholeDef);
            atthole.CreateFixture(attholefixDef);
            attholeExists = true;
          }
            
          //createAttractiveHole();


          function createGate1(){
            gate1Def = new b2BodyDef;
            gate1fixDef = new b2FixtureDef;
            gate1Def.type = b2Body.b2_staticBody;
            gate1Def.userData = 'Gate1';
            gate1fixDef.shape = new b2PolygonShape;
            gate1fixDef.shape.SetAsBox(0.1, 0.9);
            gate1fixDef.restitution =0;
            gate1Def.position.Set(1, 8);
            gate1 = world.CreateBody(gate1Def);
            gate1.CreateFixture(gate1fixDef);
            gate1Exists = true;
          }
            
        //   createGate1();


           function createGate2(){
            gate2Def = new b2BodyDef;
            gate2fixDef = new b2FixtureDef;
            gate2Def.type = b2Body.b2_staticBody;
            gate2Def.userData = 'Gate2';
            gate2fixDef.shape = new b2PolygonShape;
            gate2fixDef.shape.SetAsBox(0.1, 0.9);
            gate2fixDef.restitution =0;
            gate2Def.position.Set(28, 8);
            gate2 = world.CreateBody(gate2Def);
            gate2.CreateFixture(gate2fixDef);
            gate2Exists = true;
          }
            
   //        createGate2();


// 物理世界的 x 轴 从左~右 0 ~ 30
// Y轴  从下到上 0 ~  - 30
            function createMissile(x,y,forcex,forcey,index)
            {
           //    console.log("createMissile");

               bodyDef.type = b2Body.b2_dynamicBody;
               bodyDef.isBullet = true
               //bodyDef.position.Set(1, 8);
               if(index ==1)
               {
                console.log("createMissile myself" );
               bodyDef.position.Set(myself.GetWorldCenter().x,myself.GetWorldCenter().y-3); 
               }
               else
               {
                                console.log("createMissile enermy" );
               bodyDef.position.Set(enermy.GetWorldCenter().x,enermy.GetWorldCenter().y-3); 
               }

               bodyDef.userData = new userInfo("missile");
               var fixDef = new b2FixtureDef;
               fixDef.density = 10.0;
               fixDef.friction = 1;
               fixDef.restitution =0.5;
               // fixDef.shape = new b2PolygonShape;
               // fixDef.shape.SetAsBox(1, 1);
               fixDef.shape = new b2CircleShape(0.7);
               var missile = world.CreateBody(bodyDef);
               missile.CreateFixture(fixDef);

               missile.ApplyImpulse(new b2Vec2(-forcex,-forcey), missile.GetWorldCenter());
            }
      
//create ground ceiling and walls
         var fixDef2        = new b2FixtureDef;
         fixDef2.shape      = new b2PolygonShape;
         fixDef2.friction   = 1;

         var bodyDef2       = new b2BodyDef;
         var bodyGroundDef2  = new b2BodyDef;
         bodyDef2.type      = b2Body.b2_staticBody;
         bodyGroundDef2.type = b2Body.b2_staticBody; 
         
         bodyDef2.userData = new userInfo("ground");
         bodyGroundDef2.userDate      = 'ground1';

         fixDef2.shape.SetAsBox(16, 0.2);

         bodyDef2.position.Set(16, 15.51);
         world.CreateBody(bodyDef2).CreateFixture(fixDef2);


         bodyGroundDef2.position.Set(16, -0.52);
         world.CreateBody(bodyGroundDef2).CreateFixture(fixDef2);

         fixDef2.shape.SetAsBox(0.2, 18);

         bodyGroundDef2.position.Set(-0.54, 9);
         world.CreateBody(bodyGroundDef2).CreateFixture(fixDef2);

         bodyGroundDef2.position.Set(29.5, 9);
         world.CreateBody(bodyGroundDef2).CreateFixture(fixDef2);



      //var onground;
      var hitGate1  = false;
      var hitGate2  = false; 
      var hitTarget = false;               
      var listener  = new Box2D.Dynamics.b2ContactListener;
      //console.log(listener);

      listener.BeginContact = function(contact) {
        var bodyA = contact.GetFixtureA().GetBody();
        var bodyB = contact.GetFixtureB().GetBody();
        var dataA = bodyA.GetUserData();      
        var dataB = bodyB.GetUserData(); 

        if(!(dataA instanceof userInfo)||!(dataB instanceof userInfo) )
          return ;

       //  if ((dataA.name=== 'p1' && dataB.name=== 'ground')||(dataA.name=== 'ground' && dataB.name=== 'p1') ){
        //     onground = true; 
        //  }
//炸弹 VS 地面          
        else if ((dataA.name=== 'missile' && dataB.name=== 'ground')||(dataA.name=== 'ground' && dataB.name=== 'missile') ){
           // console.log("hitground");
             //onground = true; 

             // 爆炸  计算伤害
             // 直接打击 伤害 降低

          }

//炸弹 VS 车
        else if (
            ( dataA.name=== 'missile' && ( dataB.name=== 'p1'|| dataB.name==='p2')  )
          ||( dataB.name=== 'missile' && ( dataA.name=== 'p1'|| dataA.name==='p2')  ) 
          ){
         // console.log("hitTarget");
             hitTarget = true; 
             // 爆炸  计算伤害
             if( dataA.name=== 'missile' )
                dataA.isDead =true;
              else
                dataB.isDead =true;                
          }
         //else if ( (dataA=== 'bird' && dataB=== 'Gate1')||(dataA=== 'Gate1' && dataB=== 'bird') ){
         //        hitGate1 = true; 
        //  }
        // else if ( (dataA=== 'bird' && dataB=== 'Gate2')||(dataA=== 'Gate2' && dataB=== 'bird') ){
         //        hitGate2 = true; 
        //  }
          else
          {}

      }

     listener.EndContact = function(contact) {

          
     }


        
         //setup debug draw
         
         var debugDraw = new b2DebugDraw();
         debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
         debugDraw.SetDrawScale(30.0);
         debugDraw.SetFillAlpha(0.1);
         debugDraw.SetLineThickness(1.0);
         debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
         world.SetDebugDraw(debugDraw);
               
           var imageBird = new Image();
           //imageBird.src = "img_splash_webexball_s.png";
           imageBird.src = "images/bird.jpg";
               
           var imageBow = new Image();
           imageBow.src = "images/bow.png";

           var imageGround = new Image();
           imageGround.src = "images/ground.png";

           var imageExplode1 = new Image();
           imageExplode1.src = "images/explode1.png";

           var imageExplode2 = new Image();
           imageExplode2.src = "images/explode2.png";

           var imageGate1 = new Image();
           imageGate1.src = "images/gate1.png";

           var imageGate2 = new Image();
           imageGate2.src = "images/gate2.png";

           var imageExplode = new Image();
           imageExplode.src = "images/explode.jpg";

           var imageCar = new Image();
           imageCar.src = "images/car.gif";


           var imageP2 = new Image();
           imageP2.src = "images/car.gif";
         //window.setInterval(update, 1000 / 60); //   don't use set Interval, use the following animframe
         
     
         window.requestPhyFrame = (function(){
          return  window.requestAnimationFrame       || 
                  window.webkitRequestAnimationFrame || 
                  window.mozRequestAnimationFrame    || 
                  window.oRequestAnimationFrame      || 
                  window.msRequestAnimationFrame     || 
                  function(/* function */ callback, /* DOMElement */ element){
                    window.setTimeout(callback, 1000 / 60);
                  };
         })();

         window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame       || 
                  window.webkitRequestAnimationFrame || 
                  window.mozRequestAnimationFrame    || 
                  window.oRequestAnimationFrame      || 
                  window.msRequestAnimationFrame     || 
                  function(/* function */ callback, /* DOMElement */ element){
                    window.setTimeout(callback, 1000 / 60);
                  };
         })();
         
         //*****************************************************************************
         //******************************mouse touch************************************ 
         //*****************************************************************************



         var mouseX, mouseY, mousePVec, isMouseDown=false, selectedBody, mouseJoint,body;
         var isMouseUp  = false;
         var isDragging = false;
         var initX      = 0;
         var initY      = 0;
         // var xx         =0;
         // var yy         =0;
         var shootable  = true;
         var holder1,holderDef1,fixDef1;
         var canvas          = document.getElementById("canvas");
         var canvasPosition  = getElementPosition(canvas);
         var context         = canvas.getContext("2d");
         var canvasPositionX = canvasPosition.x;
         var canvasPositionY = canvasPosition.y;
         var u               = navigator.userAgent;
         var detectbrowser   = (u.match(/AppleWebKit.*Mobile.*/));
         var goLeft   = false;
         var goRight  = false;
         var Jump     = false;
         var cdOk     = true;
         var waitTime = 0;
         var initTime = 0;
         var iscarMoving = false;
         var carX        = 0;
         var carY        = 0;
         var isFlying    = false;
         var carMoveable = true;
         var lastX,lastY;
         var onCar    = false;
         var BHdiffX  = 0;
         var BHdiffY  = 0;
         var AttdiffX = 0;
         var AttdiffY = 0;
         var i = 0;


           function getBodyAtMouse(x,y) {
           mousePVec = new b2Vec2(mouseX, mouseY);
            mousePVec = new b2Vec2(x, y);
            var aabb = new b2AABB();
            aabb.lowerBound.Set(x - 0.001, y - 0.001);
            aabb.upperBound.Set(x + 0.001, y + 0.001);
            
            // Query the world for overlapping shapes.

            //selectedBody = null;
            //QueryAABB send fixture to callback 
            world.QueryAABB(getBodyCB, aabb);
            return selectedBody;
         }

         function getBodyCB(fixture) {

            if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {

               if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {

                  selectedBody = fixture.GetBody();

                  return false;
               }
            }
            return true;
         }
         

         //*****************************************************************************
         //***********************************update************************************ 
         //*****************************************************************************
         
         function updatePhy() {
            var keyMsg = keyManager.gen_key_msg();
            var keyStatus = keyMsg.key;
            //进一步过滤发送的数据量
             if(keyStatus >0)
             {
                socket.emit( "sync" , keyMsg );
             }


            var keyMsg2  = keyStatus_list[0];
            var keyStatus2;
            if(keyMsg2)
            {
              keyStatus2  = keyMsg2.key;
              keyStatus_list.splice(0,1);          
            }



var _keyMap = {
    "jump": 1,  //jump
    "left": 2,   //left
    "right": 4,   //right
    "shoot":8,

}
        if(keyStatus&1){  //jump
          //jump();
          //iscarMoving = true;
            myself.ApplyImpulse(new b2Vec2(0,-400), enermy.GetWorldCenter());  
        }
        if(keyStatus&2 ){   //left
         //console.log(goLeft&&onground);
            myself.ApplyImpulse(new b2Vec2(-150,0), myself.GetWorldCenter());
           // iscarMoving = true;
        }
        if(keyStatus&4){ //right
         // console.log("go right");
            myself.ApplyImpulse(new b2Vec2(150,0), myself.GetWorldCenter());
           // iscarMoving = true;
        }
        if(keyStatus&8)
        {
        createMissile( myself.GetWorldCenter().x -3, myself.GetWorldCenter().y+1, keyMsg.forceX , keyMsg.forceY,1) ;   
        }        
        ////////////////////////////////////////////////////////   for test


        if(keyStatus2&1){  //jump
          //jump();
          //iscarMoving = true;
          //cd 有待添加
          enermy.ApplyImpulse(new b2Vec2(0,-400), enermy.GetWorldCenter());          
        }
        if(keyStatus2&2 ){   //left
         //console.log(goLeft&&onground);
            enermy.ApplyImpulse(new b2Vec2(-150,0), enermy.GetWorldCenter());
           // iscarMoving = true;
        }
        if(keyStatus2&4){ //right
         // console.log("go right");
            enermy.ApplyImpulse(new b2Vec2(150,0), enermy.GetWorldCenter());
           // iscarMoving = true;
        }
        if(keyStatus2&8)
        {
        createMissile( enermy.GetWorldCenter().x -3, enermy.GetWorldCenter().y+1, keyMsg2.forceX , keyMsg2.forceY,2) ;   
        }   
        ////////////////////////////////////////////////////////


       //*******************************************************************************
       //********************************Black Hole*************************************
       //*******************************************************************************
       /*
         BHdiffX=5-bird.GetWorldCenter().x;
         BHdiffY=8-bird.GetWorldCenter().y;

        if(blackholeExists&&(Math.pow(BHdiffX,2)+Math.pow(BHdiffY,2))<=14){
         
             bird.SetLinearVelocity(new b2Vec2(0.4*bird.GetLinearVelocity().x,0.4*bird.GetLinearVelocity().y));
         
            var forceX = (BHdiffX<=0?-1:1) * 10 * Math.pow(BHdiffX,2);
            var forceY = (BHdiffY<=0?-1:1) * 10 * Math.pow(BHdiffY,2);
            //  var forceX = (BHdiffX<=0?-1:1) * 15 * Math.abs(BHdiffX)/(Math.sqrt(Math.pow(BHdiffX,2)+Math.pow(BHdiffY,2)));
            
            // var forceY = (BHdiffY<=0?-1:1) * 15 * Math.abs(BHdiffY)/(Math.sqrt(Math.pow(BHdiffX,2)+Math.pow(BHdiffY,2)));       
                     
            bird.ApplyImpulse(new b2Vec2(forceX,forceY), bird.GetWorldCenter());
          }

       //*******************************************************************************
       //*****************************Attractive Hole***********************************
       //*******************************************************************************
         AttdiffX = 15-bird.GetWorldCenter().x;
         AttdiffY = 8 -bird.GetWorldCenter().y;
         if(attholeExists&&(Math.pow(AttdiffX,2)+Math.pow(AttdiffY,2))<=14){

            var forceX = (AttdiffX<=0?-1:1) * 10 * Math.abs(AttdiffX)/(Math.sqrt(Math.pow(AttdiffX,2)+Math.pow(AttdiffY,2)));
            forceX = forceX>15? 15: forceX;
            var forceY = (AttdiffY<=0?-1:1) * 20 * Math.abs(AttdiffY)/(Math.sqrt(Math.pow(AttdiffX,2)+Math.pow(AttdiffY,2)));      
            forceY = forceY>30? 30: forceY;    
            bird.ApplyImpulse(new b2Vec2(forceX,forceY), bird.GetWorldCenter());
          }

           if(hitGate1){
               bird.SetLinearVelocity(new b2Vec2(-bird.GetLinearVelocity().x,bird.GetLinearVelocity().y));
               bird.SetPosition(new b2Vec2(27.1,8));
               hitGate1 = false;
           }
            

            if(hitGate2){
               bird.SetLinearVelocity(new b2Vec2(-bird.GetLinearVelocity().x,bird.GetLinearVelocity().y));
               bird.SetPosition(new b2Vec2(1.9,8));
               hitGate2 = false;
           }
 
*/
       //**********************************************************************************
       //   //                          SetContactListener
       //   //*****************************************************************************
            world.SetContactListener(listener);
         
            //*****************************************************************************
            //              setup the details of the world  .
            //*****************************************************************************
            world.Step(1 / 60, 10, 10);
            world.ClearForces();
            requestPhyFrame(updatePhy);
         };//end of updatePhy

            requestPhyFrame(updatePhy);
         
      function updateAnim(){
         //*****************************************************************************
         //                    draw pictures
         //*****************************************************************************
         world.DrawDebugData();
         //context.clearRect(0, 0, 1000, 650);
         for (var b = world.GetBodyList() ; b; b = b.GetNext()){

            if(toBeDestroy) world.DestroyBody(toBeDestroy);

            var userData = b.GetUserData(); 
            var toBeDestroy = null;
            if(userData==null  ) continue;
      
          //性能消耗较大
          //  if (!(  userData instanceof  playerInfo ) ) 
          //      continue;

            if (userData.name === 'p1'){
               var pos = b.GetPosition();
                context.save();

                //*******************************draw car***********************************
                context.drawImage(imageCar, pos.x * 30 -85,pos.y * 30 -80);

                //*******************************Explode************************************
                if(hitTarget){
                  //explode has a internal CD - 1 seconds.
                   if(!cdOK(0.8)){   //CD 0.8秒
                       //if i>=24 the explode-animation is over.        
                       if(i<24){
                          context.drawImage(imageExplode,(i++ % 5)*45,Math.floor(i/5)*45,45,45,pos.x * 30+35, pos.y * 30,-95,-95);
                        }
                     }else{
                       hitTarget = false;
                       i = 0;
                  }
               }
            }

          else if (userData.name === 'p2'){
               var pos = b.GetPosition();
                context.save();

                //*******************************draw car***********************************
                context.drawImage(imageP2, pos.x * 30 -85,pos.y * 30 -80);

                //*******************************Explode************************************
                if(hitTarget){
                  //explode has a internal CD - 1 seconds.
                   if(!cdOK(0.8)){   //CD 0.8秒
                       //if i>=24 the explode-animation is over.        
                       if(i<24){
                          context.drawImage(imageExplode,(i++ % 5)*45,Math.floor(i/5)*45,45,45,pos.x * 30+35, pos.y * 30,-95,-95);
                        }
                     }else{
                       hitTarget = false;
                       i = 0;
                  }
               }
            }
           else if (userData.name === 'missile'){
              //console.log("draw missile");
              if(!userData.isDead){
              var pos = b.GetPosition();
              context.save();
              context.translate(pos.x * 30, pos.y * 30);
              context.rotate((b.GetAngle())/15);
              context.drawImage(imageBird, -15, -15);
             }
              else
              {
                //var cur = b;
                toBeDestroy = b;
                //world.DestroyBody(b)
              }

           }

          else if (userData.name === 'ground'){
             var pos = b.GetPosition();
             context.save();
             context.translate(pos.x * 30, pos.y * 30);
             context.rotate((b.GetAngle())/15);
             context.drawImage(imageGround, -500, -15);
             context.drawImage(imageGround, -25, -15);
             //context.restore();
             //console.log("drawGroud");
         }

         else if (userData.name === 'Gate1'){
              var pos = b.GetPosition();
              context.save();
              context.translate(pos.x * 30, pos.y * 30);          
              context.drawImage(imageGate1, -25, -27);
         }

         else if (userData.name === 'Gate2'){
              var pos = b.GetPosition();
              context.save();
              context.translate(pos.x * 30, pos.y * 30);          
              context.drawImage(imageGate2, -25, -27);
         }
         else
         {}

         context.restore();
       } //for

       requestAnimFrame(updateAnim);
       }
       // 
       // updateAnima
     
        requestAnimFrame(updateAnim);

        function jump(){
          var myDate= new Date();
            if(cdOk){//if cd ok ,is able to jump
               myself.ApplyImpulse(new b2Vec2(0,-400), car.GetWorldCenter());
               cdOk=false;
               initTime= myDate.getSeconds();
               firstReceive=false;
               //console.log("initTime"+myDate.getSeconds());
              }
             else{
              //compute the waitTime which the page 
              waitTime+=(myDate.getSeconds()-initTime)<0?(myDate.getSeconds()-initTime+60):(myDate.getSeconds()-initTime);
              //console.log("waitTime:"+waitTime);
               //refresh inittime
               initTime= myDate.getSeconds();
               if(waitTime>0.8){
                  cdOk=true ;
                  waitTime=0;
               }
             }
         }    
          

         var cdok=true,waittime=0,inittime,firstTime=true;

         function cdOK(x){
           var myDate= new Date();
            if(firstTime){//if cd ok ,is able to jump            
               cdok=false;
               firstTime = false;             
               inittime= myDate.getSeconds();     
               //console.log("initTime"+myDate.getSeconds());
              }
             else{         
                waittime+=(myDate.getSeconds()-inittime)<0?(myDate.getSeconds()-inittime+60):(myDate.getSeconds()-inittime);
                //console.log("waitTime:"+waittime);             
                inittime= myDate.getSeconds();
                 //console.log("initTime"+myDate.getSeconds());              
                if(waittime>x){
                   cdok=true ;
                   waittime=0;
                   firstTime = true;
                  // console.log("cdOk:"+cdOk);
                   return cdok;
               }

               return false;
             }
          }
      
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

      };
      
//******************************************************************************************************
//***********************************************Game**mainEntrance*************************************
//******************************************************************************************************

    