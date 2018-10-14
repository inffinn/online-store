import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import '../../../css/components/Dialog.scss';
class Dialog extends Component {
    componentWillUnmount() {
        document.body.classList.remove('DialogModalOpen');
    }
    componentDidMount() {
        if (this.props.modal) {
            document.body.classList.add('DialogModalOpen');
        }
    }
    render() {
        const actions = this.props.actions
        return (
                <div className={this.props.modal ?
                            'Dialog DialogModal' : 'Dialog'}>
                    <div className={this.props.modal ?
                            'DialogModalWrap' : null}>
                        <div className="DialogHeader"><label>{this.props.header}</label></div>
                        <div className="DialogBody">{this.props.children}</div>
                        <div className="DialogFooter">
                            {actions}
                
                        </div>
                    </div>
                </div>
                );
    }
}
Dialog.propTypes = {
    header: PropTypes.string.isRequired,
    confirmLabel: PropTypes.string,
    modal: PropTypes.bool,
    onAction: PropTypes.func,
    hasCancel: PropTypes.bool,
};
Dialog.defaultProps = {
    confirmLabel: 'ok',
    modal: false,
    onAction: () => {
    },
    hasCancel: true,
};

export default Dialog