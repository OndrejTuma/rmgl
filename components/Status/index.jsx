import {Component} from 'react';
import {DropTarget} from 'react-dnd';
import classNames from 'classnames';

import Issue from '../Issue';

import ItemTypes from 'Data/dnd/item-types';
import {issueTarget} from 'Data/dnd/board';

import styles from './status.scss';

@DropTarget(
    ItemTypes.ISSUE,
    issueTarget,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    }),
)
class Status extends Component {
    render() {
        const {connectDropTarget, isOver, issues, name} = this.props;

        return connectDropTarget(
            <div className={classNames(styles.column, {
                [styles.dropOver]: isOver
            })}>
                <h2>{name}</h2>

                <ul className={styles.list}>
                    {issues.map(issue => (
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