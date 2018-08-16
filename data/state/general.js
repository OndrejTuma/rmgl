import {action, observable} from 'mobx';

class GeneralStore {
    @observable
    isMobile = false;

    @observable
    fetching = new Map();

    @action
    deleteFetching(id) {
        this.fetching.delete(id);
    }

    @action
    setFetching(id) {
        this.fetching.set(id, true);
    }

    @action
    setIsMobile(isMobile) {
        this.isMobile = isMobile;
    }
}

/**
 * @type GeneralStore
 */
let store;

/**
 * @returns {GeneralStore}
 */
export const getStore = () => {
    if (!store) {
        store = new GeneralStore();
    }

    return store;
};