import Dialog from './Dialog';
import Form from './Form';
import {PropTypes}
from 'prop-types';
import React, {Component} from 'react';
import consts from '../../constants';
//import '../../../css/components/Page.css';
class Page extends Component {
    constructor(props) {
        super(props)
        //alert(JSON.stringify(props.view))
    }

    render() {
        return (<div className="Page"> {this.Case()}</div>)
    }
    Case = () => {
        if ((this.props.view === undefined) && (this.props.type !== 'add'))
            return 'Error. Nothing to view'
        switch (this.props.type) {
            case 'delete':
                return    this._renderDeleteDialog();
            case 'read':
                return    this._renderReadDialog();
            case 'edit':
                return   this._renderEditDialog();
            case 'add':
                return   this._renderAddDialog();
            default:
                return 'Nothing found'
                //  _renderDeleteDialog(this.props.readonly)
        }
    }

    _renderDeleteDialog() {
        const actions = [
            (<div className="Button" key="1" onClick={ () => this._deleteConfirmationClick()}>delete</div>),
            (<div className="Button" key="2" onClick={ () => this._closeDialog()}>back</div>)
        ];
        const nameguess = this.props.view['name'] ? 'name: ' + this.props.view['name'] : 'id: ' + this.props.view['id'];
        return (
                <div>  
                    <Dialog
                        modal={false}
                        header="Confirm deletion"
                        actions={actions}                       
                        >
                        {`Are you sure you want to delete ${nameguess}?`}
                    </Dialog>
                </div>
                );
    }
    _renderReadDialog() {
//  (<img className="img_add_cart" src="/img/logo/cart.png" tabindex="0" title="Add to cart" onClick={() => this.props.addCart()}/>)
        let actions = [];
        let cart_button;
        if (this.props.entity == 'product') {
            if (this.props.cart_button == consts.actions.cart_actions.already)
               cart_button=(<div className="Button" key="" onClick={() => this.props.history.push(`/cart`)}>already in cart</div>)
            if (this.props.cart_button == consts.actions.cart_actions.can)
                cart_button=(<div className="Button" key="" onClick={() => this.props.addCart({product: this.props.id, count: 1})}>add to cart</div>);
            }
            if (this.props.current_user.role == 'admin'){
                actions = [
                    (<div className="Button" key="1" onClick={() => this.props.history.push(`${this.props.location.pathname}/edit`)}>edit</div>),
                    (<div className="Button" key="2" onClick={() => this.props.history.push(`${this.props.location.pathname}/delete`)}>delete</div>),
                    (<div className="Button" key="3" onClick={() => this._closeDialog()}>back</div>),
                ];
            if (cart_button)
               actions.splice(2, 0, cart_button);
            }else{
                actions = [
                    (<div className="Button" key="4" onClick={() => this._closeDialog()}>back</div>)
                ];
              if (cart_button)
               actions.push(cart_button);
                }
                return (
                        <div>
                            <Dialog 
                                modal={false}
                                header={'Item info'}
                                actions={actions}           
                                >
                                <Form
                                    ref="form"
                                    readonly={true}
                                    fields={this.props.schema}
                                    initialData={this.props.view} />
                            </Dialog>
                        </div>
                        );
            }
            _renderEditDialog() {
                let actions = [];
                if (this.props.entity == 'personal_info')
                    actions = [
                        (<div className="Button" key="1" onClick={ () => this.props.history.push(`/change_password/${this.props.current_user.id}/edit`)}>change password</div>),
                        (<div className="Button" key="2" onClick={() => this._saveEditDialog()}>save</div>),
                        (<div className="Button" key="3" onClick={() => this._closeDialog()}>back</div>),
                    ];
                else
                    actions = [
                        (<div className="Button" key="1" onClick={() => this._saveEditDialog()}>save</div>),
                        (<div className="Button" key="2" onClick={() => this._closeDialog()}>back</div>),
                    ];

                return (
                        <div>
                            <Dialog 
                                modal={false}
                                header={'Edit item'}
                                actions={actions}        
                                >
                                <Form
                                    ref="form"
                                    readonly={false}
                                    fields={this.props.schema}
                                    initialData={this.props.model}/>
                            </Dialog>
                        </div>
                        );
            }
            _renderAddDialog() {
                let actions = [];
                actions = [
                    (<div className="Button" key="1" onClick={ () => this._saveAddDialog()}>save</div>),
                    (<div className="Button" key="2" onClick={() => this._closeDialog()}>back</div>),
                ];
                return (
                        <div>
                            <Dialog 
                                modal={false}
                                header={'Edit item'}
                                actions={actions}        
                                >
                                <Form
                                    ref="form"
                                    readonly={false}
                                    fields={this.props.schema}
                                    initialData={this.props.view}/>
                            </Dialog>
                        </div>
                        );
            }
            _closeDialog() {
                this.props.history.goBack();
            }
            _deleteConfirmationClick(action) {
                this.props.onRemove(this.props.view['id']);
            }
            _saveEditDialog(action) {
                try {
                    this.props.onEdit(this.refs.form.getData())
                } catch (error) {

                    this.props.onMessage({message: error.message, message_type: "error"})
                }

            }
            _saveAddDialog(action) {
                try {
                    this.props.onAdd(this.refs.form.getData())
                } catch (error) {
                    this.props.onMessage({message: error.message, message_type: "error"})
                }
            }
        }

        export default Page;

Page.propTypes = {
addCart:PropTypes.func.isRequired,
cart_button:PropTypes.string,
current_user:PropTypes.object.isRequired,
entity:PropTypes.string.isRequired,
history:PropTypes.object.isRequired,
id:PropTypes.string.isRequired,
location:PropTypes.object.isRequired,
model:PropTypes.object.isRequired,
onAdd:PropTypes.func.isRequired,
onEdit:PropTypes.func.isRequired,
onMessage:PropTypes.func.isRequired,
onRemove:PropTypes.func.isRequired,
schema:PropTypes.array.isRequired,
type:PropTypes.string.isRequired,
view:PropTypes.object.isRequired,
};
