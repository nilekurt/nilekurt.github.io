var I2C = I2C || {}

I2C.Master = function (bus)
{
    this._bus = bus;
    this._currentCommand = null;
    this._commandQueue = [];
    bus.addMaster(this);
};

I2C.Master.prototype.send(address, data, doneCallback)
{
    this._commandQueue.push({'send', address, data, doneCallback});
    this.startProcessing();
};

I2C.Master.prototype.request(address, doneCallback)
{
    this._commandQueue.push({'request', null, address, doneCallback});
    this.startProcessing();
};

I2C.Master.prototype.onTrigger(bit)
{
};

I2C.Master.prototype.startProcessing()
{
    if (this._currentCommand === null)
    {
    }
};
