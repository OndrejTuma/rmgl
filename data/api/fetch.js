import 'isomorphic-unfetch';

import {
    AppError,
    ERR_BACKEND,
    ERR_BACKEND_MSG,
    ERR_FORMAT,
    ERR_FORMAT_MSG,
    ERR_NETWORK,
    ERR_NETWORK_MSG
} from '../errors';

import {
    API_KEY_GITLAB,
    API_KEY_REDMINE,
    API_URL_GITLAB,
    API_URL_REDMINE,
} from './consts';

export async function redmineFetch(resource, method = 'GET', data = {}) {
    return await restFetch(`${API_URL_REDMINE}${resource}`, method, Object.assign(data, {
        key: API_KEY_REDMINE,
    }));
}

export async function gitlabFetch(resource, method = 'GET', data = {}) {
    return await restFetch(`${API_URL_GITLAB}${resource}`, method, Object.assign(data, {
        private_token: API_KEY_GITLAB,
    }));
}

async function restFetch(url, method, data) {
    if (method === 'GET' && data) {
        url += /\?/.test(url) ? '&' : '?';

        for (let [key, value] of Object.entries(data)) {
            url += `${key}=${value}&`
        }
    }

    let result;
    try {
        result = await fetch(url, {
            method,
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: method === 'GET' ? null : JSON.stringify(data)
        });
    }
    catch (e) {
        throw new AppError(ERR_NETWORK, ERR_NETWORK_MSG);
    }

    if (result.status > 210) {
        throw new ApiError(ERR_BACKEND, ERR_BACKEND_MSG);
    }

    if (method !== 'GET') {
        return result;
    }

    let resultJson;
    try {
        resultJson = result.json();
    } catch (e) {
        throw new ApiError(ERR_FORMAT, ERR_FORMAT_MSG);
    }

    return resultJson;
}

export class ApiError extends AppError {}