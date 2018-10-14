
import React, {Component} from 'react';
import css from '../../../css/components/Registration_Form.scss'
import { v4 } from 'uuid'
import { PropTypes } from 'prop-types'
import fetch from 'isomorphic-fetch'

class Registration_Form  extends Component
{
 
constructor(props) {  
super(props);
}
 

registration=()=>{
let login=this.refs['login'].value;
let password=this.refs['password'].value;
let username=this.refs['username'].value;
let email=this.refs['email'].value;
if (!login) this.props.onMessage({message:'Fill login please',message_type:"error"});
if (!password) this.props.onMessage({message:'Fill password please',message_type:"error"});
if (!username) this.props.onMessage({message:'Fill username please',message_type:"error"});
if (!email) this.props.onMessage({message:'Fill email please',message_type:"error"});
if (login&&password&&username)
this.props.registration({login,password,username,email});
        }
cancel=()=>{this.props.history.push('/product');}  
render(){
return (
<div className='Registration_Form'> 
<table className="Table_Login_Form">
<tr>
<td><label>login</label></td>
<td><input name='login' ref="login" placeholder="login..."/></td>
</tr>
<tr>
<td><label>password</label></td>
<td><input name='password' ref="password"  type='password' placeholder="password..."/></td>
</tr>
<tr>
<td><label>username</label></td>
<td><input name='username' ref="username" placeholder="username..."/></td>
</tr>
<tr>
<td><label>email</label></td>
<td><input name='email' ref="email" placeholder="email..."/></td>
</tr>
<tr><td></td>
<td><div className='button' onClick={this.registration}>registration</div>
<div  className='button' onClick={this.cancel}>cancel</div></td>
</tr>
 </table>
 </div>
)        
}
}

export default Registration_Form ;

Registration_Form.propTypes = {
location:PropTypes.object.isRequired,
history:PropTypes.object.isRequired,
onMessage: PropTypes.func.isRequired,
registration: PropTypes.func.isRequired,
};
