import { html } from '../helper.js';

export default class Button {
    constructor ({parent, fn, updateFn = null, label, title = null, id}) {
        this.fn = fn;
        this.updateFn = updateFn;

        this.label = label;
        this.id = id;
        this.title = title;

        this.node = null;
        this.parent = parent;

        this.render();
        this.eventListener();
    }

    render () {
        this.node = html('button', {
            id: this.id 
        }, null);

        this.node.innerHTML = this.label;

        if (this.title) this.node.title = this.title;

        this.parent.appendChild(this.node);
    }

    eventListener () {
        this.node.addEventListener('click', this.eventHandler.bind(this));
    }

    eventHandler (e) {
        this.fn();

        if (this.updateFn) this.updateFn();
    }
}
