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

import { getR } from './astro.mjs';
import { WorldView } from './worldview.mjs';
import { SceneNode, SceneGraph } from './scenegraph.mjs';
import { RenderVisitor } from './rendervisitor.mjs';
import { ChildFinderVisitor } from './childfindervisitor.mjs';
import * as Matrix from './matrix.mjs';

export { orientations } from './worldview.mjs';

export class World {
    constructor() {
        this.TU = 1;
        this.DU = 1;
        this.VU = 1;
        this.views = {};
        this.cursor_callbacks = {};
        this.object_descriptions = {};
        this.scene_graph = new SceneGraph();
        this.cursor_pos = math.matrix([[0], [0], [0], [1]]);
    }

    getDU() {
        return this.DU;
    }

    getTU() {
        return this.TU;
    }

    setCanonicalFromDescription(object_description) {
        console.info('Setting Canonical units according to ' + object_description.name);
        const DU_old = this.DU;
        const TU_old = this.TU;
        const VU_old = this.VU;

        this.DU = object_description.radius;
        this.TU = math.sqrt(math.pow(object_description.radius, 3) / object_description.mu);
        this.VU = this.DU / this.TU;

        const DU_factor = this.DU / DU_old;
        const TU_factor = this.TU / TU_old;
        const VU_factor = this.VU / VU_old;

        console.info('DU factor is ' + DU_factor);

        this.scene_graph.fmap((node) => { node.transform = math.multiply(node.transform, DU_factor); });
    }

    updateCursor(coords, should_propagate) {
        this.cursor_pos = coords;

        if (should_propagate) {
            for (const [, v] of Object.entries(this.cursor_callbacks)) {
                v(this.cursor_pos);
            }
        }

        this.draw();
    }

    createView(name, orientation, canvas) {
        this.views[name] = new WorldView(name, orientation, canvas,
            this.updateCursor.bind(this), () => { return this.cursor_pos; });

        this.draw();
    }

    addCursorCallback(
        name, callback) { this.cursor_callbacks[name] = callback; }

    removeCursorCallback(
        name) { delete this.cursor_callbacks[name]; }

    addObject(object) {
        console.info('Adding ' + object.name);
        if (object.name in this.object_descriptions) {
            console.info('Object already present - skipping');
            return;
        }

        this.object_descriptions[object.name] = object;

        if (object.parent in this.object_descriptions) {
            console.info('Parent already present (' + object.parent + ')');
            const parent_node = this.scene_graph.findNode(object.parent);
            const new_node = new SceneNode(object.name, parent_node, object);

            const r = getR(object, this.DU, this.AU);
            new_node.transform = Matrix.translate(r);
            console.info(new_node.transform);

            console.info('Adding ' + new_node.name + ' as child to ' + parent_node.name);
            parent_node.addChild(new_node);
        }
        else {
            console.info('Parent not present');
            this.largest_object = object;
            this.setCanonicalFromDescription(object);
            const new_node = new SceneNode(object.name, null, object);
            const finder = new ChildFinderVisitor(new_node);
            this.scene_graph.accept(finder);


            this.scene_graph.setRoot(new_node);
        }
    }

    drawGrid(v) {
        v.ctx.strokeStyle = '#B0B0B0';
        for (var i = 0; i < v.canvas.width; i += v.grid_constant) {
            v.ctx.beginPath();
            v.ctx.moveTo(i, 0);
            v.ctx.lineTo(i, v.canvas.height);
            v.ctx.stroke();
        }

        for (var i = 0; i < v.canvas.height; i += v.grid_constant) {
            v.ctx.beginPath();
            v.ctx.moveTo(0, i);
            v.ctx.lineTo(v.canvas.width, i);
            v.ctx.stroke();
        }
    }

    draw() {
        // Draw grid
        for (const [, v] of Object.entries(this.views)) {
            v.ctx.clearRect(0, 0, v.canvas.width, v.canvas.height);
            this.drawGrid(v);
        }

        // Draw objects
        const renderer = new RenderVisitor(this.views, this.DU);
        this.scene_graph.accept(renderer);

        // Draw cursors
        for (const [, v] of Object.entries(this.views)) {
            // Model space coordinates
            const C = math.multiply(v.collapse, this.cursor_pos);

            // View transformed coordinates
            const V = math.multiply(v.view, this.cursor_pos);

            // Window space coordinates
            const PV = math.multiply(v.projection, V);

            // Screen space coordinates
            const CPV = math.multiply(v.collapse, PV);

            const canvas_x = CPV.get([0, 0]);
            const canvas_y = v.canvas.height - CPV.get([1, 0]);
            const x = C.get([0, 0]);
            const y = C.get([1, 0]);

            v.ctx.beginPath();
            v.ctx.arc(canvas_x, canvas_y, 3, 0, math.tau);
            v.ctx.fill();

            v.ctx.strokeStyle = '#505050';
            v.ctx.beginPath();
            v.ctx.moveTo(0, canvas_y);
            v.ctx.lineTo(v.canvas.width, canvas_y);
            v.ctx.stroke();
            v.ctx.beginPath();
            v.ctx.moveTo(canvas_x, 0);
            v.ctx.lineTo(canvas_x, v.canvas.height);
            v.ctx.stroke();

            v.ctx.moveTo(canvas_x + 20, canvas_y - 20);
            v.ctx.fillText('(' + x.toFixed(3) + ', ' + y.toFixed(3) + ')',
                canvas_x + 20, canvas_y - 20);
        }
    }
}