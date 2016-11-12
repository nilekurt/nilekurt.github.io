var animFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	null ;

var c = document.getElementById("screen");
var ctx = c.getContext("2d");

var posX = 0;

var tick = function()
{
	posX += 1;
	if ( posX > c.width )
	{
		posX = 0;
	}
}

var draw = function()
{
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(posX, c.height);
	ctx.stroke();
	ctx.closePath();
}


var mainLoop = function()
{
	tick();
	draw();

	animFrame( mainLoop, c );
};

animFrame( mainLoop, c);
