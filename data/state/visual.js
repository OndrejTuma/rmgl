import {action, observable} from 'mobx';

class VisualStore {
    @observable
    popups = new Map();

    @action
    deletePopup(id) {
        this.popups.delete(id);
    }

    @action
    setPopup(id) {
        this.popups.set(id, true);
    }
}

/**
 * @type VisualStore
 */
let store;

/**
 * @returns {VisualStore}
 */
export const getStore = () => {
    if (!store) {
        store = new VisualStore();
    }

    return store;
};