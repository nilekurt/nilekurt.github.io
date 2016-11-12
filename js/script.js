var animFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	null ;

var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");

var angle = 0.0;

// Timing
var framePeriod = 1000.0/60.0;
var newTime = 0.0;
var currentTime = Date.now();
var delta = 0.0;

var tick = function()
{
	angle += 0.0001 * delta;
	angle %= 2.0;
}

var draw = function()
{
	ctx.clearRect(0, 0, ctx.width, ctx.height);

	ctx.fillStyle = "red";
	ctx.font = "bold 32px";

	ctx.save();

	ctx.translate(canvas.width/2, canvas.height/2);
	ctx.rotate(Math.PI * angle);
	ctx.fillText("我爱小宝！", 0, 0);

	ctx.restore();
}


var mainLoop = function()
{
	newTime = Date.now();
	delta = newTime - currentTime;
	currentTime = newTime;
	
	tick();
	if (delta >= framePeriod)
	{
		draw();
	}

	animFrame( mainLoop, canvas );
};

mainLoop();
