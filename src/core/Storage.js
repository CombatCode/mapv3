/**
 * @module core/Storage
 * @description
 * Service to hold key/value pairs using localStorage or sessionStorage.
 * Supports all major browsers http://caniuse.com/#feat=namevalue-storage
 */
export default class Storage {
    constructor(engine, prefix) {
        this.prefix = prefix;
        this.engine = engine;
        /**
         * Verify if engine is provided.
         */
        if (!engine) {
            throw Error('WebStorage engine was not provided.');
        } else if (!this.isEngineSupported()) {
            throw Error('WebStorage engine is not supported.');
        }
    }

    /**
     * @function isEngineSupported
     * @description
     * Function to verify if requested engine is supported by
     * client browser.
     * @return {Boolean} True if engine is supported, else false.
     */
    isEngineSupported() {
        try {
            const param = '__support__';
            this.engine.setItem(param, param);
            this.engine.removeItem(param);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * @method setItem
     * @description
     * Setter for the key/value web store.
     * @param {String} key - Name of the key to retrieve.
     * @param {String} value - Name of the value to retrieve.
     * @return {Boolean} True on success, else false.
     */
    setItem(key, value) {
        const formattedKey = `${this.prefix}:${key}`;

        return this.engine.setItem(formattedKey, value) || false;
    };

    /**
     * @method getItem
     * @description
     * Getter for the key/value web store.
     * @param {String} key - Name of the value to retrieve.
     * @return {Boolean} True on success, else false.
     */
    getItem(key) {
        const formattedKey = `${this.prefix}:${key}`;

        return this.engine.getItem(formattedKey) || false;
    };

    /**
     * @method removeItem
     * @description
     * Remove a specified value from the key/value web store.
     * @param {String} key - Name of the value to remove.
     * @return {Boolean} True on success, else false.
     */
    removeItem(key) {
        const formattedKey = `${this.prefix}:${key}`;

        return this.engine.removeItem(formattedKey) || false;
    };
}
