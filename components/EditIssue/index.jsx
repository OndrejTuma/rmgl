import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import Button from '../Button';
import Form from '../Form';
import FormSelect from '../FormSelect';
import Textarea from '../Textarea';

import {updateIssue} from 'Data/api/redmine';

import styles from './edit-issue.scss';

@inject('boardStore', 'generalStore', 'teamStore', 'visualStore')
@observer
class EditIssue extends Component {

    get statusesOptions() {
        const {boardStore} = this.props;
        const options = {};

        boardStore.statuses.forEach(status => options[status.id] = status.name);

        return options;
    }

    get usersOptions() {
        const {teamStore} = this.props;
        const options = {};

        teamStore.members.forEach(member => options[member.redmine_id] = `${member.firstname} ${member.lastname}`);

        return options;
    }

    handleSubmit = async elements => {
        const {boardStore, generalStore, issue} = this.props;

        generalStore.setFetching(issue.id);

        const changed_issue_props = {
            assigned_to_id: parseInt(elements.get('assigned_to_id')),
            status_id: parseInt(elements.get('status_id')),
            notes: elements.get('notes'),
        };

        updateIssue(issue.id, {issue: changed_issue_props}).then(response => {
            generalStore.deleteFetching(issue.id);

            if (!response.ok) {
                alert('Something went wrong:(');
                return;
            }

            //issue update
            boardStore.updateIssue({
                ...issue,
                assigned_to: {
                    id: changed_issue_props.assigned_to_id,
                },
                status: {
                    id: changed_issue_props.status_id
                },
                last_update: new Date(),
            });

            this.props.visualStore.deletePopup(issue.id);
        });
    };

    render() {
        const {issue: {assigned_to, id, subject, status}, generalStore} = this.props;

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
                    <Textarea label={'Comment:'} name={'notes'}/>
                    <Button label={'Save'} busy={generalStore.fetching.has(id)}/>
                </Form>
            </div>
        )
    }
}

export default EditIssue;