import {Component} from 'react';
import {inject, observer} from 'mobx-react';
import getSlug from 'speakingurl';
import copy from 'copy-to-clipboard';
import {DragSource} from 'react-dnd';

import CreateMergeRequest from '../CreateMergeRequest';
import EditIssue from '../EditIssue';
import NewIssue from '../NewIssue';
import Popup from '../Popup';
import SolveIssue from '../SolveIssue';

import {updateIssue} from 'Data/api/redmine';
import {REDMINE_ISSUES_URL} from 'Data/urls';
import {REDMINE_STATUS_ID_CLOSED} from 'Data/consts';
import ItemTypes from 'Data/dnd/item-types';
import {issueSource} from 'Data/dnd/board';

import {POPUP_EDIT_ISSUE, POPUP_NEW_ISSUE_FROM_ISSUE, POPUP_MERGE_ISSUE, POPUP_SOLVE_ISSUE} from 'Const/popups';

import DoneAllSVG from 'Svg/done-all.svg';
import GarbageSVG from 'Svg/garbage.svg';
import GitMergeSVG from 'Svg/git-merge.svg';

import styles from './styles.scss';

@DragSource(ItemTypes.ISSUE, issueSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
@inject('gitlabStore', 'redmineStore', 'visualStore')
@observer
class Issue extends Component {
    editId = this.getUniqueId(POPUP_EDIT_ISSUE);
    mergeId = this.getUniqueId(POPUP_MERGE_ISSUE);
    newIssueId = this.getUniqueId(POPUP_NEW_ISSUE_FROM_ISSUE);
    solveId = this.getUniqueId(POPUP_SOLVE_ISSUE);

    get branchName() {
        const {issue: {id, subject}} = this.props;

        return `feature/${id}-${getSlug(subject)}`;
    }

    getUniqueId(string) {
        const {issue: {id}} = this.props;

        return `${string}-${id}`;
    }

    handleDeleteClick = () => {
        if (!confirm('Close issue?')) {
            return;
        }

        const {redmineStore, issue: {id}} = this.props;

        updateIssue(id, {
            issue: {
                status_id: REDMINE_STATUS_ID_CLOSED
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

    handleDoneAllClick = () => {
        const {visualStore} = this.props;

        visualStore.setPopup(this.solveId);
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

    handleNewTaskClick = () => {
        const {visualStore} = this.props;

        visualStore.setPopup(this.newIssueId);
    };

    handleSubjectClick = () => {
        const {visualStore} = this.props;

        visualStore.setPopup(this.editId);
    };

    render() {
        const {connectDragSource, gitlabStore, issue, visualStore} = this.props;
        const {id, done_ratio, subject, parent} = issue;
        const mergeRequest = gitlabStore.getMyMergeRequestByIssueId(id);

        return connectDragSource(
            <div className={styles.issue}>
                {visualStore.popups.has(this.mergeId) && (
                    <Popup id={this.mergeId}>
                        <CreateMergeRequest
                            id={this.mergeId}
                            title={`#${id}: ${subject}`}
                            source_branch={this.branchName}
                            description={'cc @marek, @vlad.opaets'}
                        />
                    </Popup>
                )}
                {visualStore.popups.has(this.newIssueId) && (
                    <Popup id={this.newIssueId}>
                        <NewIssue heading={`Create a subtask of issue ${id}`} id={this.newIssueId} parentId={id}/>
                    </Popup>
                )}
                {visualStore.popups.has(this.solveId) && (
                    <Popup id={this.solveId}>
                        <SolveIssue id={this.solveId} issue={issue}/>
                    </Popup>
                )}
                {visualStore.popups.has(this.editId) && (
                    <Popup id={this.editId}>
                        <EditIssue id={this.editId} issue={issue}/>
                    </Popup>
                )}
                <strong onClick={this.handleSubjectClick}>{subject}</strong>
                <span className={styles.doneRatio} style={{width: `${done_ratio}%`}}></span>
                {parent && (
                    <a href={`${REDMINE_ISSUES_URL}${parent.id}`} target={'_blank'} className={styles.parent}>
                        <small>parent</small>
                    </a>
                )}
                <small onClick={this.handleIdClick} title={'Copy task id'} className={'copy'}>({id})</small>
                <div className={styles.actions}>
                    <img
                        className={'copy'}
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
                    <img
                        src={'static/images/redmine-create.png'}
                        alt={'Create subtask'}
                        title={'Create subtask'}
                        onClick={this.handleNewTaskClick}/>
                    <GarbageSVG width={20} height={20} onClick={this.handleDeleteClick}/>
                    <DoneAllSVG width={20} height={20} onClick={this.handleDoneAllClick}/>
                </div>
            </div>
        )
    }
}

export default Issue;