var JSTest = JSTest || {};

JSTest.GameStates = JSTest.GameStates || {};

JSTest.World = function()
{
    this._angle = 0.0;
};

JSTest.World.prototype.interpolate = function(prevWorld, alpha)
{
    var interpWorld = new World();

    var a = this._angle;
    var b = prevWorld._angle;

    if (abs(b - a) <= Math.PI)
    {
        interpWorld._angle = a*alpha + b*(1 - alpha);
    }
    else if (a > b)
    {
        var delta = 2*Math.PI - a;
        a = 0.0;
        b += delta;
        interpWorld._angle = a*alpha + b*(1 - alpha) - delta;
        interpWorld._angle %= 2 * Math.PI;
    }
    else
    {
        var delta = 2*Math.PI - b;
        b = 0.0;
        a += delta;
        interpWorld._angle = a*alpha + b*(1 - alpha) - delta;
        interpWorld._angle %= 2 * Math.PI;
    }

    return interpWorld;
};



JSTest.GameStates.Init = function(canvas)
{
	this._canvas = canvas;
	this._ctx = canvas.getContext('2d');

        // Game
        this._timeAccumulator = 0.0;
        this._timeStep = 60.0;

        this._currentWorld = {};
        this._currentWorld.angle = 0.0;

        this._prevWorld = {};
        this._interpWorld = {};
};

JSTest.GameStates.Init.prototype.draw = function()
{
	var ctx = this._ctx;

	ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

	ctx.fillStyle = 'red';
	ctx.font = 'bold 32px';

	ctx.save();

	ctx.translate(this._canvas.width/2, this._canvas.height/2);
	ctx.rotate(Math.PI * this._interpWorld.angle);
	ctx.fillText('关谷个傻逼！', 0, 0);

	ctx.restore();
};

JSTest.GameStates.Init.prototype.tick = function(delta)
{
    this._timeAccumulator += delta;

    while (this._timeAccumulator >= this._timeStep)
    {
        this._timeAccumulator -= this._timeStep;

        this._prevWorld = this._currentWorld;

        this._currentWorld.angle += 0.0001 * this._timeStep;
        this._currentWorld.angle %= 2 * Math.PI;
    }

    var alpha = this._timeAccumulator / this._timeStep;

    this._interpWorld = this._currentWorld.interpolate(this._prevWorld, alpha);
};

JSTest.GameStates.Init.prototype.input = function()
{
};
