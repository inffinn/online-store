import { NavLink } from 'react-router-dom'
import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import '../../../css/components/Cart_Total.scss';

class Cart_Total extends Component
{
constructor(props){
    super(props)
}

render(){
   let cart=[];
   if (typeof(window)!='undefined'){
   localStorage.clear();
   localStorage.setItem("cart",JSON.stringify(this.props.view));
}
    let by;   
    if (this.props.cart_total.total){
 this.props.current_user?
by=<button  className="Button" onClick={()=>this.props.by({
    user:this.props.current_user,
    cart:this.props.view,
    nds:this.props.cart_total.nds,
    delivery:this.props.cart_total.delivery,
    })} >by</button>:
by=<button disabled className="disabled_Button" title="you must login to add order!">by</button>;
return (
<div className="Cart_Total">
 <table className="Table_Total">
<tbody>
 <tr> <td>summ ($)</td> <td>{this.props.cart_total.summ}</td>  </tr>   
 <tr> <td>nds (%)</td> <td>{this.props.cart_total.nds}</td>  </tr> 
 <tr> <td>delivery ($)</td> <td>{this.props.cart_total.delivery}</td>  </tr> 
 <tr> <td>total ($)</td> <td>{this.props.cart_total.total}</td>  </tr> 
 </tbody>
        </table>
        <div className='button_container'>      
          <button className="Button" onClick={()=>this.props.history.push('/product')}>back</button>     
      {by}    
          </div>
        </div>
 
)}
else return (<div className="Cart_Total">
 <div className='button_container'>     
  <button className="Button" onClick={()=>this.props.history.push('/product')}>back</button> 
      </div>
          </div>
        )
}
}

export default Cart_Total;
    
Cart_Total.propTypes = {
entity: PropTypes.string.isRequired,
view: PropTypes.array.isRequired,
sort   : PropTypes.object,
schema: PropTypes.array.isRequired,
cart: PropTypes.array,
model: PropTypes.object.isRequired,
all_schema: PropTypes.object.isRequired,
addCart:  PropTypes.func.isRequired,
by: PropTypes.func.isRequired,
deleteCart:PropTypes.func.isRequired,
editCart: PropTypes.func.isRequired,
history: PropTypes.object.isRequired,
location: PropTypes.object.isRequired,
onMessage: PropTypes.func.isRequired,
};