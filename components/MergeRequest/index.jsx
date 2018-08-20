import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import copy from 'copy-to-clipboard';

import {updateMergeRequest} from 'Data/api/gitlab';

import styles from './merge-request.scss';

@inject('generalStore', 'gitlabStore')
@observer
class MergeRequest extends Component {
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
                <a href={web_url} target={'_blank'}>
                    {title}
                </a>
                <img className={styles.copyBranch} src={'/static/images/git.png'} alt={'Copy task branch'} onClick={this.handleCopyBranch}/>
                <span className={styles.pingTo} onClick={this.handlePingBack}>Ping back to {author.name}</span>
            </div>
        );
    }
}

export default MergeRequest;