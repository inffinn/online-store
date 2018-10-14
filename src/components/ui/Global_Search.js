import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import '../../../css/components/Global_Search.scss';
const queryString = require('query-string');


class Global_Search extends Component {
constructor(props) {
super(props);
}
show_product({id,entity}){
let id_katalog, product,fields;
if (entity=='product'||entity=='cart'||entity=='user_order'){
fields=this.props.all_schema['katalog'].filter(row=>{if (row['id']!='id'&&row['id']!='name')return row['id']});
fields=fields.map(row=>row['id'])
if (product) {
    product=this.props.model['product'].find(row=>row.id===id);
    id_katalog=product['katalog'];

let katalogs=this.props.model['katalog'];
let katalog=katalogs.find(row=>row.id==id_katalog);
let query=[];
fields.map((row,rown)=>{
if (katalog[row]!=''&&katalog[row]!=null&&katalog[row]!=undefined)
query[rown]=katalog[row]
});
let query2={};
query2['kategory']=query;
query2=JSON.stringify(query2);
this.props.history.push(`/product/${id}?search=${query2}`);
    } else
    this.props.history.push(`/product/${id}`);
}
this.props.onSearch('');
}

show_kategory(model){
let query={};
query['kategory']=model;
query=JSON.stringify(query);
this.props.history.push(`/product?search=${query}`);
this.props.onSearch('');

}




render(){
let product=this.props.product;
let kategory=this.props.kategory;
    let products,kategories=[];
   let find_product=null,find_kategory=null;
  
        if (product) {
   products=product.map((row,n)=>{
       let id=row['id'];
      return (<div className="Global_Search_Item" key={"product"+n}
       onClick={()=>this.show_product({id,entity:'product'})}>{row.name}</div>)});

 if (product.length!=0)
find_product=(<div><div className="Global_Search_Header">products</div>{products}</div>)

}

if (kategory) {
   kategories=kategory.map((row,n)=>{
       let id=row['id'];
       return (<div className="Global_Search_Item" key={"kategory"+n}
       onClick={()=>this.show_kategory(row.model)}>{row.display}</div>)});
 
 if (kategory.length!=0)
         find_kategory=(<div><div className="Global_Search_Header">kategories</div>{kategories}</div>)
}

    return (<div className="Global_Search" >{find_product}{find_kategory}</div>)

}
        }

Global_Search.propTypes = {
history:PropTypes.object.isRequired,
location:PropTypes.object.isRequired,
kategory:PropTypes.array.isRequired,
product:PropTypes.array.isRequired,
model:PropTypes.object.isRequired,
all_schema: PropTypes.object.isRequired,
onSearch:PropTypes.func.isRequired
};

export default Global_Search;
