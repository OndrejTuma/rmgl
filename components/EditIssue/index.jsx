import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import Button from '../Button';
import Form from '../Form';
import FormSelect from '../FormSelect';
import Textarea from '../Textarea';

import {updateIssue} from 'Data/api/redmine';
import {STATUS_DONE_RATIOS} from 'Data/consts';

import styles from './edit-issue.scss';

@inject('generalStore', 'redmineStore', 'teamStore', 'visualStore')
@observer
class EditIssue extends Component {

    get doneRatioOptions() {
        const options = {};

        Array.from(Array(11), (_,x) => options[x * 10] = x * 10);

        return options;
    }

    get statusesOptions() {
        const {redmineStore} = this.props;
        const options = {};

        redmineStore.statuses.forEach(status => options[status.id] = status.name);

        return options;
    }

    get usersOptions() {
        const {teamStore} = this.props;
        const options = {};

        teamStore.members.forEach(member => options[member.redmine_id] = `${member.firstname} ${member.lastname}`);

        return options;
    }

    handleSubmit = async elements => {
        const {redmineStore, generalStore, issue, popup_id, teamStore: {active_member}, visualStore} = this.props;

        generalStore.setFetching(popup_id);

        const changed_issue_props = {
            assigned_to_id: parseInt(elements.get('assigned_to_id')),
            status_id: parseInt(elements.get('status_id')),
            notes: elements.get('notes'),
            done_ratio: elements.get('done_ratio'),
        };

        if (STATUS_DONE_RATIOS.has(changed_issue_props.status_id)) {
            changed_issue_props.done_ratio = STATUS_DONE_RATIOS.get(changed_issue_props.status_id);
        }

        updateIssue(issue.id, {issue: changed_issue_props}).then(response => {
            generalStore.deleteFetching(popup_id);

            if (!response.ok) {
                console.log(response);
                alert('Something went wrong:(');
                return;
            }

            if (changed_issue_props.assigned_to_id !== active_member.redmine_id) {
                redmineStore.deleteIssue(issue.id);
            }
            else {
                redmineStore.updateIssue({
                    ...issue,
                    ...changed_issue_props,
                    assigned_to: { id: changed_issue_props.assigned_to_id },
                    status: { id: changed_issue_props.status_id },
                    last_update: new Date(),
                });
            }

            visualStore.deletePopup(popup_id);
        });
    };

    render() {
        const {issue: {assigned_to, done_ratio, subject, status}, generalStore, popup_id} = this.props;

        return (
            <div>
                <h3 className={styles.heading}><span>Editing</span> {subject}</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormSelect
                        label={'Status:'}
                        name={'status_id'}
                        options={this.statusesOptions}
                        selected={status.id}
                    />
                    <FormSelect
                        label={'Assigned to:'}
                        name={'assigned_to_id'}
                        options={this.usersOptions}
                        selected={assigned_to.id}
                    />
                    <FormSelect
                        label={'Done ratio:'}
                        name={'done_ratio'}
                        options={this.doneRatioOptions}
                        selected={done_ratio}
                    />
                    <Textarea label={'Comment:'} name={'notes'}/>
                    <Button label={'Save'} busy={generalStore.fetching.has(popup_id)}/>
                </Form>
            </div>
        )
    }
}

export default EditIssue;