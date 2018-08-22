import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

import MergeRequest from '../MergeRequest';

import SpinnerSVG from 'Svg/spinner.svg';

import {FETCHING} from 'Data/consts';

import styles from './gitlab-board.scss';

@inject('generalStore', 'gitlabStore')
@observer
class GitlabBoard extends Component {
    get is_fetching() {
        return this.props.generalStore.fetching.has(FETCHING.gitlab);
    }

    render() {
        const {gitlabStore} = this.props;

        if (gitlabStore.merge_requests_assigned_to_me.length === 0) {
            return null;
        }

        return (
            <div className={styles.board}>
                {this.is_fetching && (
                    <div className={styles.fetching}>
                        <SpinnerSVG width={50} height={50} className={'spinner'}/>
                    </div>
                )}

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