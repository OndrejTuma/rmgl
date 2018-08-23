import {updateIssue} from 'Data/api/redmine';
import {getStore as getRedmineStore} from 'Data/state/redmine';
import {getStore as getGeneralStore} from 'Data/state/general';
import {FETCHING, STATUS_DONE_RATIOS} from 'Data/consts';

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

            const changed_issue_props = {
                status_id,
            };

            if (STATUS_DONE_RATIOS.has(status_id)) {
                changed_issue_props.done_ratio = STATUS_DONE_RATIOS.get(status_id);
            }

            updateIssue(issue.id, {
                issue: changed_issue_props
            }).then(response => {
                generalStore.deleteFetching(FETCHING.redmine);

                if (!response.ok) {
                    console.log(response);
                    alert('Something went wrong:(');
                    return;
                }

                redmineStore.updateIssue({
                    ...issue,
                    ...changed_issue_props,
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