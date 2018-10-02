import {Component} from 'react';
import {inject, observer} from 'mobx-react';
import getSlug from 'speakingurl';
import copy from 'copy-to-clipboard';
import {DragSource} from 'react-dnd';

import EditIssue from '../EditIssue';
import SolveIssue from '../SolveIssue';
import CreateMergeRequest from '../CreateMergeRequest';
import Popup from '../Popup';

import {updateIssue} from 'Data/api/redmine';
import {REDMINE_ISSUES_URL} from 'Data/urls';
import {REDMINE_STATUS_ID_CLOSED} from 'Data/consts';
import ItemTypes from 'Data/dnd/item-types';
import {issueSource} from 'Data/dnd/board';

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
    get branchName() {
        const {issue: {id, subject}} = this.props;

        return `feature/${id}-${getSlug(subject)}`;
    }

    get mergeId() {
        return `merge-${this.props.issue.id}`;
    }

    get solveId() {
        return `solve-${this.props.issue.id}`;
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

    handleSubjectClick = () => {
        const {issue: {id}, visualStore} = this.props;

        visualStore.setPopup(id);
    };

    render() {
        const {connectDragSource, gitlabStore, issue, visualStore} = this.props;
        const {id, done_ratio, subject, parent} = issue;
        const mergeId = this.mergeId;
        const solveId = this.solveId;
        const mergeRequest = gitlabStore.getMyMergeRequestByIssueId(id);

        return connectDragSource(
            <div className={styles.issue}>
                {visualStore.popups.has(mergeId) && (
                    <Popup id={mergeId}>
                        <CreateMergeRequest
                            popup_id={mergeId}
                            title={`#${id}: ${subject}`}
                            source_branch={this.branchName}
                            description={'cc @marek, @vlad.opaets'}
                        />
                    </Popup>
                )}
                {visualStore.popups.has(solveId) && (
                    <Popup id={solveId}>
                        <SolveIssue popup_id={solveId} issue={issue}/>
                    </Popup>
                )}
                {visualStore.popups.has(id) && (
                    <Popup id={id}>
                        <EditIssue popup_id={id} issue={issue}/>
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
                    <GarbageSVG width={20} height={20} onClick={this.handleDeleteClick}/>
                    <DoneAllSVG width={20} height={20} onClick={this.handleDoneAllClick}/>
                </div>
            </div>
        )
    }
}

export default Issue;