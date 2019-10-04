import * as Matrix from './matrix.mjs'

export class RenderVisitor {
    constructor(views, DU) {
        this.views = views;
        this.DU = DU;
        this.matrix_stack = [];
    }

    visit(node) {
        this.matrix_stack.push(node.transform);

        for (const [k, v] of Object.entries(this.views)) {
            var model = math.identity(4);
            for (const t of this.matrix_stack) {
                model = math.multiply(t, model);
            }

            const pos = Matrix.position(model);
            const V = math.multiply(v.view, pos);
            const PV = math.multiply(v.projection, V);
            const CPV = math.multiply(v.collapse, PV);

            const canvas_x = CPV.get([0, 0]);
            const canvas_y = v.canvas.height - CPV.get([1, 0]);

            v.ctx.beginPath();
            v.ctx.arc(canvas_x, canvas_y, 10 * node.user_data.radius / this.DU, 0, math.tau);
            v.ctx.fill();

            v.ctx.moveTo(canvas_x + 20, canvas_y - 20);
            v.ctx.fillText(node.name,
                canvas_x + 20, canvas_y - 20);
        }

        for (const child of node.children) {
            child.accept(this);
        }

        this.matrix_stack.pop();
    }
}