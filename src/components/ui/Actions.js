import React from 'react';
import {PropTypes} from 'prop-types';
import  '../../../css/components/Actions.scss';
import consts from '../../constants';
const Actions = props =>{
switch (props.type){
case consts.actions.cart_actions.can:
return (<div className="Actions">
<img className={consts.actions.cart_actions.can} 
src='/img/logo/cart.png'
tabIndex="0"
title="Add to cart"
onClick={()=>props.onAction()}/>
</div>) 
case consts.actions.cart_actions.cant:
return (<div className="Actions">
<img className={consts.actions.cart_actions.cant} 
src='/img/logo/unavailable_cart.png'
tabIndex="0"
title="Product is over"
onClick={()=>props.onAction()}/>
</div> )
case consts.actions.cart_actions.already:
return (<div className="Actions">
<img className={consts.actions.cart_actions.already}
src='/img/logo/in_cart.png'
tabIndex="0"
title="already in cart"
onClick={()=>props.onAction()}/>
</div>)
case consts.actions.cart_actions.delete:
return (<div className="Actions">
<img className={consts.actions.cart_actions.delete} 
src='/img/logo/delete_cart.png'
tabIndex="0"
title="Delete from cart"
onClick={()=>props.onAction()}/>
</div>)

case consts.actions.user_actions.reset_password:
return (<div className="Actions">
<img className={consts.actions.user_actions.reset_password}
src='/img/logo/reload3.png'
tabIndex="0"
title="Password reset"
onClick={()=>props.onAction()}/>
</div>)
}
}
Actions.propTypes = {
onAction: PropTypes.func,
};
Actions.defaultProps = {
onAction: () => {},
};
export default Actions


