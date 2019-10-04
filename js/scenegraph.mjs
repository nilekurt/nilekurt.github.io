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

export class SceneNode {
    constructor(name, parent, user_data) {
        this.name = name;
        this.parent = parent;
        this.transform = math.identity(4);
        this.user_data = user_data;
        this.children = [];
    }

    setTransform(transform) {
        this.transform = transform;
    }

    addChild(node) { this.children.push(node); }

    findChild(name) {
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
    }

    accept(visitor) {
        visitor.visit(this);
    }

    fmap(f) {
        f(this);

        for (const child of this.children) {
            child.fmap(f);
        }
    }
}

export class SceneGraph {
    constructor() { this.root = null; }

    setRoot(node) {
        console.info('Setting ' + node.name + ' as root');
        const old_root = this.root;
        this.root = node;

        return old_root;
    }

    findNode(name) {
        if (this.root) {
            return this.root.findChild(name);
        }

        return null;
    }

    accept(visitor) {
        if (this.root) {
            this.root.accept(visitor);
        }
    }

    fmap(f) {
        if (this.root) {
            this.root.fmap(f);
        }
    }
}