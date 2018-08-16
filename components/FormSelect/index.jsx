import {Component} from 'react';

import styles from './select.scss';

class FormSelect extends Component {
    render() {
        const {label, name, options, selected} = this.props;

        return (
            <div className={styles.wrapper}>
                <label htmlFor={`form-${name}`}>{label}</label>
                <select id={`form-${name}`} name={name} defaultValue={selected}>
                    {Object.entries(options).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </select>
            </div>
        )
    }
}

export default FormSelect;