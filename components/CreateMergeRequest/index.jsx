import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import Button from '../Button';
import Form from '../Form';
import FormInput from '../FormInput';
import FormSelect from '../FormSelect';
import Textarea from '../Textarea';

import {GITLAB_PROJECT_ID, GITLAB_LABELS, GIT_MASTER_BRANCH} from 'Data/consts';
import {createMergeRequest} from 'Data/api/gitlab';

import styles from './create-merge-request.scss';

@inject('generalStore', 'gitlabStore', 'teamStore', 'visualStore')
@observer
class CreateMergeRequest extends Component {

    get usersOptions() {
        const {teamStore} = this.props;
        const options = {};

        teamStore.members.forEach(member => options[member.gitlab_id] = `${member.firstname} ${member.lastname}`);

        return options;
    }

    handleSubmit = async elements => {
        const {generalStore, gitlabStore, popup_id, source_branch, visualStore} = this.props;

        generalStore.setFetching(popup_id);

        const data = {
            id: GITLAB_PROJECT_ID,
            assignee_id: elements.get('assignee_id'),
            description: elements.get('description'),
            source_branch: source_branch,
            target_branch: GIT_MASTER_BRANCH,
            title: elements.get('title'),
            remove_source_branch: true,
            squash: true,
            labels: GITLAB_LABELS.get('frontend'),
        };

        createMergeRequest(data).then(response => {
            generalStore.deleteFetching(popup_id);

            gitlabStore.addMyMergeRequest(response);

            visualStore.deletePopup(popup_id);
        });
    };

    render() {
        const {description, generalStore, popup_id, teamStore: {active_member}, title} = this.props;

        return (
            <div>
                <h3 className={styles.heading}>Create merge request</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormInput 
                        label={'Title:'} 
                        name={'title'}
                        value={title}
                    />
                    <FormSelect
                        label={'Assigned to:'}
                        name={'assignee_id'}
                        options={this.usersOptions}
                        selected={active_member.gitlab_id}
                    />
                    <Textarea label={'Description:'} name={'description'} value={description}/>
                    <Button label={'Create merge request'} busy={generalStore.fetching.has(popup_id)}/>
                </Form>
            </div>
        )
    }
}

export default CreateMergeRequest;