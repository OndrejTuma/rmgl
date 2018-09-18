import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import Button from '../Button';
import Form from '../Form';
import FormSelect from '../FormSelect';
import Textarea from '../Textarea';

import {updateIssue} from 'Data/api/redmine';
import {REDMINE_STATUS_ID_SOLVED, TOMAS_REDMINE_ID} from 'Data/consts';

import styles from './styles.scss';

@inject('generalStore', 'redmineStore', 'teamStore', 'visualStore')
@observer
class SolveIssue extends Component {

    get usersOptions() {
        const {teamStore} = this.props;
        const options = {};

        teamStore.members.forEach(member => options[member.redmine_id] = `${member.firstname} ${member.lastname}`);

        return options;
    }

    handleSubmit = async elements => {
        const {redmineStore, generalStore, issue, popup_id, visualStore} = this.props;

        generalStore.setFetching(popup_id);

        const changed_issue_props = {
            assigned_to_id: parseInt(elements.get('assigned_to_id')),
            status_id: REDMINE_STATUS_ID_SOLVED,
            notes: elements.get('notes'),
            done_ratio: 100,
        };

        updateIssue(issue.id, {issue: changed_issue_props}).then(response => {
            generalStore.deleteFetching(popup_id);

            if (!response.ok) {
                console.log(response);
                alert('Something went wrong:(');
                return;
            }

            redmineStore.deleteIssue(issue.id);

            visualStore.deletePopup(popup_id);
        });
    };

    render() {
        const {issue: {subject}, generalStore, popup_id} = this.props;

        return (
            <div>
                <h3 className={styles.heading}><span>Solving</span> {subject}</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormSelect
                        label={'Assigned to:'}
                        name={'assigned_to_id'}
                        options={this.usersOptions}
                        selected={TOMAS_REDMINE_ID}
                    />
                    <Textarea label={'Comment:'} name={'notes'} value={'lives on live server'}/>
                    <p className={styles.buttons}>
                        <Button label={'Save'} busy={generalStore.fetching.has(popup_id)}/>
                    </p>
                </Form>
            </div>
        )
    }
}

export default SolveIssue;