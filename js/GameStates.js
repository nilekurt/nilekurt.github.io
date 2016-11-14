var JSTest = JSTest || {};

JSTest.GameStates = JSTest.GameStates || {};

JSTest.World = function()
{
    this._angle = 0.0;
};

JSTest.World.prototype.copy = function()
{
    var worldCopy = new JSTest.World();
    worldCopy._angle = this._angle;

    return worldCopy;
}

JSTest.World.prototype.interpolate = function(prevWorld, alpha)
{
    var interpWorld = new JSTest.World();

    var tWorld = prevWorld instanceof JSTest.World;
    var a = this._angle;
    var b = tWorld._angle;

    if (Math.abs(b - a) <= Math.PI)
    {
        interpWorld._angle = a*alpha + b*(1 - alpha);
    }
    else if (a > b)
    {
        var delta = 2*Math.PI - a;
        b += delta;
        interpWorld._angle = b*(1 - alpha) - delta;
        interpWorld._angle %= 2 * Math.PI;
    }
    else
    {
        var delta = 2*Math.PI - b;
        a += delta;
        interpWorld._angle = a*alpha - delta;
        interpWorld._angle %= 2 * Math.PI;
    }

    return interpWorld;
};

JSTest.World.prototype.getAngle = function()
{
    return this._angle;
};

JSTest.World.prototype.setAngle = function(angle)
{
    this._angle = angle;
};


JSTest.GameStates.Init = function(canvas)
{
	this._canvas = canvas;
	this._ctx = canvas.getContext('2d');

        // Game
        this._timeAccumulator = 0.0;
        this._timeStep = 60.0;

        this._currentWorld = new JSTest.World();
        this._prevWorld = new JSTest.World();
};

JSTest.GameStates.Init.prototype.draw = function()
{
	var ctx = this._ctx;

	ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

	ctx.fillStyle = 'red';
	ctx.font = 'bold 32px';

	ctx.save();

	ctx.translate(this._canvas.width/2, this._canvas.height/2);
        debugger;
	ctx.rotate(this._interpWorld.getAngle());
	ctx.fillText('关谷个傻逼！', 0, 0);

	ctx.restore();
};

JSTest.GameStates.Init.prototype.tick = function(delta)
{
    this._timeAccumulator += delta;

    while (this._timeAccumulator >= this._timeStep)
    {
        this._timeAccumulator -= this._timeStep;

        this._prevWorld = this._currentWorld.copy();

        this._currentWorld.setAngle( this._currentWorld.getAngle() + 0.0001 * this._timeStep);
        this._currentWorld.setAngle( this._currentWorld.getAngle() % (2 * Math.PI));
    }
    
    debugger;

    var alpha = this._timeAccumulator / this._timeStep;

    this._interpWorld = this._currentWorld.interpolate(this._prevWorld, alpha);
};

JSTest.GameStates.Init.prototype.input = function()
{
};
