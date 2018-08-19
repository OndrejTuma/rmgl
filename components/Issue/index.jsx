import {Component} from 'react';
import {inject, observer} from 'mobx-react';
import getSlug from 'speakingurl';
import copy from 'copy-to-clipboard';
import {DragSource} from 'react-dnd';

import EditIssue from '../EditIssue';
import Popup from '../Popup';

import {updateIssue} from 'Data/api/redmine';
import {REDMINE_ISSUES_URL} from 'Data/urls';
import {REDMINE_CLOSED_STATUS_ID} from 'Data/consts';
import ItemTypes from 'Data/item-types';
import {issueSource} from 'Data/dnd/board';

import GarbageSVG from 'Svg/garbage.svg';

import styles from './issue.scss';


@DragSource(ItemTypes.ISSUE, issueSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
@inject('boardStore','visualStore')
@observer
class Issue extends Component {
    get branchName() {
        const {issue: {id, subject}} = this.props;

        return `feature/${id}-${getSlug(subject)}`;
    }

    handleDeleteClick = () => {
        if (!confirm('Are you sure you want to mark this issue as solved?')) {
            return;
        }
        
        const {boardStore, issue: {id}} = this.props;

        updateIssue(id, {
            issue: {
                status_id: REDMINE_CLOSED_STATUS_ID
            }
        }).then(response => {
            if (!response.ok) {
                alert('Something went wrong:(');
                return;
            }

            boardStore.deleteIssue(id);
        });
    };

    handleGitClick = () => {
        copy(this.branchName);
    };

    handleGitlabClick = () => {

    };

    handleSubjectClick = () => {
        const {issue: {id}, visualStore} = this.props;

        visualStore.setPopup(id);
    };

    render() {
        const {connectDragSource, issue, issue: {id, subject}, visualStore} = this.props;

        return connectDragSource(
            <div className={styles.issue}>
                {visualStore.popups.has(id) && (
                    <Popup id={id}>
                        <EditIssue issue={issue}/>
                    </Popup>
                )}
                <strong onClick={this.handleSubjectClick}>{subject}</strong>
                <div className={styles.actions}>
                    <img src={'static/images/git.png'} alt={'Copy Git Branch'} onClick={this.handleGitClick}/>
                    <a href={`${REDMINE_ISSUES_URL}${id}`} target={'_blank'}>
                        <img src={'static/images/redmine.png'} alt={'Go to redmine task'}
                             onClick={this.handleGitClick}/>
                    </a>
                    <img src={'static/images/gitlab.png'} alt={'Go to redmine task'} onClick={this.handleGitlabClick}/>
                    <GarbageSVG width={20} height={20} onClick={this.handleDeleteClick}/>
                </div>
            </div>
        )
    }
}

export default Issue;