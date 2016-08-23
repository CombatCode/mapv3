import { API } from './../settings';


/**
 * Base class of our WebSocket client
 * @module core/Socket
 */
export default class Socket {
    constructor() {
        this.ws = new WebSocket(API.WS_ADDRESS);
    }

    get client() {
        return this.ws;
    }
}
