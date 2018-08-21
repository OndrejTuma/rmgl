import React, {Component} from 'react';

import Button from '../Button';

import {getLog} from '../../helpers/log';

import styles from './generate-log-button.scss';

class GenerateLogButton extends Component {
    generateLog = () => {
        const logs = getLog(new Date().getDate() - 1);

        return logs.map(log => {
            console.log(log.activity, log.message);
        })
    };

    render() {
        return (
            <div className={styles.wrapper}>
                <Button label={'Generate yesterday\'s log'} onClick={this.generateLog}/>
            </div>
        );
    }
}

export default GenerateLogButton;