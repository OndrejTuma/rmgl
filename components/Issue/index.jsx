import {Component} from 'react';
import {inject, observer} from 'mobx-react';
import getSlug from 'speakingurl';
import copy from 'copy-to-clipboard';
import {DragSource} from 'react-dnd';

import EditIssue from '../EditIssue';
import CreateMergeRequest from '../CreateMergeRequest';
import Popup from '../Popup';

import {updateIssue} from 'Data/api/redmine';
import {REDMINE_ISSUES_URL} from 'Data/urls';
import {REDMINE_CLOSED_STATUS_ID} from 'Data/consts';
import ItemTypes from 'Data/dnd/item-types';
import {issueSource} from 'Data/dnd/board';

import GarbageSVG from 'Svg/garbage.svg';
import GitMergeSVG from 'Svg/git-merge.svg';

import styles from './issue.scss';


@DragSource(ItemTypes.ISSUE, issueSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
@inject('gitlabStore', 'redmineStore', 'visualStore')
@observer
class Issue extends Component {
    get branchName() {
        const {issue: {id, subject}} = this.props;

        return `feature/${id}-${getSlug(subject)}`;
    }

    get mergeId() {
        const {issue: {id}} = this.props;

        return `merge-${id}`;
    }

    handleDeleteClick = () => {
        if (!confirm('Close issue?')) {
            return;
        }

        const {redmineStore, issue: {id}} = this.props;

        updateIssue(id, {
            issue: {
                status_id: REDMINE_CLOSED_STATUS_ID
            }
        }).then(response => {
            if (!response.ok) {
                console.log(response);
                alert('Something went wrong:(');
                return;
            }

            redmineStore.deleteIssue(id);
        });
    };

    handleGitClick = () => {
        copy(this.branchName);
    };

    handleGitlabClick = () => {
        const {visualStore} = this.props;

        visualStore.setPopup(this.mergeId);
    };

    handleIdClick = () => {
        copy(this.props.issue.id);
    };

    handleSubjectClick = () => {
        const {issue: {id}, visualStore} = this.props;

        visualStore.setPopup(id);
    };

    render() {
        const {connectDragSource, gitlabStore, issue, issue: {id, subject}, visualStore} = this.props;
        const mergeId = this.mergeId;
        const mergeRequest = gitlabStore.getMyMergeRequestByIssueId(id);

        return connectDragSource(
            <div className={styles.issue}>
                {visualStore.popups.has(mergeId) && (
                    <Popup id={mergeId}>
                        <CreateMergeRequest
                            popup_id={mergeId}
                            title={`#${id}: ${subject}`}
                            source_branch={this.branchName}
                            description={'cc @marek, @vlad.opaets, @andrej.baran'}
                        />
                    </Popup>
                )}
                {visualStore.popups.has(id) && (
                    <Popup id={id}>
                        <EditIssue issue={issue}/>
                    </Popup>
                )}
                <strong onClick={this.handleSubjectClick}>{subject}</strong>
                <small onClick={this.handleIdClick}>({id})</small>
                <div className={styles.actions}>
                    <img
                        className={styles.git}
                        src={'static/images/git.png'}
                        alt={'Copy Git Branch'}
                        title={'Copy Git Branch'}
                        onClick={this.handleGitClick}
                    />
                    <a href={`${REDMINE_ISSUES_URL}${id}`} target={'_blank'}>
                        <img src={'static/images/redmine.png'}
                             alt={'Go to redmine task'}
                             title={'Go to redmine task'}
                             onClick={this.handleGitClick}/>
                    </a>
                    {mergeRequest
                        ? (
                            <a href={mergeRequest.web_url} target={'_blank'} title={'Go to merge request'}>
                                <GitMergeSVG width={20} height={20}/>
                            </a>
                        )
                        : (
                            <img
                                src={'static/images/gitlab.png'}
                                alt={'Create merge request'}
                                title={'Create merge request'}
                                onClick={this.handleGitlabClick}/>
                        )
                    }
                    <GarbageSVG width={20} height={20} onClick={this.handleDeleteClick}/>
                </div>
            </div>
        )
    }
}

export default Issue;