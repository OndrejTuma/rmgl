import {action, computed, observable} from 'mobx';

class ErrorStore {
    @observable.shallow
    errors = new Map();

    /**
     * @param id {string}
     * @returns {any}
     */
    getError(id) {
        return this.errors.get(id);
    }

    /**
     * @param id {string}
     * @param message {string}
     */
    @action
    addError(id, message) {
        this.errors.set(id, message);
    }

    @action
    removeAllErrors() {
        this.errors.clear();
    }

    /**
     * @param id {string}
     */
    @action
    removeError(id) {
        this.errors.delete(id);
    }
}

/**
 * @type ErrorStore
 */
let store;

/**
 * @returns {ErrorStore}
 */
export const getStore = () => {
    if (!store) {
        store = new ErrorStore();
    }

    return store;
};