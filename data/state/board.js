import {action, observable} from 'mobx';

class BoardStore {
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
        this.statuses = statuses;
    }
}

/**
 * @type BoardStore
 */
let store;

/**
 * @returns {BoardStore}
 */
export const getStore = () => {
    if (!store) {
        store = new BoardStore();
    }

    return store;
};