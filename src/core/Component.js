import uuid from 'uuid4';


/**
 * Base component class for one-way data binding
 * it's very similar to ReactJS component architecture,
 * but not supporting props and propTypes.
 * Use this documentation as reference {@link https://facebook.github.io/react/docs/component-specs.html}
 * @module core/Component
 */
export default class Component {
    constructor() {
        this.state = {};
        this._element = document.createElement('loader');
        this.uuid = uuid();
        this.postInitialize();
    }

    /**
     * Use this method to update state of component
     * @param {object} updatedState
     */
    setState(updatedState) {
        Object.assign(this.state, updatedState);
        this.postRender();
    }

    /**
     * Overwrite this method to initialize any logic operation
     * on your component
     */
    initialize() {
        // Overwrite your component initialize
        this.state.text = 'Example component content';
    }

    /**
     * Build in function to make operations after initialization is over
     */
    postInitialize() {
        // Take component initialize asynchronously to take care
        // about constructor of extending component class
        setTimeout(() => {this.initialize()}, 1);
    }

    /**
     * Overwrite this method to make any DOM operations.
     * @returns {Element}
     */
    render() {
        // Overwrite your dom initialize
        let content = document.createTextNode(this.state.text);
        let wrapper = document.createElement('component');

        wrapper.appendChild(content);

        return wrapper;
    }

    /**
     * Build in function to apply operations after render is over
     */
    postRender() {
        // Take component render method and apply UUID
        const componentElement = this.render();

        componentElement.setAttribute('data-component', this.uuid);

        this._element = componentElement;
        this.postUpdate();
    }

    /**
     * Last element of the component life cycle, mostly used by applyComponent method
     */
    static postUpdate() {
        return false;
    }

    /**
     * Setter of postUpdate method
     * @param func
     */
    set onUpdate(func) {
        this.postUpdate = func;
    }

    /**
     * Element getter
     * @returns {Element|*}
     */
    get element() {
        return this._element;
    }
}


/**
 * Applying component into DOM body
 * @param {string} qs - Query String, where we should inject component
 * @param {Component|*} component
 */
export function applyComponent(qs, component) {
    const element = document.querySelector(qs);
    // XXX: Slow method of childs cleaning, it can be improved if needed
    element.innerHTML = '';
    element.appendChild(component.element);
    component.onUpdate = () => {
        applyComponent(qs, component)
    };
}
