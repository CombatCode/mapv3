import { API } from './../settings';

/**
 * Base class of our WebSocket client
 * @module core/WebSocket
 */
export default class WS {
    constructor() {
        this.ws = new WebSocket(API.WS_ADDRESS);
    }

    get client() {
        return this.ws;
    }
}
