import {Component} from 'react';
import {inject, observer} from 'mobx-react';

import Button from '../Button';
import NewIssue from '../NewIssue';
import Popup from '../Popup';

@inject('visualStore')
@observer
class NewIssueButton extends Component {
    identifier = 'new-task';

    handleNewIssueButtonClick = () => {
        const {visualStore} = this.props;

        visualStore.setPopup(this.identifier);
    };

    render() {
        const {visualStore} = this.props;

        return (
            <div>
                <Button label={'New task'} onClick={this.handleNewIssueButtonClick}/>
                {visualStore.popups.has(this.identifier) && (
                    <Popup id={this.identifier}>
                        <NewIssue identifier={this.identifier}/>
                    </Popup>
                )}
            </div>
        )
    }
}

export default NewIssueButton;