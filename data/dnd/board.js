import {updateIssue} from 'Data/api/redmine';
import {getStore as getBoardStore} from 'Data/state/board';
import {getStore as getGeneralStore} from 'Data/state/general';

const boardStore = getBoardStore();
const generalStore = getGeneralStore();

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

            generalStore.setFetching('issues');

            updateIssue(issue.id, {
                issue: {
                    status_id
                }
            }).then(response => {
                generalStore.deleteFetching('issues');

                if (!response.ok) {
                    alert('Something went wrong:(');
                    return;
                }

                boardStore.updateIssue({
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