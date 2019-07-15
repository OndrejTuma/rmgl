import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import Button from '../Button';
import Form from '../Form';
import FormSelect from '../FormSelect';
import Textarea from '../Textarea';

import {updateIssue} from 'Data/api/redmine';
import {KASIA_REDMINE_ID, REDMINE_STATUS_ID_SOLVED} from 'Data/consts';

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
        const {redmineStore, generalStore, issue, id, visualStore} = this.props;

        generalStore.setFetching(id);

        const changed_issue_props = {
            assigned_to_id: parseInt(elements.get('assigned_to_id')),
            status_id: REDMINE_STATUS_ID_SOLVED,
            notes: elements.get('notes'),
            done_ratio: 100,
        };

        updateIssue(issue.id, {issue: changed_issue_props}).then(response => {
            generalStore.deleteFetching(id);

            if (!response.ok) {
                console.log(response);
                alert('Something went wrong:(');
                return;
            }

            redmineStore.deleteIssue(issue.id);

            visualStore.deletePopup(id);
        });
    };

    render() {
        const {issue: {subject}, generalStore, id} = this.props;

        return (
            <div>
                <h3 className={styles.heading}><span>Solving</span> {subject}</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormSelect
                        label={'Assigned to:'}
                        name={'assigned_to_id'}
                        options={this.usersOptions}
                        selected={KASIA_REDMINE_ID}
                    />
                    <Textarea label={'Comment:'} name={'notes'} value={'lives on production'}/>
                    <p className={styles.buttons}>
                        <Button label={'Save'} busy={generalStore.fetching.has(id)}/>
                    </p>
                </Form>
            </div>
        )
    }
}

export default SolveIssue;