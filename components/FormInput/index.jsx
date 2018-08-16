import React, {Component} from 'react';
import classNames from 'classnames';

import styles from './input.scss';

class FormInput extends Component {
    state = {
        focused: false,
        value: '',
    };

    handleBlur = () => {
        this.setState({focused: false});
    };

    handleChange = () => {
        this.setState({value: this.input.value});
    };

    handleFocus = () => {
        this.setState({focused: true});
    };

    render() {
        const {className, errorText, hasError, id, label, name, type} = this.props;
        const {focused, value} = this.state;

        const filled = value.length > 0;

        return (
            <div className={classNames(styles.container, className, {
                [styles.focused]: focused,
                [styles.filled]: filled,
                [styles.hasError]: hasError,
            })}>
                {label && <label className={styles.label} htmlFor={id}>{label}</label>}
                <input id={id} type={type}
                       value={value}
                       name={name}
                       ref={el => this.input = el}
                       onFocus={this.handleFocus}
                       onBlur={this.handleBlur}
                       onChange={this.handleChange}/>
                {errorText && <p className={styles.error}>{errorText}</p>}
            </div>
        );
    }
}

FormInput.defaultProps = {
    hasError: false,
    type: 'text',
};

export default FormInput;