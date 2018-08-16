import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import styles from './popup.scss';

@inject('visualStore')
@observer
class Popup extends Component {
    handleClose = () => {
        this._close();
    };
    handleKeyUp = e => {
        if (e.keyCode === 27) {     // esc
            this._close();
        }
    };

    _close() {
        const {id, visualStore} = this.props;

        visualStore.deletePopup(id);
    }

    componentDidMount() {
        self.document.addEventListener('keyup', this.handleKeyUp);
    }
    componentWillUnmount() {
        self.document.removeEventListener('keyup', this.handleKeyUp);
    }

    render() {
        const {children} = this.props;

        return (
            <div className={styles.wrapper}>
                <div className={styles.background} onClick={this.handleClose}></div>
                <div className={styles.popup}>
                    <span className={styles.close} onClick={this.handleClose}>&times;</span>
                    {children}
                </div>
            </div>
        )
    }
}

export default Popup;