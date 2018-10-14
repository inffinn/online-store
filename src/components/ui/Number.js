import Actions from './Actions';
import Dialog from './Dialog';
import Form from './Form';
import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import classNames from 'classnames';
import ContainerTableItem from './ContainerTableItem';
import '../../../css/components/MyTable.scss';
//import schema from '../../../data/schema';
class Number extends Component {
    constructor(props) {
        super(props)

    }
    change(e)
    {
        e.target.value=parseInt(e.target.value);
        if (e.target.value=="")e.target.value=1;
        if (parseInt(e.target.value) > parseInt(this.props.max)) {
            this.props.onMessage({message: 'value will be not  more avalible product count!', message_type: "error"});
            e.target.value = this.props.max;
        }
        if (parseInt(e.target.value) <= 0) {
            this.props.onMessage({message: 'value mast be higher zero!', message_type: 'error'});
            e.target.value = 1;
        }
        this.props.editCart({id: this.props.id_cart, product: this.props.product, count: parseInt(e.target.value)});
    }
    render() {

        const params = {
            id: this.props.id,
            ref: "input",          
        };
        return <input onChange={(e) => this.change(e)}  type='number' value={this.props.count} step={1} min={1} max={999} {...params}/>
    }
}
export default Number;

Number.propTypes = {
count:PropTypes.number.isRequired,
editCart:PropTypes.func.isRequired,
id_cart:PropTypes.string.isRequired,
max:PropTypes.number.isRequired,
min:PropTypes.number.isRequired,
onMessage:PropTypes.func.isRequired,
product:PropTypes.string.isRequired,
step:PropTypes.number.isRequired,
};

