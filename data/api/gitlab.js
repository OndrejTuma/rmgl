import {gitlabFetch} from './fetch';
import {API_URL_GITLAB_ALL_PROJECTS} from './consts';

export async function createMergeRequest(data) {
    return await gitlabFetch('merge_requests', 'POST', data);
}

export async function mergeMergeRequest(id, iid) {
    return await gitlabFetch(`merge_requests/${iid}/merge`, 'PUT', {
        id,
        iid,
        merge_when_pipeline_succeeds: true,
    });
}

export async function fetchMergeRequestsAssignedTo(assignee_id) {
    return await gitlabFetch('merge_requests', 'GET', {
        state: 'opened',
        assignee_id,
    });
}

export async function fetchMergeRequestsAssignedToMe() {
    return await gitlabFetch('merge_requests', 'GET', {
        state: 'opened',
        scope: 'assigned_to_me',
    }, API_URL_GITLAB_ALL_PROJECTS);
}

export async function fetchMergeRequestsFrom(author_id) {
    return await gitlabFetch('merge_requests', 'GET', {
        state: 'opened',
        author_id,
    });
}

export async function updateMergeRequest(iid, data) {
    return await gitlabFetch(`merge_requests/${iid}`, 'PUT', data);
}