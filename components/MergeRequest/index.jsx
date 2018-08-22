import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import copy from 'copy-to-clipboard';

import {mergeMergeRequest, updateMergeRequest} from 'Data/api/gitlab';
import {ERR_BACKEND} from 'Data/api/errors';
import {ApiError} from 'Data/api/fetch';
import {FETCHING, GITLAB_LABELS} from 'Data/consts';

import {storageLog} from '../../decorators/log';

import UserCheckSVG from 'Svg/user-check.svg';
import GitMergeSVG from 'Svg/git-merge.svg';

import styles from './merge-request.scss';

@inject('generalStore', 'gitlabStore', 'teamStore')
@observer
class MergeRequest extends Component {
    get isMyMergeRequest() {
        const {merge_request: {author: {id}}, teamStore: {active_member}} = this.props;

        return id === active_member.gitlab_id;
    }

    get hasSquashAndMerge() {
        const {merge_request: {labels}} = this.props;

        return labels.indexOf(GITLAB_LABELS.get('squashAndMerge')) >= 0;
    }

    @storageLog('gitlab', 'Merged merge request')
    mergeRequestMerged(merge_request) {
        const {gitlabStore} = this.props;
        const {iid} = merge_request;

        gitlabStore.deleteMergeRequestAssignedToMeByIid(iid);
    }

    @storageLog('gitlab', 'Code review')
    mergeRequestClick(merge_request) {
        const {web_url} = merge_request;

        window.open(web_url);
    }

    handleBranchClick = e => {
        e.preventDefault();

        this.mergeRequestClick(this.props.merge_request);
    };
    handleCopyBranchClick = () => {
        const {merge_request: {source_branch}} = this.props;

        copy(source_branch);
    };
    handleMergeBranchClick = () => {
        if (!confirm('Merge branch?')) {
            return;
        }

        const {generalStore, merge_request} = this.props;
        const {id, iid} = merge_request;

        generalStore.setFetching(FETCHING.gitlab);

        mergeMergeRequest(id, iid)
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    alert('Something went wrong:(');
                    return;
                }

                this.mergeRequestMerged(merge_request);
            })
            .catch(err => {
                if (err instanceof ApiError) {
                    if (err.code === ERR_BACKEND) {
                        alert(`Server responded with HTTP status of ${err.cause}`);
                        return;
                    }
                }

                console.log(err);
            })
            .finally(() => generalStore.deleteFetching(FETCHING.gitlab));
    };
    handlePingBackClick = () => {
        const {generalStore, gitlabStore, merge_request: {author, iid}} = this.props;

        generalStore.setFetching(FETCHING.gitlab);

        updateMergeRequest(iid, {
            assignee_id: author.id
        }).then(response => {
            generalStore.deleteFetching(FETCHING.gitlab);

            if (!response.ok) {
                console.log(response);
                alert('Something went wrong:(');
                return;
            }

            gitlabStore.deleteMergeRequestAssignedToMeByIid(iid);
        });
    };

    render() {
        const {merge_request: {author, title, web_url}} = this.props;

        return (
            <div>
                <small>{author.name}: </small>
                <a href={web_url} target={'_blank'} onClick={this.handleBranchClick}>
                    {title}
                </a>
                <img
                    className={styles.copyBranch}
                    src={'/static/images/git.png'}
                    alt={'Copy task branch'}
                    title={'Copy task branch'}
                    onClick={this.handleCopyBranchClick}/>
                {!this.isMyMergeRequest && (
                    <span className={styles.pingTo} title={`Ping back to ${author.name}`} onClick={this.handlePingBackClick}>
                        <UserCheckSVG width={20} height={20}/>
                    </span>
                )}
                {this.hasSquashAndMerge && (
                    <span className={styles.squashAndMerge} title={'Squash and merge'} onClick={this.handleMergeBranchClick}>
                        <GitMergeSVG width={20} height={20}/>
                    </span>
                )}
            </div>
        );
    }
}

export default MergeRequest;