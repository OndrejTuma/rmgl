import {gitlabFetch} from './fetch';
import {API_URL_GITLAB_ALL_PROJECTS} from './consts';

export function createMergeRequest(data) {
    return gitlabFetch('merge_requests', 'POST', data);
}

export function mergeMergeRequest(id, iid) {
    return gitlabFetch(`merge_requests/${iid}/merge`, 'PUT', {
        id,
        iid,
        merge_when_pipeline_succeeds: true,
    });
}

export function rebaseMergeRequest(id, iid) {
    return gitlabFetch(`merge_requests/${iid}/rebase`, 'PUT', {
        id,
        iid,
    });
}

export function fetchMergeRequestsAssignedTo(assignee_id) {
    return gitlabFetch('merge_requests', 'GET', {
        include_rebase_in_progress: true,
        assignee_id,
        state: 'opened',
    });
}

export function fetchMergeRequestsAssignedToMe() {
    return gitlabFetch('merge_requests', 'GET', {
        include_rebase_in_progress: true,
        state: 'opened',
        scope: 'assigned_to_me',
    }, API_URL_GITLAB_ALL_PROJECTS);
}

export function fetchMergeRequestsFrom(author_id) {
    return gitlabFetch('merge_requests', 'GET', {
        author_id,
        include_rebase_in_progress: true,
        state: 'opened',
    });
}

export function updateMergeRequest(iid, data) {
    return gitlabFetch(`merge_requests/${iid}`, 'PUT', data);
}