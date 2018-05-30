window.addEventListener("load", startGame);
const frames = 20;
const velocity = 3;
const jump = 7;
var background;
var floor;
var gamePlayer;
var backgroundGameOver;
var gameOver;
var scoreGameOver;
var obstacle = [];
var score;
var backgroundSound;
var n=0;
function startGame() {
	gameArea.start();
	background = new Component(0,0,451,600,"sprites.png","image",0,0,144,256);
	floor = new Component(0,480,451,120,"sprites.png","image",292,1,144,52);
	gamePlayer = new Component(50,250,50,50,"sprites.png","image",3,490,17,13.5);
	score = new Component(30,50,"SCORE: ",25,"#000","text");
	backgroundSound = new Music("background.mp3");
	backgroundSound.play();
}

var gameArea = {
	canvas: document.createElement("canvas")
}

gameArea.start = function() {
	this.canvas.width = 451;
	this.canvas.height = 600;
	this.context = this.canvas.getContext("2d");
	document.getElementById("showGame").appendChild(this.canvas);
	this.interval = setInterval(updateGameArea,frames);
	this.frameN = 0;
	var o = gameArea.canvas.getBoundingClientRect();
	this.canvas.addEventListener("mousemove", function(e) {
		gameArea.x = e.pageX-o.left;
		gameArea.y = e.pageY-o.top;
	});
	window.addEventListener("keydown", function(e) {
		gameArea.key = e.keyCode;
	});
	window.addEventListener("keyup", function(e) {
		gameArea.key = false;
	})
}

gameArea.clear = function() {
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
}

gameArea.stop = function() {
	clearInterval(this.interval);
	this.context.fillStyle = "#ccc";
	backgroundGameOver = new Component(0,0,451,600,"sprites.png","image",146,0,144,256);
	backgroundGameOver.update();
	gameOver = new Component(110,150,200,100,"sprites.png","image",395,58,95,22);
	gameOver.update();
	scoreGameOver = new Component(125,300,"SCORE: " + gameArea.frameN,30,"#fff","text");
	scoreGameOver.update();
	floor.update();
}

function Component(x,y,width,height,color,type,sx,sy,swidth,sheight) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.type = type;
	this.sx = sx;
	this.sy = sy;
	this.swidth = swidth;
	this.sheight = sheight;
	this.speedY = 0;
	this.gravity = 0.2;
	this.acelerationGravity = 0;
}

Component.prototype.update = function() {
	ctx = gameArea.context;
	if(this.type == "image") {
		this.image = new Image();
		this.image.src = this.color;
		if(this.sx == null) {
			ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
		}else {
			ctx.drawImage(this.image,this.sx,this.sy,this.swidth,this.sheight,this.x,this.y,this.width,this.height);
		}
	}else if(this.type == "text"){
		ctx.fillStyle = this.color;
		ctx.font = this.height + "px Arial";
		ctx.fillText(this.width,this.x,this.y)
	}else {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}
}

Component.prototype.gravityForce = function() {
	this.acelerationGravity += this.gravity;
	this.y += this.acelerationGravity + this.speedY;
}

Component.prototype.crashWith = function(otherobj) {
	var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
        crash = false;
    }
    return crash;
}

function everyInterval(n) {
	if((gameArea.frameN/n)%1 == 0) {
		return true;
	}else {
		return false;
	}
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function Music(src) {
	this.src = src;
	this.audio = document.createElement("audio");
	this.audio.src = this.src;
	this.audio.autoplay = false;
	this.audio.controls = false;
	this.audio.loop = true;
	document.body.appendChild(this.audio);
}

Music.prototype.play = function() {
	this.audio.play();
}

Music.prototype.pause = function() {
	this.audio.pause();
}

Music.prototype.muted = function() {
	this.audio.muted();
}

function updateGameArea() {
	gameArea.clear();
	var x, y, i;
	for(i=0; i<obstacle.length; i++) {
		if(gamePlayer.crashWith(obstacle[i]) || gamePlayer.crashWith(floor)) {	
			gameArea.stop();
			return;
		}
	}

	gameArea.frameN += 1;
	background.update();
	floor.update();
	//new Component(100,251,50,229,"sprites.png","image",84,319,26,100)
	if(gameArea.frameN == 1 || everyInterval(100)) {
		x = gameArea.canvas.width;
		var r1 = getRandomInt(120,200);

		obstacle.push(new Component(x,gameArea.canvas.width-r1+29,65,r1,"sprites.png","image",83.5,320.5,26,140));
		obstacle.push(new Component(x,0,65,r1,"sprites.png","image",55,323,27,157));
	}
	for(i=0; i<obstacle.length; i++) {
		obstacle[i].x -= velocity;
		obstacle[i].update();
		if(obstacle[i].x+obstacle.width < 0) {
			obstacle.shift();
		}
	}
	if(gameArea.key) {
		if(gameArea.key == 32) {
			gamePlayer.gravity = -0.4;
		}
	}else {
		gamePlayer.gravity = 0.2;
	}
	score.width = "SCORE: " + gameArea.frameN;
	score.update();
	gamePlayer.gravityForce();
	if(everyInterval(20)) {
		switch (n) {
			case n=0:
				gamePlayer.sx = 30;
				break;
			case n=1:
				gamePlayer.sx = 58;
				n=-1;
			break;
		}
		n+=1;
	}
	gamePlayer.update();
}