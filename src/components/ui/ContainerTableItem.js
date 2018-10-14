import {PropTypes} from 'prop-types';
import Option from './Option';
import TableItem from './TableItem';
import ImgLoader from './ImgLoader';
//import schema from '../../../data/schema';
import { connect } from 'react-redux';
import Number from "./Number";
import React, {Component} from 'react';
import {Option_Container} from '../Containers';

class ContainerTableItem extends Component {

    render() {
//alert(this.props.defaultValue);
   
        if (this.props.readonly){
            const params = {
            id: this.props.id,
            ref: "input",
            defaultValue: this.props.defaultValue
        };
            switch (this.props.type) {
                 case 'img':
                 {
               return (<div className="imgContainer"><img src={this.props.defaultValue} alt="Фото"/></div>)
                }
                       default:
                {
                    return (<TableItem {...params}/>)
                }
        }
    } else {
             const params = {
            id: this.props.id,
            ref: "input",
            defaultValue: this.props.defaultValue
        };
            switch (this.props.type) {
                case 'normal':
                {
                    if (this.props.typeof=='number')
                    return (<input type='number' className="input_text" {...params}/>);
                    else return (<input className="input_text" {...params}/>);
                }
                    case 'password':
                {                    
                    return (<input type='password' className="input_text" {...params}/>);                    
                }
                case 'text':
                {
                    return (<textarea className="text_area" {...params} />);
                }
               
                      case 'img':
                {
                    return (
                           <div className="imgContainer"> <ImgLoader {...params}/> </div> 
                            );
                }
                case 'option':
                {
                    const from = this.props.from_entity;
                 return   <Option_Container from={from} read={false} {...params}/>
                }
                case 'number':
                {
                    return <Number editCart={this.props.editCart} onMessage={this.props.onMessage} count={this.props.count} 
                    product={this.props.product} id_cart={this.props.id_cart} step={1} min={1} max={this.props.max}/>
                }
          default:
                {
                    return ( <input className='input_text'  {...params}   />)
                }
                }
       
    }
    }
getValue() {
 let value='value' in this.refs.input
? this.refs.input.value
: this.refs.input.getWrappedInstance
? this.refs.input.getWrappedInstance().getValue()
:this.refs.input.getValue()
return value;
           
}
}




    ContainerTableItem.propTypes  = {
type: PropTypes.oneOf(['normal', 'option', 'img', 'text','number']),
id: PropTypes.string.isRequired,
defaultValue: PropTypes.any,
typeof:PropTypes.oneOf(['string','number'])
};



/*ContainerTableItem.contextTypes = {
    view: PropTypes.object.isRequired,
  //  model: PropTypes.object.isRequired,
    entity: PropTypes.string.isRequired
}
*/
export default ContainerTableItem



