import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

import MergeRequest from '../MergeRequest';

import styles from './gitlab.scss';

@inject('gitlabStore')
@observer
class GitlabBoard extends Component {
    render() {
        const {gitlabStore} = this.props;

        if (gitlabStore.merge_requests_assigned_to_me.length === 0) {
            return null;
        }

        return (
            <div className={styles.board}>
                <ul>
                    {gitlabStore.merge_requests_assigned_to_me.map(merge_request => (
                        <li key={merge_request.id}>
                            <MergeRequest merge_request={merge_request}/>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default GitlabBoard;