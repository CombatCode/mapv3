import 'whatwg-fetch';
import restful, { fetchBackend } from 'restful.js';

import { API } from './../settings';

export default class Rest {
    constructor() {
        this.api = restful(API.ADDRESS, fetchBackend(fetch));
    }

    get client() {
        return this.api;
    }
}
