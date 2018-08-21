import {action, observable} from 'mobx';

import {storageLog} from '../../decorators/log';

class GitlabStore {
    @observable
    my_merge_requests = [];

    @observable
    merge_requests_assigned_to_me = [];

    getMyMergeRequestByIssueId(id) {
        for (const mr of this.my_merge_requests) {
            if (mr.title.includes(id)) {
                return mr;
            }
        }

        return false;
    }

    @action
    deleteMergeRequestAssignedToMeByIid(iid) {
        this.setMergeRequestsAssignedToMe(
            this.merge_requests_assigned_to_me.filter(merge_request => merge_request.iid !== iid)
        );
    }

    @action
    setMergeRequestsAssignedToMe(merge_requests) {
        this.merge_requests_assigned_to_me = merge_requests;
    }

    @action
    setMyMergeRequests(merge_requests) {
        this.my_merge_requests = merge_requests;
    }

    @action
    @storageLog('gitlab', 'Merge request created')
    addMyMergeRequest(merge_request) {
        this.my_merge_requests.push(merge_request);
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