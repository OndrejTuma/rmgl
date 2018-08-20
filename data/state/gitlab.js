import {action, observable} from 'mobx';

class GitlabStore {
    @observable
    my_merge_requests = [];

    @observable
    merge_requests_assigned_to_me = [];

    @action
    setMergeRequestsAssignedToMe(merge_requests) {
        this.merge_requests_assigned_to_me = merge_requests;
    }

    @action
    setMyMergeRequests(merge_requests) {
        this.my_merge_requests = merge_requests;
    }
}

/**
 * @type GitlabStore
 */
let store;

/**
 * @returns {GitlabStore}
 */
export const getStore = () => {
    if (!store) {
        store = new GitlabStore();
    }

    return store;
};