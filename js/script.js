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

var LambertSim = LambertSim || {};

var Astro = Astro || {};

Astro.getRV = function (object, DU, TU) {
    // TODO: Kepler to Canonical RV
    return math.matrix([[1.0], [0.0], [0.0]]);
}

Astro.Sol = function () {
    this.name = "Sol";
    this.children = ["Earth"];
    this.mu = 1.3271244004e20;
    this.radius = 6.95510e9;
};

Astro.Earth = function () {
    this.name = "Earth";
    this.parent = "Sol";
    this.children = ["Moon"];
    this.mu = 3.9860044e14;
    this.radius = 6.37814e6;

    this.semimajor_axis = 1.49597e11;
    this.eccentricity = 1.671e-2;
    this.longitude_of_ascending_node = 6.08665;
    this.inclination = 8.7e-8;
    this.argument_of_periapsis = 1.9933;
    this.mean_anomaly = 6.23985;
};

Astro.Moon = function () {
    this.name = "Moon";
    this.parent = "Earth";
    this.mu = 4.90487e12;
    this.radius = 1.7371e6;

    this.semimajor_axis = 3.84400e9;
    this.eccentricity = 5.54e-2;
    this.longitude_of_ascending_node = 2.1831;
    this.inclination = 9.01e-2;
    this.argument_of_periapsis = 5.5528;
    this.mean_anomaly = 2.36091;
};

const orientations = {
    XYZ: 'xyz',
    XZY: 'xzy',
    YZX: 'yzx'
};

LambertSim.SceneNode = function (name, parent, user_data) {
    this.name = name;
    this.parent = parent;
    this.transform = math.matrix([[0], [0], [0]]);
    this.user_data = user_data;
    this.children = [];
};

LambertSim.SceneNode.prototype.fmap = function (f) {
    f(this);

    for (child of this.children) {
        child.fmap(f);
    }
};

LambertSim.SceneNode.prototype.addChild = function (
    node) { this.children.push(node); };

LambertSim.SceneNode.prototype.findChild = function (name) {
    if (this.name == name) {
        return this;
    }

    for (child of this.children) {
        const result = child.findChild(name);
        if (result) {
            return result;
        }
    }

    return null;
};

LambertSim.SceneNode.prototype.setTransform = function (transform) {
    this.transform = transform;
}

LambertSim.SceneGraph =
    function () { this.root = null; };

LambertSim.SceneGraph.prototype.fmap = function (f) {
    if (this.root) {
        this.root.fmap(f);
    }
}

LambertSim.SceneGraph.prototype.findNode = function (name) {
    if (this.root) {
        return this.root.findChild(name);
    }

    return null;
}

LambertSim.SceneGraph.prototype.setRoot = function (node) {
    console.info('Setting ' + node.name + ' as root');
    const old_root = this.root;
    this.root = node;

    return old_root;
}

LambertSim.WorldView = function (name, orientation, canvas,
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
};

LambertSim.WorldView.prototype.onPointerDown = function (event) {
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
};

LambertSim.World = function () {
    this.TU = 1;
    this.DU = 1;
    this.VU = 1;
    this.views = {};
    this.cursor_callbacks = {};
    this.object_descriptions = {};
    this.scene_graph = new LambertSim.SceneGraph();
    this.cursor_pos = math.matrix([[0], [0], [0]]);
};

LambertSim.World.prototype.drawGrid = function (v) {
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
};

LambertSim.World.prototype.redraw = function () {
    for (const [, v] of Object.entries(this.views)) {
        v.ctx.clearRect(0, 0, v.canvas.width, v.canvas.height);
        this.drawGrid(v);

        this.scene_graph.fmap((node) => { });


        const collapsed = math.multiply(v.collapse, this.cursor_pos);

        const unoffset = math.subtract(this.cursor_pos, v.offset);
        const projected = math.multiply(v.projection, unoffset);
        const collapsed_projected = math.multiply(v.collapse, projected);

        const canvas_x = collapsed_projected.get([0, 0]);
        const canvas_y = v.canvas.height - collapsed_projected.get([1, 0]);
        const x = collapsed.get([0, 0]);
        const y = collapsed.get([1, 0]);

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
};

LambertSim.World.prototype.updateCursor = function (coords, should_propagate) {
    this.cursor_pos = coords;

    if (should_propagate) {
        for (const [, v] of Object.entries(this.cursor_callbacks)) {
            v(this.cursor_pos);
        }
    }

    this.redraw();
};

LambertSim.World.prototype.createView = function (name, orientation, canvas) {
    this.views[name] = new LambertSim.WorldView(name, orientation, canvas,
        this.updateCursor.bind(this), () => { return this.cursor_pos; });

    this.redraw();
};

LambertSim.World.prototype.addCursorCallback = function (
    name, callback) { this.cursor_callbacks[name] = callback; };

LambertSim.World.prototype.removeCursorCallback = function (
    name) { delete this.cursor_callbacks[name]; };

LambertSim.World.prototype.setCanonical = function (object) {
    console.info('Setting Canonical units according to ' + object.name);
    const DU_old = this.DU;
    const TU_old = this.TU;
    const VU_old = this.VU;

    this.DU = object.radius;
    this.TU = math.sqrt(math.pow(object.radius, 3) / object.mu);
    this.VU = this.DU / this.TU;

    const DU_factor = this.DU / DU_old;
    const TU_factor = this.TU / TU_old;
    const VU_factor = this.VU / VU_old;

    this.scene_graph.fmap((node) => { math.multiply(node.transform, DU_factor); });
}

LambertSim.World.prototype.addObject = function (object) {
    console.info('Adding ' + object.name);
    if (object.name in this.object_descriptions) {
        console.info('Object already present - skipping');
        return;
    }

    this.object_descriptions[object.name] = object;

    if (object.parent in this.object_descriptions) {
        console.info('Parent already present (' + object.parent + ')');
        const parent_node = this.scene_graph.findNode(object.parent);
        const new_node = new LambertSim.SceneNode(object.name, parent_node, object);

        const transform = Astro.getRV(object, this.DU, this.AU);
        new_node.transform = transform;

        console.info('Adding ' + new_node.name + ' as child to ' + parent_node.name);
        parent_node.addChild(new_node);
    }
    else {
        console.info('Parent not present');
        this.largest_object = object;
        this.setCanonical(object);
        const new_node = new LambertSim.SceneNode(object.name, null, object);
        this.scene_graph.fmap((node) => {
            console.info('Examining node with name ' + node.name);
            if (node.user_data.parent == object.name) {
                console.info('Adding ' + node.name + ' as child to ' + object.name);
                new_node.addChild(node);
            }
        });
        this.scene_graph.setRoot(new_node);
    }

    const node = new LambertSim.SceneNode()
};

document.addEventListener("DOMContentLoaded", () => {
    const world = new LambertSim.World();

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
            [[x_input.value], [y_input.value], [z_input.value]]);
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

    world.updateCursor(math.matrix([[0], [0], [0]]));

    const earth = new Astro.Earth();
    const moon = new Astro.Moon();

    world.addObject(earth);
    world.addObject(moon);

    console.info(earth);
    console.info(moon);

    // @TODO: Add view navigation
    // @TODO: Add object rendering
    // @TODO: Clean up cursor rendering
    // @TODO: Add solver interface
    // @TODO: Add solver code
    // @TODO: Add multiple solvers
    // @TODO: Optimize solvers using wasm
});
