import Actions from './Actions';
import Form from './Form';
import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import classNames from 'classnames';
import ContainerTableItem from './ContainerTableItem';
import '../../../css/components/MyTable.scss';
import consts from '../../constants';
//import schema from '../../../data/schema';
class MyTable extends Component {
      /*  getChildContext() {       
        return {
            view: this.props.view,
             model: this.props.model,
            entity: this.props.entity
            // kategory: this.props.kategory,
               //schema: this.props.schema,
        }
    }
*/
constructor(props) {
super(props);
}
fields=()=>(this.props.schema.map(field=>field.id));


_sort(key,sortable) {
if (sortable){
 const descending = this.props.sort.sortby === key &&
!this.props.sort.descending;
this.props.onSort(key,descending);
}
}

_showItem(id,entity) {
if (entity=='product'){
let fields=this.props.all_schema['katalog'].filter(row=>(row['id']!='id'&&row['id']!='name'));
fields=fields.map(row=>row['id'])
let product=this.props.model['product'].find(row=>row.id===id);
let id_katalog;
if (product) id_katalog=product['katalog'];
let katalogs=this.props.model['katalog'];
let katalog=katalogs.find(row=>row.id==id_katalog);
let query=[];
fields.map((row,rown)=>{
if (katalog&&katalog[row]!=''&&katalog[row]!=null&&katalog[row]!=undefined)
query[rown]=katalog[row]
});
let query2={};
query2['kategory']=query;
query2=JSON.stringify(query2);
this.props.history.push(`/product/${id}?search=${query2}`);
    } else
    this.props.history.push(`/${entity}/${id}`);
}

render() {
if (this.props.view&&this.props.view.length!=0)
 return (
<div className="MyTable">
{this._renderTable()}
</div>
)
else return(<div className="MyTable"><div className="empty">empty</div></div>)
}

tr_actions=({id,count})=>{
if (this.props.entity=='product')
   if (parseInt(count)>0)
     if (this.props.cart)
        if(!this.props.cart.find(row=>row.product==id))
        return    (<td className="MyTableDataCenter"><Actions type={consts.actions.cart_actions.can} onAction={()=>this.props.addCart({product:id,count:1})} /></td>);
        else return    (<td className="MyTableDataCenter"><Actions type={consts.actions.cart_actions.already} onAction={ ()=>this.props.history.push("/cart")}/></td>);
     else return    (<td className="MyTableDataCenter"><Actions type={consts.actions.cart_actions.can} onAction={()=>this.props.addCart({product:id,count:1})} /></td>);
   else return    (<td className="MyTableDataCenter"><Actions type={consts.actions.cart_actions.cant}/></td>);
if (this.props.entity=='cart')
 return (<td className="MyTableDataCenter"><Actions type={consts.actions.cart_actions.delete} onAction={()=>this.props.deleteCart(id)} /></td>);
else 
if (this.props.entity=='user')
return (<td className="MyTableDataCenter"><Actions type={consts.actions.user_actions.reset_password} onAction={()=>this.props.onResetPassword(id)} /></td>);
else return ;
}
_renderTable() {
 let th_actions=null,tr_actions=null;
if (this.props.entity=='product'||this.props.entity=='cart'||this.props.entity=='user') {
    th_actions=(<th className="actions">Actions</th>);   
}

return (
<table>
<thead>
<tr>{
this.props.schema.map((item,n) => {
     
if (!item.show) {
return null;
}
let title = item.label;
if (this.props.sort)
if (this.props.sort.sortby === item.id) {
title += this.props.sort.descending ? '\u2191' : ' \u2193';
}
return this.props.sort?(<th className={'schema-${item.id}'} key={item.id} onClick={this._sort.bind(this, item.id,item.sortable)}>{title}</th>):
(<th className={'schema-${item.id}'} key={n}>{title}</th>);

}, this)
} 
{th_actions}
</tr>
</thead>
<tbody>
{this.props.view.map((row, rown) => {
return (
<tr className={
(this.props.entity=='product'||this.props.entity=='cart'||this.props.entity=='view_order')?
"tr_product":"tr"
} key={row.id} > {
this.props.schema.map((cell, idx) => {
const field_schema = this.props.schema[idx];
if (!field_schema || !field_schema.show) {
return null;
};

let content = row[cell.id];
(this.props.entity=='cart'&&field_schema.id=='count')?
content = (<ContainerTableItem key={idx} className="ContainerTableItem" 
editCart={(params)=>this.props.editCart(params)} onMessage={(params)=>this.props.onMessage(params)} 
count={row['count']} product={row['product']} id_cart={row['id']} 
value={row['count']} max={row['available']} readonly={false} {...field_schema} 
defaultValue={content}/>):
content = (<ContainerTableItem key={idx} className="ContainerTableItem"  readonly={true} 
{...field_schema} defaultValue={content}/>);
let td;
let id;
let entity; 
id=row.id,entity=this.props.entity;
if (this.props.entity=='cart') {
id=row.product;entity='product'}
if (this.props.entity=='view_order'){
if (field_schema['id']=='img'){
id=row.product;entity='product';
}else{
id=row.id,entity='user_order';
}}
if (field_schema['id']=='count'&&this.props.entity=='cart')
td=(<td key={idx}
className="td">
{content}
</td>)
else 
td=(<td key={idx}
onClick={()=>this._showItem(id,entity)}
className="td">
{content}
</td>)
return (
td
);
}, this)}

{this.tr_actions(row)}
</tr>
);
}, this)}
</tbody>
</table>
);
}
}/*
MyTable.childContextTypes = {
  //  model: PropTypes.object.isRequired,
     view: PropTypes.object.isRequired,
            entity: PropTypes.string.isRequired,
}*/
MyTable.propTypes = {
entity: PropTypes.string.isRequired,
view: PropTypes.array.isRequired,
sort   : PropTypes.object,
schema: PropTypes.array.isRequired,
cart: PropTypes.array,
model: PropTypes.object,
all_schema: PropTypes.object,
addCart:  PropTypes.func,
by: PropTypes.func,
deleteCart:PropTypes.func,
editCart: PropTypes.func,
history: PropTypes.object.isRequired,
location: PropTypes.object.isRequired,
onMessage: PropTypes.func,
onResetPassword:PropTypes.func,
onSort: PropTypes.func,
};
export default MyTable

