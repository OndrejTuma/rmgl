import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

import styles from './gitlab.scss';

@inject('gitlabStore')
@observer
class GitlabBoard extends Component {
    render() {
        const {gitlabStore} = this.props;

        return (
            <div className={styles.board}>
                <ul>
                    {gitlabStore.merge_requests_assigned_to_me.map(merge_request => (
                        <li key={merge_request.id}>
                            <a href={merge_request.web_url} target={'_blank'}>
                                {merge_request.title} <small>({merge_request.author.name})</small>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default GitlabBoard;