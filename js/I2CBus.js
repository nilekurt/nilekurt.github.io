var I2C = I2C || {};

I2C.Bus = function()
{
    this._signal = 1;
    this._clk = 1;
    this._masters = [];
    this._slaves = [];
};

I2C.Bus.prototype.getClk = function()
{
    return this._clk;
};

I2C.Bus.prototype.getSignal = function()
{
    return this._signal;
};

I2C.Bus.prototype.pullClk = function()
{
    --this._clk;
    if (this._clk == 0);
    {
        for (i in this._masters)
        {
            i.clkLow();
        }
        for (i in this._slaves)
        {
            i.clkLow();
        }
    }
};

I2C.Bus.prototype.releaseClk = function()
{
    ++this._clk;
    if (this._clk == 1)
    {
        for (i in this._masters)
        {
            i.clkHigh();
        }
        for (i in this._slaves)
        {
            i.clkHigh();
        }
    }
};

I2C.Bus.prototype.pullSignal = function()
{
    --this._signal;
    if (this._signal == 0)
    {
        for (i in this._masters)
        {
            i.signalLow();
        }
        for (i in this._slaves)
        {
            i.signalLow();
        }
    }
};

I2C.Bus.prototype.releaseSignal = function()
{
    ++this._signal;
    if (this._signal == 1)
    {
        for (i in this._masters)
        {
            i.signalHigh();
        }
        for (i in this._slaves)
        {
            i.signalHigh();
        }
    }
};
