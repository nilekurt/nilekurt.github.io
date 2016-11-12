/***************************************************
An online solver for Lambert's problem
Copyright (C) 2019 Kim Nilsson

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
***************************************************/

var JSTest = JSTest || {};

const orientations = {
    XYZ : 'xyz',
    XZY : 'xzy',
    YZX : 'yzx'
};

JSTest.WorldView = function(name, orientation, canvas, coordinate_callback) {
    this.name = name;
    this.canvas = canvas;

    this.ctx = canvas.getContext("2d");
    this.ctx.font = "14pt Sans Serif";
    this.ctx.lineWidth = 1;

    this.grid_constant = 10;

    this.coordinate_callback = coordinate_callback;

    switch (orientation)
    {
    case orientations.XYZ:
        this.transform = math.matrix([ [ 1, 0 ], [ 0, 1 ], [ 0, 0 ] ]);
        this.inverse = math.matrix([ [ 1, 0, 0 ], [ 0, 1, 0 ] ]);
        break;
    case orientations.XZY:
        this.transform = math.matrix([ [ 1, 0 ], [ 0, 0 ], [ 0, 1 ] ]);
        this.inverse = math.matrix([ [ 1, 0, 0 ], [ 0, 0, 1 ] ]);
        break;
    case orientations.YZX:
        this.transform = math.matrix([ [ 0, 0 ], [ 1, 0 ], [ 0, 1 ] ]);
        this.inverse = math.matrix([ [ 0, 1, 0 ], [ 0, 0, 1 ] ]);
        break;
    }

    canvas.addEventListener("pointerdown", this.onPointerDown.bind(this));
};

JSTest.WorldView.prototype.onPointerDown = function(event) {
    const coords = math.matrix([ [ event.offsetX ], [ event.offsetY ] ]);
    const transformed_coords = math.multiply(this.transform, coords);

    this.coordinate_callback(this, event, transformed_coords);
};

JSTest.World = function() {
    this.has_cursor = false;
    this.views = {};
    this.cursor_pos = math.matrix([ [ 0 ], [ 0 ], [ 0 ] ]);
};

JSTest.World.prototype.drawGrid = function(v) {
    v.ctx.strokeStyle = '#B0B0B0';
    for (var i = 0; i < v.canvas.width; i += v.grid_constant)
    {
        v.ctx.beginPath();
        v.ctx.moveTo(i, 0);
        v.ctx.lineTo(i, v.canvas.height);
        v.ctx.stroke();
    }

    for (var i = 0; i < v.canvas.height; i += v.grid_constant)
    {
        v.ctx.beginPath();
        v.ctx.moveTo(0, i);
        v.ctx.lineTo(v.canvas.width, i);
        v.ctx.stroke();
    }
};

JSTest.World.prototype.redraw = function() {
    for (var [key, v] of Object.entries(this.views))
    {
        v.ctx.clearRect(0, 0, v.canvas.width, v.canvas.height);
        this.drawGrid(v);

        if (this.has_cursor)
        {
            const projected_point = math.multiply(v.inverse, this.cursor_pos);

            const x = projected_point.get([ 0, 0 ]);
            const y = projected_point.get([ 1, 0 ]);

            v.ctx.beginPath();
            v.ctx.arc(x, y, 3, 0, math.tau);
            v.ctx.fill();

            v.ctx.strokeStyle = '#505050';
            v.ctx.beginPath();
            v.ctx.moveTo(0, y);
            v.ctx.lineTo(v.canvas.width, y);
            v.ctx.stroke();
            v.ctx.beginPath();
            v.ctx.moveTo(x, 0);
            v.ctx.lineTo(x, v.canvas.height);
            v.ctx.stroke();

            v.ctx.moveTo(x + 20, y - 20);
            v.ctx.fillText('(' + x.toString() + ',' + y.toString() + ')',
                           x + 20, y - 20);
        }
    }
};

JSTest.World.prototype.onPointerDown = function(view, event, coords) {
    math.forEach(coords, (val, i) => {
        if (val > 0)
        {
            this.cursor_pos.set(i, val);
        }
    });

    this.has_cursor = true;

    this.redraw();
};

JSTest.World.prototype.createView = function(name, orientation, canvas) {
    this.views[name] = new JSTest.WorldView(name, orientation, canvas,
                                            this.onPointerDown.bind(this));
    this.redraw();
};

document.addEventListener("DOMContentLoaded", function() {
    var world = new JSTest.World();

    for (const [name, orientation] of [[ 'tl', orientations.XYZ ],
                                       [ 'bl', orientations.XZY ],
                                       [ 'br', orientations.YZX ]])
    {

        const canvas2d = document.getElementById(name);
        canvas2d.height = 400;
        canvas2d.width = 400;
        world.createView(name, orientation, canvas2d);
    }

    const canvas3d = document.getElementById('tr');
    canvas3d.height = 400;
    canvas3d.width = 400;
    const ctx2d = canvas3d.getContext("2d");
    ctx2d.font = "30px Serif";
    ctx2d.textAlign = "center";
    ctx2d.fillText("TODO: 3D", canvas3d.width / 2, canvas3d.height / 2);
});
