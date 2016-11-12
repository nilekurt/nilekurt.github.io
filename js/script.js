var animFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	null ;

var c = document.getElementById("screen");
var ctx = c.getContext("2d");

var angle = 0.0;
var currentTime = Date.now();

var tick = function()
{
	var newTime = Date.now();
	var delta = newTime - currentTime;
	currentTime = newTime;
	
	angle += 0.01 * delta;
	angle %= 2.0;
}

var draw = function()
{
	ctx.clearRect(0, 0, c.width, c.height);

	ctx.fillStyle = "red";
	ctx.font = "bold 32px";

	ctx.save();

	ctx.translate(c.width/2, c.height/2);
	ctx.rotate(Math.PI * angle);
	ctx.fillText("我爱小宝！", 0, 0);

	ctx.restore();
}


var mainLoop = function()
{
	tick();
	draw();

	animFrame( mainLoop, c );
};

animFrame( mainLoop, c);
