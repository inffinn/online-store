
import React, {Component} from 'react';
import css from '../../../css/components/Message_List.scss'
import { PropTypes } from 'prop-types'
import fetch from 'isomorphic-fetch'


const Message_List=(props)=>{
 let messages='';
 if (props.messages) 
messages=props.messages.map(row=>{
let message=row.message;
let message_type=row.message_type;
let id=row.id;
let className='Message_Container_'+message_type;
return(

<div className={className} key={id}>
<div className="Message" onClick={()=>props.removeMessage(id)}>{message}</div>
<div className='x' onClick={()=>props.removeMessage(id)}>x</div>
</div>
)})
return (
<div className='Message_List'>

{messages}

</div>
)  

}

export default Message_List ;
    
Message_List.propTypes = {
messages:PropTypes.array,
removeMessage:PropTypes.func.isRequired,
};