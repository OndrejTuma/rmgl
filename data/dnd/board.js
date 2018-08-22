import {updateIssue} from 'Data/api/redmine';
import {getStore as getRedmineStore} from 'Data/state/redmine';
import {getStore as getGeneralStore} from 'Data/state/general';
import {FETCHING} from 'Data/consts';

const generalStore = getGeneralStore();
const redmineStore = getRedmineStore();

export const issueSource = {
    beginDrag({issue}) {
        return {issue}
    },

    endDrag(props, monitor) {
        const {issue} = monitor.getItem();
        const {status_id} = monitor.getDropResult();

        if (issue && status_id) {
            if (issue.status.id === status_id) {
                return;
            }

            generalStore.setFetching(FETCHING.redmine);

            updateIssue(issue.id, {
                issue: {
                    status_id
                }
            }).then(response => {
                generalStore.deleteFetching(FETCHING.redmine);

                if (!response.ok) {
                    console.log(response);
                    alert('Something went wrong:(');
                    return;
                }

                redmineStore.updateIssue({
                    ...issue,
                    status: {
                        id: status_id
                    }
                })
            });
        }
    },
};

export const issueTarget = {
    drop({id: status_id}) {
        return {status_id}
    },
};