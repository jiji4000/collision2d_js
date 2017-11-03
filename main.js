
var LOAD = 1;
// mouse
var g_mPosX = 0;		// マウス座標X
var g_mPosY = 0;		// マウス座標Y
var g_bDrag = false;	// ドラッグフラグ

// global
var g_Canvas;
var g_Ctx;
var gCanvasColor;

var gLine;
var gCircle;

/*
	onload
	
	最初に呼び出される関数
*/
onload = function () {
    // キャンバスに代入
    g_Canvas = document.getElementById('id_canvas1');   // JavaScript uses the id to find the <canvas> element:
    // cavasに対応していない
    if (!g_Canvas || !g_Canvas.getContext) {
        alert("html5に対応していないので、実行できません");
        return false;
    }
    g_Ctx = g_Canvas.getContext('2d');          // ctx
    g_Scene = LOAD;      // ロードシーンに移行
    g_bLoaded = false;
    // クラス生成
    gCircle = new cCircle();
    gLine = new Line();
    Init();				// 初期化
    g_Canvas.addEventListener("mousedown", MouseEvent, false);
    g_Canvas.addEventListener("mouseup",MouseUp,false);
    g_Canvas.addEventListener("mousemove",MouseMove,false);
    requestNextAnimationFrame(animate);		// loopスタート
};

/*
	変数などの初期化
*/
function Init(){
	gCanvasColor = "rgb(255,255,255)";
	gCircle.Init(100,100,100,"rgb(255,0,0)");
	gLine.Init(new Vector2D(1,2),new Vector2D(1,2),"rgb(255,0,0)");
}

function animate(now) { 
    Move();
    Draw();		// 描画
    requestNextAnimationFrame(animate);
 } 
           
/*
	Draw
	
	描画
*/
function Draw(){
	g_Ctx.fillStyle = gCanvasColor;
	g_Ctx.fillRect(0,0,640,480);
	gLine.Draw(g_Ctx);
	gCircle.Draw(g_Ctx);	
}

/*
	Move
	
	移動
*/
function Move(){	
	if(g_bDrag)
	{
		gLine.base.x = g_mPosX;
		gLine.base.y = g_mPosY;
		
	}
	
	if(gCircle.CollisionLine(gLine)){
		gCanvasColor = "rgb(0,0,255)";
	}
	else{
		gCanvasColor = "rgb(255,255,255)";
	}
}

function MouseEvent(event){	
	// クリックした場所にサークルがある
	//if(true)
	{
		g_bDrag = true;
	}
}

function MouseUp(event){
	g_bDrag = false;
}

function MouseMove(event){
	var rect = event.target.getBoundingClientRect();
	g_mPosX = event.clientX - rect.left;
	g_mPosY = event.clientY - rect.top;
}

/*
Reprinted from Core HTML5 Canvas
オリジナルインターバル設定
*/
window.requestNextAnimationFrame =
(function () {
var originalWebkitRequestAnimationFrame = undefined,
   wrapper = undefined,
   callback = undefined,
   geckoVersion = 0,
   userAgent = navigator.userAgent,
   index = 0,
   self = this;

// Workaround for Chrome 10 bug where Chrome
// does not pass the time to the animation function

if (window.webkitRequestAnimationFrame) {
  // Define the wrapper

  wrapper = function (time) {
    if (time === undefined) {
       time = +new Date();
    }
    self.callback(time);
  };

  // Make the switch
   
  originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;    

  window.webkitRequestAnimationFrame = function (callback, element) {
     self.callback = callback;

     // Browser calls the wrapper and wrapper calls the callback
     
     originalWebkitRequestAnimationFrame(wrapper, element);
  }
}

// Workaround for Gecko 2.0, which has a bug in
// mozRequestAnimationFrame() that restricts animations
// to 30-40 fps.

if (window.mozRequestAnimationFrame) {
  // Check the Gecko version. Gecko is used by browsers
  // other than Firefox. Gecko 2.0 corresponds to
  // Firefox 4.0.
  
  index = userAgent.indexOf('rv:');

  if (userAgent.indexOf('Gecko') != -1) {
     geckoVersion = userAgent.substr(index + 3, 3);

     if (geckoVersion === '2.0') {
        // Forces the return statement to fall through
        // to the setTimeout() function.

        window.mozRequestAnimationFrame = undefined;
     }
  }
}

return window.requestAnimationFrame   ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||

  function (callback, element) {
     var start,
         finish;


     window.setTimeout( function () {
        start = +new Date();
        callback(start);
        finish = +new Date();

        self.timeout = 1000 / 60 - (finish - start);

     }, self.timeout);
  };
}
)
();