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
	this._shouldRun = false;
	this._canvas = canvas;
	this._ctx = canvas.getContext("2d");

	// Game
	this._angle = 0.0;

	// Timing
	this._framePeriod = 1000.0/60.0;
	this._delta = 0;
	this._newTime = 0;
	this._currentTime = Date.now();
	this._frameAccumulator = 0;
};

JSTest.GameEngine.prototype.start = function ()
{
	this._shouldRun = true;
	this.mainLoop();
}

JSTest.GameEngine.prototype.tick = function()
{
	this._angle += 0.0001 * this._delta;
	this._angle %= 2.0;
};

JSTest.GameEngine.prototype.draw = function ()
{
	var ctx = this._ctx;

	ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

	ctx.fillStyle = "red";
	ctx.font = "bold 32px";

	ctx.save();

	ctx.translate(this._canvas.width/2, this._canvas.height/2);
	ctx.rotate(Math.PI * this._angle);
	ctx.fillText("关谷个傻逼！", 0, 0);

	ctx.restore();
};

JSTest.GameEngine.prototype.mainLoop = function()
{
	this._newTime = Date.now();
	this._delta = this._newTime - this._currentTime;
	this._currentTime = this._newTime;
	this._frameAccumulator += this._delta;

	this.tick();
	
	if (this._frameAccumulator >= this._framePeriod)
	{
		this._frameAccumulator = 0;
		this.draw();
	}

	if (this._shouldRun)
	{
		animFrame( this.mainLoop.bind(this), this._canvas );
	}
};

var Engine = new JSTest.GameEngine(canvasElement);

Engine.start();
