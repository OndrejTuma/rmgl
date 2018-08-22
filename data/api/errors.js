export const ERR_BACKEND = 'ERR_BACKEND';
export const ERR_BACKEND_MSG = 'Response server error';
export const ERR_FORMAT = 'ERR_FORMAT';
export const ERR_FORMAT_MSG = 'Data has wrong format';
export const ERR_NETWORK = 'ERR_NETWORK';
export const ERR_NETWORK_MSG = 'Failed to fetch!';
export const ERR_RUNTIME = 'ERR_RUNTIME';
export const ERR_RUNTIME_MSG = 'Runtime Error!';

export class AppError extends Error {
    /** @type {string} */
    code;
    /** @type {Error} */
    cause;

    /**
     * @param {string} code
     * @param {string} message
     * @param {Error} [cause]
     **/
    constructor(code, message, cause) {
        super(message);

        this.code = code;
        this.message = message;
        this.cause = cause;
    }
}