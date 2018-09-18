import React, {Component} from 'react';

import styles from './styles.scss';

class Textarea extends Component {
    render() {
        const {label, name, value} = this.props;

        return (
            <div className={styles.wrapper}>
                <label htmlFor={`form-${name}`}>{label}</label>
                <textarea name={name} id={`form-${name}`} defaultValue={value}/>
            </div>
        );
    }
}

export default Textarea;