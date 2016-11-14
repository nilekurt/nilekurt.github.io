var JSTest = JSTest || {};

JSTest.GameStates = JSTest.GameStates || {};

JSTest.GameStates.Init = function(canvas)
{
	this._canvas = canvas;
	this._ctx = canvas.getContext('2d');

        // Game
        this._timeAccumulator = 0.0;
        this._timeStep = 60.0;

        this._currentState = {};
        this._currentState.angle = 0.0;

        this._prevState = {};
        this._interpState = {};
};

JSTest.GameStates.Init.prototype.draw = function()
{
	var ctx = this._ctx;

	ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

	ctx.fillStyle = 'red';
	ctx.font = 'bold 32px';

	ctx.save();

	ctx.translate(this._canvas.width/2, this._canvas.height/2);
	ctx.rotate(Math.PI * this._interpState.angle);
	ctx.fillText('关谷个傻逼！', 0, 0);

	ctx.restore();
};

JSTest.GameStates.Init.prototype.tick = function(delta)
{
    this._timeAccumulator += delta;

    while (this._timeAccumulator >= this._timeStep)
    {
        this._timeAccumulator -= this._timeStep;

        this._prevState = this._currentState;
        this._currentState.angle += 0.0001 * this._timeStep;
        this._currentState.angle %= 2.0;
    }

    var alpha = this._timeAccumulator / this._timeStep;
    this._interpState.angle = alpha * _currentState.angle + (1 - alpha) * _prevState.angle;
};

JSTest.GameStates.Init.prototype.input = function()
{
};
