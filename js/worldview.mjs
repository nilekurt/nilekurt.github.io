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

export const orientations = {
    XYZ: 'xyz',
    XZY: 'xzy',
    YZX: 'yzx'
};

export class WorldView {
    constructor(name, orientation, canvas,
        coordinate_callback, cursor_getter) {
        this.name = name;
        this.canvas = canvas;

        this.ctx = canvas.getContext("2d");
        this.ctx.font = "14pt Sans Serif";
        this.ctx.lineWidth = 1;

        this.grid_constant = 10;

        this.coordinate_callback = coordinate_callback;
        this.cursor_getter = cursor_getter;

        this.offset = math.matrix([[-0.5], [-0.5], [-0.5]]);

        this.projection = math.multiply(math.identity(3), math.sqrt(this.canvas.height * this.canvas.width));
        this.projection_inverse = math.inv(this.projection);

        switch (orientation) {
            case orientations.XYZ:
                this.expand = math.matrix([[1, 0], [0, 1], [0, 0]]);
                this.collapse = math.matrix([[1, 0, 0], [0, 1, 0]]);
                break;
            case orientations.XZY:
                this.expand = math.matrix([[1, 0], [0, 0], [0, 1]]);
                this.collapse = math.matrix([[1, 0, 0], [0, 0, 1]]);
                break;
            case orientations.YZX:
                this.expand = math.matrix([[0, 0], [1, 0], [0, 1]]);
                this.collapse = math.matrix([[0, 1, 0], [0, 0, 1]]);
                break;
        }

        canvas.addEventListener("pointerdown", this.onPointerDown.bind(this));
    }

    onPointerDown(event) {
        const coords = math.matrix([[event.offsetX], [this.canvas.height - event.offsetY]]);
        const expanded = math.multiply(this.expand, coords);
        const unprojected = math.multiply(this.projection_inverse, expanded);
        const final = math.add(unprojected, this.offset);

        const cursor_clone = math.clone(this.cursor_getter());
        math.forEach(expanded, (val, index) => {
            if (val != 0) {
                cursor_clone.set(index, final.get(index));
            }
        });

        this.coordinate_callback(cursor_clone, true);
    }
}