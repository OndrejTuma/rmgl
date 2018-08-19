import React, {Component} from 'react';
import classNames from 'classnames';

import SpinnerSVG from 'Svg/spinner.svg';

import styles from './button.scss';

class Button extends Component {
    render() {
        const {label, busy, onClick, type} = this.props;

        return (
            <button type={type} className={styles.button} onClick={onClick}>
                {busy ? <SpinnerSVG width={20} height={20} className={classNames('spinner', styles.spinner)}/> : label}
            </button>
        );
    }
}

Button.defaultProps = {
    label: '',
    busy: false,
    type: 'submit',
};

export default Button;