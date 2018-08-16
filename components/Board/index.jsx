import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import Status from '../Status';

import SpinnerSVG from 'Svg/spinner.svg';

import styles from './board.scss';

@inject('boardStore', 'generalStore')
@observer
class Board extends Component {
    render() {
        const {boardStore, generalStore} = this.props;

        return (
            <div className={styles.board}>
                {generalStore.fetching.has('issues') && <SpinnerSVG width={30} height={30} className={'spinner'}/>}
                <div className={styles.wrapper}>
                    {boardStore.statuses.map(status => (
                        <Status key={status.id} issues={boardStore.issues} {...status}/>
                    ))}
                </div>
            </div>
        )
    }
}

export default Board;