import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import Button from '../Button';
import Form from '../Form';
import FormInput from '../FormInput';
import FormSelect from '../FormSelect';
import Textarea from '../Textarea';

import {REDMINE_STATUS_ID_NEW, REDMINE_PROJECT_ID} from 'Data/consts';
import {createIssue} from 'Data/api/redmine';

import styles from './styles.scss';

@inject('redmineStore', 'generalStore', 'teamStore', 'visualStore')
@observer
class NewIssue extends Component {

    get usersOptions() {
        const {teamStore} = this.props;
        const options = {};

        teamStore.members.forEach(member => options[member.redmine_id] = `${member.firstname} ${member.lastname}`);

        return options;
    }

    handleSubmit = async elements => {
        const {redmineStore, generalStore, identifier, teamStore, visualStore} = this.props;

        generalStore.setFetching(identifier);

        const issue_props = {
            project_id: REDMINE_PROJECT_ID,
            assigned_to_id: parseInt(elements.get('assigned_to_id')),
            status_id: REDMINE_STATUS_ID_NEW,
            description: elements.get('description'),
            subject: elements.get('subject'),
        };

        createIssue({issue: issue_props}).then(response => {
            generalStore.deleteFetching(identifier);

            if (teamStore.active_member.redmine_id === issue_props.assigned_to_id) {
                redmineStore.setIssue(response.issue);
            }

            visualStore.deletePopup(identifier);
        });
    };

    render() {
        const {generalStore, identifier, teamStore: {active_member}} = this.props;

        return (
            <div>
                <h3 className={styles.heading}>New task</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormInput autofocus={true} label={'Subject:'} name={'subject'}/>
                    <FormSelect
                        label={'Assigned to:'}
                        name={'assigned_to_id'}
                        options={this.usersOptions}
                        selected={active_member.redmine_id}
                    />
                    <Textarea label={'Description:'} name={'description'}/>
                    <p className={styles.buttons}>
                        <Button label={'Create issue'} busy={generalStore.fetching.has(identifier)}/>
                    </p>
                </Form>
            </div>
        )
    }
}

export default NewIssue;