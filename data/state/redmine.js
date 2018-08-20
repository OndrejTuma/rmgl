import {action, observable} from 'mobx';

import {REDMINE_CLOSED_STATUS_ID} from 'Data/consts';

class RedmineStore {
    @observable
    statuses = [];

    @observable
    issues = new Map();

    @action
    clearIssues() {
        this.issues.clear();
    }

    @action
    deleteIssue(id) {
        this.issues.delete(id);
    }

    @action
    getIssuesByStatus(status_id) {
        return [...this.issues.values()].filter(issue => issue.status.id === status_id);
    }

    @action
    setIssues(issues) {
        issues.forEach(issue => this.setIssue(issue));
    }

    @action
    setIssue(issue) {
        this.issues.set(issue.id, issue);
    }

    @action
    setStatuses(statuses) {
        this.statuses = statuses.filter(status => status.id !== REDMINE_CLOSED_STATUS_ID);
    }

    @action
    updateIssue(issue) {
        //TODO: seems like i have to delete issue and set it again to trigger reaction
        this.deleteIssue(issue.id);
        this.setIssue(issue);
    }
}

/**
 * @type RedmineStore
 */
let store;

/**
 * @returns {RedmineStore}
 */
export const getStore = () => {
    if (!store) {
        store = new RedmineStore();
    }

    return store;
};