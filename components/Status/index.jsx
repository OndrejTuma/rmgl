import {Component} from 'react';

import Issue from '../Issue';

import styles from './status.scss';

class Status extends Component {
    render() {
        const {id, issues, name} = this.props;

        return (
            <div className={styles.column}>
                <h2>{name}</h2>

                <ul>
                    {[...issues.values()].filter(issue => issue.status.id === id).map(issue => (
                        <li key={issue.id}>
                            <Issue issue={issue}/>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default Status;