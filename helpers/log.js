import {getActivity} from '../helpers/localStorage';

import {getStore as getRedmineStore} from '../data/state/redmine';

const redmineStore = getRedmineStore();

export function getLogs(date = new Date()) {
    const activities = getActivity();

    date = new Date(date);

    return activities.filter(activity => {
        const activityDate = new Date(activity.date);

        return (
            activityDate.getFullYear() === date.getFullYear()
            && activityDate.getMonth() === date.getMonth()
            && activityDate.getDate() === date.getDate()
        )
    })
        .reduce((accumulator, activity) => {

            activity.platform === 'redmine'
                ? accumulateRedmine(accumulator, activity)
                : accumulateGitlab(accumulator, activity);

            return accumulator;
        }, []);
}

function accumulateGitlab(activities, activity) {
    const merge_request = activity.data[0];

    activities.push({
        ...activity,
        name: `${activity.activity} - ${merge_request.title}`,
        status: [],
    });
}

function accumulateRedmine(activities, activity) {
    const existing_activity_index = getActivityIndexById(activities, activity.data[0].id);
    const issue = activity.data[0];

    if (!Object.keys(issue).length) {
        return;
    }

    const status = redmineStore.getStatusById(issue.status.id);

    if (existing_activity_index >= 0) {
        if (activities[existing_activity_index].status.indexOf(status.name) < 0) {
            activities[existing_activity_index].status.push(status.name);
        }
    }
    else {
        activities.push({
            ...activity,
            name: `#${issue.id}: ${issue.subject}`,
            status: [status.name],
        })
    }
}

function getActivityIndexById(activities, id) {
    for (const index in activities) {
        if (activities[index].data[0].id === id) {
            return index;
        }
    }
}

function generateLogForRedmine(data) {
    const issue = data[0];
    const status = redmineStore.getStatusById(issue.status.id);

    return `#${issue.id}: ${issue.subject}, status: ${status.name}`;
}

function generateLogForGitlab(data) {
    const merge_request = data[0];

    return `${merge_request.title}`;
}