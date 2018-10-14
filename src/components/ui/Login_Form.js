
import React, {Component} from 'react';
import css from '../../../css/components/Login_Form.scss'
import { v4 } from 'uuid'
import { PropTypes } from 'prop-types'
import fetch from 'isomorphic-fetch'

class Login_Form  extends Component
{
 
constructor(props) {  
super(props);
}

    
parseResponse = response =>{
return response.json();
}

logout=()=>{
this.props.logout();
}

 
login=()=>{
this.props.login({login:this.refs['login'].value,password:this.refs['password'].value});

}

 
registration=()=>{  
this.props.history.push('/registration'); 
 }
 
edit=()=>{this.props.history.push(`/personal_info/${this.props.current_user.id}/edit`)}

render(){
if (this.props.current_user.id){
return (
<div className='Login_Form'> 
<table className="Table_Login_Form">
<tbody>
<tr>
<td><label>Welcome,{this.props.current_user.username}!</label></td>
</tr>
<tr>
<td><div  className='btn' onClick={this.logout}>logout</div>
        <div  className='btn' onClick={()=>this.edit()}>edit</div></td>
</tr>
</tbody>
 </table>
</div>
)  
}else{
return (
<div className='Login_Form'> 
<table className="Table_Login_Form">
<tbody>
<tr>
<td><label>login</label></td>
<td><input name='login' ref="login" placeholder="login..."/></td>
</tr>
<tr>
<td><label>password</label></td>
<td><input name='password' ref="password"  type='password' placeholder="password..."/></td>
</tr>
<tr><td></td>
<td><div className='btn'  onClick={this.registration}> registration </div>
<div  className='btn' onClick={this.login}> login </div></td>
</tr>
</tbody>
 </table>
 </div>
)        
}
}

}




export default Login_Form ;
 
  Login_Form.propTypes = {
current_user:PropTypes.object.isRequired,
history:PropTypes.object.isRequired,
location:PropTypes.object.isRequired,
login:PropTypes.func.isRequired,
logout:PropTypes.func.isRequired,
onMessage:PropTypes.func.isRequired,
};
