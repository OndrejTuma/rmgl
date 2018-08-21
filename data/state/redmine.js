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
        const new_issues = new Map();

        issues.forEach(issue => new_issues.set(issue.id, issue));

        this.issues = new_issues;
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
        const new_issues = new Map();

        [...this.issues.values()].forEach(new_issue => {
            if (issue.id === new_issue.id) {
                new_issues.set(issue.id, issue);

                return;
            }

            new_issues.set(new_issue.id, new_issue);
        });

        this.issues = new_issues;
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