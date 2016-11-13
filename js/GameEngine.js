var JSTest = JSTest || {};
q

JSTest.GameEngine = function (canvas, frameCallback)
{
	this._shouldRun = false;
	this._canvas = canvas;
	this._ctx = canvas.getContext('2d');
	this._frameCallback = frameCallback;

	// State machine
	this._nextState;
	this._currentState;

	// Game
	this._angle = 0.0;

	// Timing
	this._framePeriod = 1000.0/60.0;
	this._delta = 0;
	this._newTime = 0;
	this._currentTime = Date.now();
	this._frameAccumulator = 0;
};

JSTest.GameEngine.prototype.stop = function ()
{
	this._shouldRun = false;
	this._canvas.removeEventListener('mousedown', this.stop.bind(this));
	this._canvas.addEventListener('mousedown', this.start.bind(this));
};

JSTest.GameEngine.prototype.start = function ()
{
	this._shouldRun = true;
	this._canvas.removeEventListener('mousedown', this.start.bind(this));
	this._canvas.addEventListener('mousedown', this.stop.bind(this));
	this.mainLoop();
};

JSTest.GameEngine.prototype.input = function ()
{
};

JSTest.GameEngine.prototype.tick = function()
{
	this._angle += 0.0001 * this._delta;
	this._angle %= 2.0;
};

JSTest.GameEngine.prototype.draw = function ()
{
	var ctx = this._ctx;

	ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

	ctx.fillStyle = 'red';
	ctx.font = 'bold 32px';

	ctx.save();

	ctx.translate(this._canvas.width/2, this._canvas.height/2);
	ctx.rotate(Math.PI * this._angle);
	ctx.fillText('关谷个傻逼！', 0, 0);

	ctx.restore();
};


JSTest.GameEngine.prototype.mainLoop = function()
{
	this._newTime = Date.now();
	this._delta = this._newTime - this._currentTime;
	this._currentTime = this._newTime;
	this._frameAccumulator += this._delta;

	this._currentState.tick(this._delta);
	
	if (this._frameAccumulator >= this._framePeriod)
	{
		this._frameAccumulator = 0;
		this._currentState.draw();
	}

	if (this._shouldRun)
	{
		this._frameCallback( this.mainLoop.bind(this), this._canvas );
	}
};
