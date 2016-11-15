var I2C = I2C || {}

I2C.Master = function (bus, rate)
{
    this._bus = bus;
    this._rate = rate;
    this._currentCommand = null;
    this._commandQueue = [];
};

I2C.Master.prototype.send = function(address, data, doneCallback)
{
    this._commandQueue.push({'send', address, data, doneCallback});
};

I2C.Master.prototype.request = function(address, doneCallback)
{
    this._commandQueue.push({'request', null, address, doneCallback});
};

I2C.Master.prototype.onTrigger = function()
{
};


I2C.Master.prototype.clkHigh = function()
{
};

I2C.Master.prototype.clkLow = function()
{
};

I2C.Master.prototype.signalHigh = function()
{
};

I2C.Master.prototype.signalLow = function()
{
};
