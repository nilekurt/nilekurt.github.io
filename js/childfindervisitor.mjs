export class ChildFinderVisitor {
    constructor(node) {
        this.accum = node;
    }

    visit(node) {
        console.info('Examining node with name ' + node.name);
        if (node.user_data.parent == this.accum.name) {
            console.info('Adding ' + node.name + ' as child to ' + this.accum.name);
            this.accum.addChild(node);
        }

        for (const child in node.children) {
            accept(this)
        }
    }
}