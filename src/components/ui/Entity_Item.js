import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import consts from '../../constants';
import {Page_Container, Header_Container, Table_Container, Katalog_Navigator_Container} from '../Containers';
import Error404 from './Error404';
import Footer from './Footer';
const  Entity_Item = ({match, location, history, current_user}) => {
    const entity = match.params.entity;
    const id = match.params.id;
    let command = match.params.command;
    if (command === undefined)
        command = 'read';
    if ((command == "edit" || command == "delete") && current_user.role != 'admin')
        if (location.pathname !== `/personal_info/${current_user.id}/edit` &&
                location.pathname !== `/change_password/${current_user.id}/edit`)
            return (Error404(`Access Denied`))
    if (!(entity in consts.entity))
        return (Error404(`Cannot find resource at ${location.pathname}`))
    if (!(command in consts.command))
        return (Error404(`Cannot find resource at ${location.pathname}`))
    let page = <Page_Container entity={entity} id={id} type={command} history={history} location={location}/>;
    // if (entity=='cart') page=<Page_Container entity={'product'} id={id} type={command} history={history} location={location}/>;
    return(<div>
  <Header_Container entity={entity} history={history} location={location}/>     
  <div className="body"> 
      <table className='page_table'>
          <tbody>
              <tr><td className="td_left"/><td className="td_middle"> 
          <Katalog_Navigator_Container entity={match.params.entity} history={history} location={location}/>
      </td><td className="td_right"/></tr>
  <tr>
      <td className='td_left'/>
      <td className='td_middle'> 

          {page}
          <Footer/>
      </td>
      <td className='td_right'/> 
  </tr>
  </tbody>
</table>
</div>

</div>
            )
};
export default Entity_Item;

Entity_Item.propTypes = {
match: PropTypes.object.isRequired,
location: PropTypes.object.isRequired,
history   : PropTypes.object.isRequired,
current_user: PropTypes.object.isRequired,
};