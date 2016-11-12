var animFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	null ;

var c = document.getElementById("screen");
var ctx = c.getContext("2d");

var posX = 0.0;

var tick = function()
{
	posX += 0.01;
	if ( posX > 2.0 )
	{
		posX = 0.0;
	}
}

var draw = function()
{
	ctx.clearRect(0, 0, c.width, c.height);

	ctx.fillStyle = "red";
	ctx.font = "bold 16px";

	ctx.save();
	ctx.rotate(Math.PI * posX);
	ctx.fillText("我爱小宝！", c.width/2, c.height/2);
	ctx.restore();
}


var mainLoop = function()
{
	tick();
	draw();

	animFrame( mainLoop, c );
};

animFrame( mainLoop, c);
