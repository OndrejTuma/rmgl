import {gitlabFetch} from './fetch';

export async function createMergeRequest(data) {
    return await gitlabFetch(`merge_requests`, 'POST', data);
}

export async function fetchMergeRequestsAssignedTo(assignee_id) {
    return await gitlabFetch('merge_requests', 'GET', {
        state: 'opened',
        assignee_id,
    });
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