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

import { orientations, World } from './world.mjs'
import * as Astro from './astro.mjs'

document.addEventListener("DOMContentLoaded", () => {
    const world = new World();

    for (const [name, orientation] of [['tl', orientations.XYZ],
    ['bl', orientations.XZY],
    ['br', orientations.YZX]]) {
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
    ctx2d.fillText("TODO: 3D View", canvas3d.width / 2, canvas3d.height / 2);

    const x_input = document.getElementById("xcoord");
    const y_input = document.getElementById("ycoord");
    const z_input = document.getElementById("zcoord");

    const coord_callback = (event) => {
        const coords = math.matrix(
            [[x_input.value], [y_input.value], [z_input.value], [1]]);
        world.updateCursor(coords, false);
    };

    x_input.onkeypress = coord_callback;
    y_input.onkeypress = coord_callback;
    z_input.onkeypress = coord_callback;

    world.addCursorCallback("coord_inputs", (cursor) => {
        const x = cursor.get([0, 0]);
        const y = cursor.get([1, 0]);
        const z = cursor.get([2, 0]);
        x_input.value = parseFloat(x.toFixed(3));
        y_input.value = parseFloat(y.toFixed(3));
        z_input.value = parseFloat(z.toFixed(3));
    });

    const earth = new Astro.Earth();
    const moon = new Astro.Moon();

    world.addObject(earth);
    world.addObject(moon);

    console.info(earth);
    console.info(moon);

    world.updateCursor(math.matrix([[0], [0], [0], [0]]));

    const DU = world.getDU();
    const TU = world.getTU();

    const param_list = document.getElementById("params");
    param_list.innerHTML += ('<li>DU: ' + DU.toExponential(3) + ' m</li>');
    param_list.innerHTML += ('<li>TU: ' + TU.toExponential(3) + ' m</li>');

    // @TODO: Add view navigation
    // @TODO: Add object rendering
    // @TODO: Clean up cursor rendering
    // @TODO: Add solver interface
    // @TODO: Add solver code
    // @TODO: Add multiple solvers
    // @TODO: Optimize solvers using wasm
});
