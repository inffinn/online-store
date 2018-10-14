import ContainerTableItem from './ContainerTableItem';
import  '../../../css/components/Form.scss';
import {PropTypes}
from 'prop-types';
import React, {Component}
from 'react';
class Form extends Component {
    getData() {
        let data = {};
        this.props.fields.forEach(field => {
            if (!field.readonly){
            let result = this.refs[field.id].getValue();   //alert(field.id+'='+result);
     let is_empty=(((result === "") && (field.id !== 'id')) || (result === undefined) || (result === null) );       
            if (field.is_require === true && (is_empty))
            throw new Error('Fill this field please: ' + field.id);
            
            if (field.typeof=='number'&&!is_empty){
            result=parseInt(result);
            if (isNaN(result)) 
            throw new Error(field.id+ ' must be a number!' );
    }
            if (field.typeof=='string'&&!is_empty){
            result=String(result.replace(/<.*>/g,''));
            if (typeof(result)!==field.typeof) 
            throw new Error(field.id+ ' must be a string!' );
    }
            return data[field.id] = result;
        }}
        );
        return data;
    }
    render() {
        return (
                <div className="Form">{this.props.fields.map(field => {

                                    const prefilled = this.props.initialData &&
                                            this.props.initialData[field.id];
                                    return (
                                                <div className="FormRow" key={field.id} hidden={!field.show}>
                                                    <label className="FormLabel"
                                                           htmlFor={field.id}>{field.label}:</label>
                                                    <ContainerTableItem readonly={this.props.readonly} {...field} ref={field.id}
                                                                        defaultValue={prefilled} />
                                                </div>
                                            )
                    }
                
                    )
                    } </div>
                            )
            }
        }
        Form.propTypes = {
         fields: PropTypes.array.isRequired,
         initialData: PropTypes.object.isRequired,
         readonly: PropTypes.bool.isRequired,
         };
        export default Form

   