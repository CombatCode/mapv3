import 'whatwg-fetch';
import restful, { fetchBackend } from 'restful.js';

import { SETTINGS } from './../settings';
import Storage from './Storage';


/**
 * Base class of our API client
 * @module core/Rest
 */
export default class Rest {
    constructor() {
        this.api = restful(SETTINGS.API.ADDRESS, fetchBackend(fetch));

        let authStorage = new Storage(localStorage, 'auth');

        this.api.header('username', authStorage.getItem('username'));
    }

    get client() {
        return this.api;
    }
}
