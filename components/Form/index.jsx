import React, {Component} from 'react';
import classNames from 'classnames';

import styles from './form.scss';

class Form extends Component {
    handleSubmit = e => {
        const {onSubmit} = this.props;

        if (typeof onSubmit !== 'function') {
            return;
        }

        e.preventDefault();

        let elements = new Map();

        for (let elm of e.target.elements) {
            if (!elm.name) {
                continue;
            }

            elements.set(elm.name, elm.value);
        }

        onSubmit(elements);
    };

    render() {
        const {action, className, method, children} = this.props;

        return (
            <form action={action}
                  onSubmit={this.handleSubmit}
                  method={method} className={classNames(styles.form, className)}>
                {children}
            </form>
        );
    }
}

Form.defaultProps = {
    action: '/',
    className: '',
    method: 'POST',
};

export default Form;