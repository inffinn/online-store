import { NavLink } from 'react-router-dom'
import React, {Component} from 'react';
const selectedStyle = { color: 'red'}
import '../../../css/components/Menu.scss';


const Menu=()=>{
return (
<nav className="Menu">
<div className= 'Menu_container'>
<div className="container">
<NavLink key="firm" to="/firm" activeStyle={selectedStyle}><div className="back"></div>
firm    
</NavLink>
</div>
<div key="kategory" className="container">
<NavLink to="/kategory" activeStyle={selectedStyle}>
kategory
</NavLink>
</div>
<div key="product" className="container">
<NavLink to="/product" activeStyle={selectedStyle}>
product
</NavLink>
</div>
<div key="katalog" className="container">
<NavLink to="/katalog" activeStyle={selectedStyle}>
katalog
</NavLink>
</div>
<div key="user" className="container">
<NavLink to="/user" activeStyle={selectedStyle}>
users
</NavLink>
</div>
<div key="order" className="container">
<NavLink to="/order" activeStyle={selectedStyle}>
order
</NavLink>
</div>
<div key="user_order" className="container">
<NavLink to="/user_order" activeStyle={selectedStyle}>
user_order
</NavLink>
</div>
</div>
</nav>
)}

export default Menu;
