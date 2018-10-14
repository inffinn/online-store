import Actions from './Actions';
import Dialog from './Dialog';
import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import classNames from 'classnames';
import MyTable from './MyTable';
import Footer from './Footer';
import {Table_container, Header_Container, Katalog_Navigator_Container, Search_Panel_Container} from '../Containers';
import '../../../css/components/MyTable.scss';
import '../../../css/components/Order.scss';
import schema from '../../../data/schema';

const _showItem = (id, entity, history) => {
    if (entity == 'product') {
        let fields = this.props.all_schema['katalog'].filter(row => {
            if (row['id'] != 'id' && row['id'] != 'name')
                return row['id']
        });
        fields = fields.map(row => row['id'])
        let product = this.props.model['product'].find(row => row.id === id);
        let id_katalog;
        if (product)
            id_katalog = product['katalog'];
        let katalogs = this.props.model['katalog'];
        let katalog = katalogs.find(row => row.id == id_katalog);
        let query = [];
        fields.map((row, rown) => {
            if (katalog[row] != '' && katalog[row] != null && katalog[row] != undefined)
                query[rown] = katalog[row]
        });
        let query2 = {};
        query2['kategory'] = query;
        query2 = JSON.stringify(query2);
        history.push(`/product/${id}?search=${query2}`);
    } else
        history.push(`/${entity}/${id}`);
}

const Order = ({entity, location, history, view, model, onMessage, all_schema}) => {
    let result = [];
    if (view) {
        if (view.length !== 0) {
            result = view.map((row, rown) => {
                let order_fields = all_schema['order_display'].map(shema_row => {
                    if (shema_row['show'])
                    return <div key={shema_row.id}>{`${shema_row['label']}:${row[shema_row['id']]}`}</div>
                })
                let order = <div className="order" key={row.id} onClick={() => _showItem(row['id'], 'order', history)}>{order_fields}</div>
                let user_order = null;
                if (row.user_order)
                    user_order = (<div key={"user_order" + row.id} className="user_order">
                        <MyTable entity={entity}
                                 view={row.user_order}
                                 schema={all_schema['user_order_display']}
                                 model={model}
                                 all_schema={all_schema}
                                 location={location}
                                 history={history}
                                 />
                    </div>)
                return <div className="orderContainer" key={"orderContainer"+row.id}>{order}{user_order}</div>
            })
        } else
            result = (<div className="empty">empty</div>);
    } else
        result = (<div className="empty">empty</div>);
    return(<div>
      <Header_Container entity={entity} history={history} location={location}/>          
      <div className="body"> 
          <table className='page_table'> 
              <tbody>
                  <tr><td className="td_left"/><td className="td_middle"> 
              <Katalog_Navigator_Container entity='view_order' history={history} location={location}/>
          </td><td className="td_right"/></tr>
      <tr>
          <td className='td_left'>
      <Search_Panel_Container  entity={entity} history={history} location={location}/>
      </td>
      <td className='td_middle'> 
  
          <div className="Table_PanelDatagrid">
              {result}
          </div>   
  
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
export default Order;

 Order.propTypes = {
entity:PropTypes.string.isRequired,
location:PropTypes.object.isRequired,
history:PropTypes.object.isRequired,
view:PropTypes.array.isRequired,
model:PropTypes.object.isRequired,
onMessage:PropTypes.func.isRequired,
all_schema:PropTypes.object.isRequired
};