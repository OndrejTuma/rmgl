import React, {Component} from 'react';

import Button from '../Button';

import {getLog} from '../../helpers/log';

import styles from './generate-log-button.scss';

class GenerateLogButton extends Component {
    generateLog = () => {
        const logs = getLog(new Date().setDate(new Date().getDate() - 1));

        if (logs.length === 0) {
            alert('Nothing to show');
            return;
        }

        alert(logs.reduce((msg, log) => (
            `${msg}${log.activity} - ${log.message}\n\n`
        ), ''));
    };

    render() {
        return (
            <div className={styles.wrapper}>
                <Button label={'Show yesterday\'s log'} onClick={this.generateLog}/>
            </div>
        );
    }
}

export default GenerateLogButton;