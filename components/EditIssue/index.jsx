import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import Button from '../Button';
import Form from '../Form';
import FormSelect from '../FormSelect';
import Textarea from '../Textarea';

import {fetchIssues, updateIssue} from 'Data/api/redmine';

import styles from './edit-issue.scss';

@inject('boardStore', 'generalStore', 'teamStore')
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
        const {boardStore, generalStore, id, teamStore: {active_member_redmine_id}} = this.props;

        generalStore.setFetching(id);

        updateIssue(id, {
            issue: {
                assigned_to_id: elements.get('assigned_to_id'),
                status_id: elements.get('status_id'),
                notes: elements.get('notes'),
            }
        }).then(response => {
            generalStore.deleteFetching(id);

            if (response.ok) {
                generalStore.setFetching('issues');

                fetchIssues(active_member_redmine_id).then(response => {
                    generalStore.deleteFetching('issues');

                    boardStore.clearIssues();
                    boardStore.setIssues(response.issues);
                })
            }
            else {
                alert('Something went wrong:(');
            }
        });
    };

    render() {
        const {assigned_to, generalStore, id, subject, status} = this.props;

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
                        label={'Assign to:'}
                        name={'assign_to_id'}
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