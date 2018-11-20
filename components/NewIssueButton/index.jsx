import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import Button from '../Button';
import NewIssue from '../NewIssue';
import Popup from '../Popup';

import {POPUP_NEW_ISSUE} from 'Const/popups';

import styles from './style.scss';

@inject('visualStore')
@observer
class NewIssueButton extends Component {
    handleNewIssueButtonClick = () => {
        const {visualStore} = this.props;

        visualStore.setPopup(POPUP_NEW_ISSUE);
    };

    render() {
        const {visualStore} = this.props;

        return (
            <div className={styles.wrapper}>
                <Button label={'New task'} onClick={this.handleNewIssueButtonClick}/>
                {visualStore.popups.has(POPUP_NEW_ISSUE) && (
                    <Popup id={POPUP_NEW_ISSUE}>
                        <NewIssue id={POPUP_NEW_ISSUE}/>
                    </Popup>
                )}
            </div>
        )
    }
}

export default NewIssueButton;