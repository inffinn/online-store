import { NavLink, Link} from 'react-router-dom'
import React, {TraditionalObjectOrientedView ,Component}
from 'react';
const selectedStyle = {color: 'red'}
import '../../../css/components/katalog_Navigator.scss';
import schema from '../../../data/schema.json';
const queryString = require('query-string');
import {PropTypes} from 'prop-types';

class Katalog_Navigator extends Component 
{
    constructor(props) {
        super(props)
       
    }

    render() {
      //  if (this.props.entity=='product'){
        let search= queryString.parse(this.props.location.search);
        try{search=JSON.parse(search['search'])}
        catch(e){return (<div className='Katalog_Navigator' />)}
        let kategory;
        kategory=search['kategory'];
        let links=null;
        if (kategory)if(Array.isArray(kategory))
 links= kategory.map((key,n)=>{
    let value='';
          let link=[];
          let link2={};
          let linkto='';
          for (let i=0;i<=n;i++)
          link[i]=kategory[i];
         link2['kategory']=link;
         linkto='/product?search='+JSON.stringify(link2);
         value=this.props.kategory.find(row=>row.id==key)['name'];
         return (<div key={key} className="Link_container"><label>&gt;</label><Link to={linkto}>{value}</Link></div>);
          }) 
         let filters=[];
         Object.keys(search).map(key=>{
             if (key!='kategory'){
                 let filter_link=Object.assign({},search); 
                 delete filter_link[key];
                // alert(Object.keys(filter_link).length);
                 if (Object.keys(filter_link).length!=0)
                 filter_link='/'+this.props.entity+'?search='+JSON.stringify(filter_link);
             else 
                 filter_link='/'+this.props.entity;
           let title=typeof(search[key])=='object'?JSON.stringify(search[key]):search[key];
     filters.push(<div key={key} className="filters">
<Link to={filter_link} className='Message' title={title}>{key}</Link>
<Link to={filter_link} className='x'>x</Link>
</div>)
         }});        
     return (
     <div className='Katalog_Navigator'>
     <div className='container'>
     <Link to={`/${this.props.entity}`}>All</Link>
     {links} 
   
     {filters}
     </div>
     </div>)
   // } 
   // else {
   //  return (<div className='Katalog_Navigator'/>)
   // }
}
}
export default Katalog_Navigator

 Katalog_Navigator.propTypes = {
entity:PropTypes.string.isRequired,
history:PropTypes.object.isRequired,
location:PropTypes.object.isRequired,
kategory:PropTypes.array.isRequired,
};
