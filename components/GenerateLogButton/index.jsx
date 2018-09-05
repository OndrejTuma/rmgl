import React, {Component} from 'react';
import copy from 'copy-to-clipboard';

import Button from '../Button';

import {getLogs} from '../../helpers/log';

import styles from './generate-log-button.scss';

class GenerateLogButton extends Component {
    get isMonday() {
        return new Date().getDay() === 1;
    }

    generateLog = () => {
        const log_date =  this.isMonday
            ? new Date().setDate(new Date().getDate() - 3)
            : new Date().setDate(new Date().getDate() - 1);

        const logs = getLogs(log_date);

        if (logs.length === 0) {
            alert('Nothing to show');
            return;
        }

        const logs_in_string = logs.reduce((msg, log) => (
            `${msg}> ${log.name} ${log.status.length > 0 ? `(${log.status.join(' - ')})` : ''}\n`
        ), '');

        copy(logs_in_string);
        alert(logs_in_string);
    };

    render() {
        return (
            <div className={styles.wrapper}>
                <Button label={`Show ${this.isMonday ? 'friday' : 'yesterday'}'s log`} onClick={this.generateLog}/>
            </div>
        );
    }
}

export default GenerateLogButton;