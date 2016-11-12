var JSTest = JSTest || {};

var animFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	null ;

var canvasElement = document.getElementById("screen");

JSTest.GameEngine = function (canvas)
{
	this.shouldRun = false;
	this.canvas = canvas;
	this.ctx = this.getContext("2d");

	// Game
	this.angle = 0.0;

	// Timing
	this.framePeriod = 1000.0/60.0;
	this.delta = 0.0;
	this.currentTime = Date.now();
};

JSTest.GameEngine.prototype.start = function ()
{
	this.shouldRun = true;
	this.mainLoop();
}

JSTest.GameEngine.prototype.tick = function()
{
	this.angle += 0.0001 * this.delta;
	this.angle %= 2.0;
};

JSTest.GameEngine.prototype.draw = function ()
{
	var ctx = this.ctx;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "red";
	ctx.font = "bold 32px";

	ctx.save();

	ctx.translate(canvas.width/2, canvas.height/2);
	ctx.rotate(Math.PI * angle);
	ctx.fillText("我爱小宝！", 0, 0);

	ctx.restore();
};

JSTest.GameEngine.prototype.mainLoop = function()
{
	this.newTime = Date.now();
	this.delta = this.newTime - this.currentTime;
	this.currentTime = this.newTime;
	
	this.tick();
	
	if (this.delta >= this.framePeriod)
	{
		this.draw();
	}

	if (this.shouldRun)
	{
		animFrame( this.mainLoop, this.canvas );
	}
};

var Engine = new GameEngine(canvasElement);

Engine.start();
