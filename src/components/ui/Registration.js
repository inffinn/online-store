import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import {Registration_Form_Container,Header_Container} from '../Containers';
import Footer from './Footer';

const  registration=({location,history})=>{ 
          return(<div>
    <Header_Container entity='registration' history={history} location={location}/> 
    <div body> 
    <table className='page_table'>    
    <tbody><tr className='tr_body'>
    <td className='td_left'/>
    <td className='td_middle'>
         <div className="Table_PanelDatagrid">
          <Registration_Form_Container history={history} location={location}/>
        </div>   
            </td>
             <td className='td_right'/>
            </tr>
            </tbody>
            </table>
            </div>
            </div>
                )
  }
  export default registration;
      
registration.propTypes = {
location:PropTypes.object.isRequired,
history:PropTypes.object.isRequired
};