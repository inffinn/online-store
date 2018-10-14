import '../../../css/components/Header.scss';
import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import {
Login_Form_Container,
        Table_Panel_Container,
        Katalog_Navigator_Container,
        // Message_List_Container,
        //Global_Search_Container
} from '../Containers';
import Menu from '../ui/Menu';

const Head = ({isAdmin, history, location, entity}) => {
    let Admin_menu;
    isAdmin ? Admin_menu = <Menu/> : Admin_menu = null;
    let login = null;
    if (entity != 'registration')
        login = <Login_Form_Container  history={history} location={location}/>
    return (
            <div className="header">
                <div className="head_board">
                    <div className='head_item_container'>
                        <a href="/product"><img className='Logo' src="/img/logo/logo1.png"/></a>
                    </div>
                    <div className='head_item_container'>
                        <div className='advertising'>your advertising</div>
                    </div>
                    <div className='head_item_container'>
                        {login}
                    </div>
                </div>
                <div className="Menu_Panel">
                    {Admin_menu}
                    <Table_Panel_Container entity={entity} history={history} location={location}/>
            
                </div>
            </div>
            )
}

export  default Head;


Head.propTypes = {
isAdmin:PropTypes.bool.isRequired,
history:PropTypes.object.isRequired,
location:PropTypes.object.isRequired,
entity:PropTypes.string.isRequired
};
