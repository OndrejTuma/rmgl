import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import copy from 'copy-to-clipboard';

import {updateMergeRequest} from 'Data/api/gitlab';
import {GITLAB_LABELS} from 'Data/consts';

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

    @storageLog('gitlab', 'Code review')
    mergeRequestClick(merge_request) {
        const {web_url} = merge_request;

        window.open(web_url);
    }

    handleBranchClick = e => {
        e.preventDefault();

        this.mergeRequestClick(this.props.merge_request);
    };
    handleCopyBranch = () => {
        const {merge_request: {source_branch}} = this.props;

        copy(source_branch);
    };
    handlePingBack = () => {
        const {generalStore, gitlabStore, merge_request: {author, iid}} = this.props;

        generalStore.setFetching(iid);

        updateMergeRequest(iid, {
            assignee_id: author.id
        }).then(response => {
            generalStore.deleteFetching(iid);

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
                <a href={web_url} target={'_blank'} onClick={this.handleBranchClick}>
                    {title}
                </a>
                <img
                    className={styles.copyBranch}
                    src={'/static/images/git.png'}
                    alt={'Copy task branch'}
                    title={'Copy task branch'}
                    onClick={this.handleCopyBranch}/>
                {!this.isMyMergeRequest && (
                    <span className={styles.pingTo} title={`Ping back to ${author.name}`} onClick={this.handlePingBack}>
                        <UserCheckSVG width={20} height={20}/>
                    </span>
                )}
                {this.hasSquashAndMerge && (
                    <span title={'Squash and merge'}><GitMergeSVG width={20} height={20}/></span>
                )}
            </div>
        );
    }
}

export default MergeRequest;