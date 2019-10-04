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

import * as Matrix from './matrix.mjs';

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
        this.view_offset = math.matrix([[0], [0]]);

        this.coordinate_callback = coordinate_callback;
        this.cursor_getter = cursor_getter;

        this.projection = math.multiply(math.identity(4), 5);
        this.projection_inverse = math.inv(this.projection);

        switch (orientation) {
            case orientations.XYZ:
                this.expand = math.matrix([[1, 0], [0, 1], [0, 0], [0, 0]]);
                this.collapse = math.matrix([[1, 0, 0, 0], [0, 1, 0, 0]]);
                break;
            case orientations.XZY:
                this.expand = math.matrix([[1, 0], [0, 0], [0, 1], [0, 0]]);
                this.collapse = math.matrix([[1, 0, 0, 0], [0, 0, 1, 0]]);
                break;
            case orientations.YZX:
                this.expand = math.matrix([[0, 0], [1, 0], [0, 1], [0, 0]]);
                this.collapse = math.matrix([[0, 1, 0, 0], [0, 0, 1, 0]]);
                break;
        }

        const expanded = math.multiply(this.expand, this.view_offset);
        this.view = Matrix.translate(expanded);
        this.view_inverse = math.inv(this.view);

        canvas.addEventListener("pointerdown", this.onPointerDown.bind(this));
    }

    onPointerDown(event) {
        const coords = math.matrix([[event.offsetX], [this.canvas.height - event.offsetY]]);

        // Expand and augment to 4-vector from screen space coordinates
        const expanded = math.multiply(this.expand, coords);
        expanded.set([3, 0], 1);

        // Unproject window space coordinates
        const unprojected = math.multiply(this.projection_inverse, expanded);

        // Undo view transformation
        const localized = math.multiply(this.view_inverse, unprojected);

        // Update only relevant model space coordinates
        const cursor_clone = math.clone(this.cursor_getter());
        math.forEach(expanded, (val, index) => {
            if (val != 0) {
                cursor_clone.set(index, localized.get(index));
            }
        });

        this.coordinate_callback(cursor_clone, true);
    }
}