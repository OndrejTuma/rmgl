import {redmineFetch} from './fetch';

export async function fetchStatuses() {
    return await redmineFetch('issue_statuses.json');
}

export async function fetchIssues(assigned_to_id) {
    return await redmineFetch('issues.json', 'GET', {
        assigned_to_id,
        include: 'tag',
    });
}

export async function updateIssue(id, data) {
    return await redmineFetch(`issues/${id}.json`, 'PUT', data);
}