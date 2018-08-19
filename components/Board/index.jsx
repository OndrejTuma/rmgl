import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import Status from '../Status';

import SpinnerSVG from 'Svg/spinner.svg';

import styles from './board.scss';

@inject('boardStore', 'generalStore')
@observer
class Board extends Component {
    get is_fetching() {
        return this.props.generalStore.fetching.has('issues')
    }

    render() {
        const {boardStore} = this.props;

        //TODO: for some reason, without tapping into items, reaction doesnt trigger on issue update
        const size = this.props.boardStore.issues.size;

        return (
            <div className={styles.board}>
                {this.is_fetching && (
                    <div className={styles.fetching}>
                        <SpinnerSVG width={50} height={50} className={'spinner'}/>
                    </div>
                )}

                <div className={styles.wrapper}>
                    {boardStore.statuses.map(status => (
                        <Status key={status.id} issues={boardStore.getIssuesByStatus(status.id)} {...status}/>
                    ))}
                </div>
            </div>
        )
    }
}

export default Board;