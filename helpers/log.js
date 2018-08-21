import {getActivity} from '../helpers/localStorage';

import {getStore as getRedmineStore} from '../data/state/redmine';

const redmineStore = getRedmineStore();

export function getLog(day = new Date()) {
    const activities = getActivity();
    day = new Date(day);

    return activities.filter(activity => {
        const activityDate = new Date(activity.date);

        return (
            activityDate.getFullYear() === day.getFullYear()
            && activityDate.getMonth() === day.getMonth()
            && activityDate.getDate() === day.getDate()
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