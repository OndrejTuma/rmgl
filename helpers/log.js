import {getActivity} from '../helpers/localStorage';

import {getStore as getRedmineStore} from '../data/state/redmine';

const redmineStore = getRedmineStore();

export function getLog(date = new Date()) {
    const activities = getActivity();

    date = new Date(date);

    return activities.filter(activity => {
        const activityDate = new Date(activity.date);

        return (
            activityDate.getFullYear() === date.getFullYear()
            && activityDate.getMonth() === date.getMonth()
            && activityDate.getDate() === date.getDate()
        )
    }).map(activity => {
        return {
            ...activity,
            message: activity.platform === 'redmine'
                ? generateLogForRedmine(activity.data)
                : generateLogForGitlab(activity.data)
        }
    });
}

function generateLogForRedmine(data) {
    const issue = data[0];
    const status = redmineStore.getStatusById(issue.status.id);

    return `${issue.subject}, status: ${status.name}`;
}

function generateLogForGitlab(data) {
    const merge_request = data[0];

    return `${merge_request.title}`;
}