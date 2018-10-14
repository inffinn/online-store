  import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import consts from '../../constants'
import {Page_Container,
    Header_Container,
    Table_Container,
Cart_Total_Container,
Katalog_Navigator_Container,
Search_Panel_Container
} from '../Containers'
import Footer from './Footer';
 
 const    Entity_List=({match,location,history})=>{ 
     const entity=match.params.entity;
       let Cart_Total=<div className="Cart_Total"/>
       let Search_Panel=null;
       if (entity=='cart'){
       Cart_Total=<Cart_Total_Container entity={entity} history={history} location={location}/>    
       }else {
        Search_Panel=(<Search_Panel_Container  entity={entity}  history={history} location={location}/>)
       }
    return(<div>
    <Header_Container entity={entity} history={history} location={location}/>
    <div className="body">   
    <table className='page_table'>
    <tbody>
      <tr><td className="td_left"/><td className="td_middle"> 
      <Katalog_Navigator_Container entity={match.params.entity} history={history} location={location}/>
      </td><td className="td_right"/></tr>
    <tr>
    <td className='td_left'>
    {Search_Panel}
    </td>
    <td className='td_middle'>
    
     <div className="Table_PanelDatagrid">
<Table_Container entity={entity} history={history} location={location}/>
</div>   
{Cart_Total}
        
 </td>
 <td className='td_right'/>
 </tr>
 <tr><td className="td_left"/><td className="td_middle"><Footer/></td><td className="td_right"/></tr>
 </tbody>
 </table>
</div>

 </div>
                )
    };
    export default Entity_List;
        
Entity_List.propTypes = {
match: PropTypes.object.isRequired,
location: PropTypes.object.isRequired,
history   : PropTypes.object.isRequired,
};