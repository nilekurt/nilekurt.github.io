var animFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	null ;

var realCanvas = document.getElementById("screen");
var realContext = realContextElement.getContext("2d");
var virtualContext = document.createElement("canvas");
virtualCanvas.width = realCanvas.width;
virtualCanvas.height = realCanvas.height;

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
	var ctx = virtualCanvas.getContext("2d");
	ctx.clearRect(0, 0, ctx.width, ctx.height);

	ctx.fillStyle = "red";
	ctx.font = "bold 32px";

	ctx.save();

	ctx.translate(ctx.width/2, ctx.height/2);
	ctx.rotate(Math.PI * angle);
	ctx.fillText("我爱小宝！", 0, 0);

	ctx.restore();

	realContext.drawImage(virtualCanvas, 0, 0);
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

	animFrame( mainLoop, c );
};

animFrame( mainLoop, c);
