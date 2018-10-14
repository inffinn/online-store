import React, {Component} from 'react';
import {PropTypes} from 'prop-types';

class Option extends Component {
constructor(props) {
super(props);
}
componentDidMount(){}
getValue() {
return this.refs.select.value;
}

option_fill=()=>{
if (this.props.options)
return this.props.options.map(row=>{  
if (row.id== this.props.defaultValue)
return (<option  key={row.id} selected value={row.id} label={row.name}></option>)  
return (<option key={row.id} value={row.id} label={row.name}></option>)     
})}
notfoundvalue=()=>{
if ((this.props.defaultValue===undefined)||(this.props.defaultValue===null)||(this.props.defaultValue===''))
return (<option key={this.props.id} selected value={undefined} label={undefined}></option>)   
}
change=(e)=>{this.state.value=e.target.value;
    }
render() {

return (        
<select className="option" ref="select"> 
 {this.option_fill()}  
 {this.notfoundvalue()}
</select>

);
}
}
Option.propTypes = {
options: PropTypes.array.isRequired,
};
export default Option

Option.propTypes = {
defaultValue:PropTypes.string,
from:PropTypes.string.isRequired,
id:PropTypes.string.isRequired,
options:PropTypes.array.isRequired,
read:PropTypes.bool.isRequired
};
