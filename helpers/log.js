import {getActivity} from '../helpers/localStorage';

import {getStore as getRedmineStore} from '../data/state/redmine';
import {getStore as getTeamStore} from '../data/state/team';
import {CURRENT_MEMBER_REDMINE_ID} from '../data/consts';
import ACTIVITIES from '../decorators/activity-types';
import PLATFORMS from '../decorators/platform-types';

const redmineStore = getRedmineStore();
const teamStore = getTeamStore();

const myGitlabId = teamStore.getMemberByRedmineId(CURRENT_MEMBER_REDMINE_ID).gitlab_id;

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
            activity.platform === PLATFORMS.REDMINE
                ? accumulateRedmine(accumulator, activity)
                : accumulateGitlab(accumulator, activity);

            return accumulator;
        }, []);
}

export function getDaysOfActivity() {
    const activities = getActivity();

    return activities.reduce((accumulator, activity) => {
        const date = new Date(activity.date);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const partial_date = `${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;

        if (accumulator.indexOf(partial_date) < 0) {
            accumulator.push(partial_date);
        }

        return accumulator;
    }, []);
}

function accumulateGitlab(activities, activity) {
    const existing_activity_index = getActivityIndexById(activities, activity.data[0].id);
    const merge_request = activity.data[0];

    if (existing_activity_index < 0 || activities[existing_activity_index].activity !== activity.activity) {
        let name;

        if (myGitlabId === merge_request.author.id && activity.activity === ACTIVITIES.CODE_REVIEW) {
            name = `Working on remarks: ${merge_request.title}`;
        }
        else {
            name = `${activity.activity}: ${merge_request.title}`;
        }

        activities.push({
            ...activity,
            name,
            status: [],
        });
    }
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
            name: `\`${issue.id}\`: ${issue.subject}`,
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
    return -1;
}