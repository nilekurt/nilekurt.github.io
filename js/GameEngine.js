var JSTest = JSTest || {};
JSTest.GameStates = JSTest.GameStates || {};

JSTest.GameStates.Init = function(canvas)
{
	this._canvas = canvas;
	this._ctx = canvas.getContext('2d');
	// Game
	this._angle = 0.0;
};

JSTest.GameStates.Init.prototype.draw = function()
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

JSTest.GameStates.Init.prototype.tick = function(delta)
{
	this._angle += 0.0001 * delta;
	this._angle %= 2.0;
};

JSTest.GameStates.Init.prototype.input = function()
{
};

JSTest.GameEngine = function (canvas, frameCallback)
{
	this._canvas = canvas;
	this._shouldRun = false;
	this._frameCallback = frameCallback;

	// State machine
	this._nextState;
	this._currentState;

	// Timing
	this._framePeriod = 1000.0/60.0;
	this._delta = 0;
	this._currentTime = 0;
	this._frameAccumulator = 0;
	
	// Init state
	this._currentState = new JSTest.GameStates.Init(this._canvas);
	this._stopListener = this.stop.bind(this);
	this._startListener = this.start.bind(this);
	this._loopCallback = this.mainLoop.bind(this);
};

JSTest.GameEngine.prototype.stop = function ()
{
	this._shouldRun = false;
	this._canvas.removeEventListener('mousedown', this._stopListener);
	this._canvas.addEventListener('mousedown', this._startListener);
};

JSTest.GameEngine.prototype.start = function ()
{
	this._shouldRun = true;
	this._canvas.removeEventListener('mousedown', this._startListener);
	this._canvas.addEventListener('mousedown', this._stopListener);

	this._currentTime = performance.now();
	this.mainLoop(this._currentTime);
};

JSTest.GameEngine.prototype.mainLoop = function(timestamp)
{
	this._delta = timestamp - this._currentTime;
	this._currentTime = timestamp;
	this._frameAccumulator += this._delta;

	this._currentState.input();
	this._currentState.tick(this._delta);
	
	if (this._frameAccumulator >= this._framePeriod)
	{
		this._frameAccumulator -= this._framePeriod;
		this._currentState.draw();
	}

	if (this._shouldRun)
	{
		this._frameCallback( this._loopCallback, this._canvas );
	}
};
