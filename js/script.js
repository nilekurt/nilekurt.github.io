var animFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	null ;

var c = document.getElementById("screen");
var ctx = c.getContext("2d");

var posX = 0;

var mainLoop = function()
{
	posX += 1;
	if ( posX > c.width )
	{
		posX = 0;
	}

	ctx.moveTo(0,0);
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.lineTo(posX, c.height);
	ctx.stroke();

	animFrame( mainLoop, c );
};

animFrame( mainLoop, c);
