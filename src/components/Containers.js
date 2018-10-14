import React from 'react';
import MyTable from './ui/MyTable.js';
import Table_Panel from './ui/Table_Panel.js';
import Page from './ui/Page.js';
import {add, edit, remove, sort, search, login, logout, registration, by} from '../Actions.js';
import { connect } from 'react-redux';
import SCHEMA from '../../data/schema'
import Katalog_Menu from './ui/Katalog_Menu';
import Cart_Total from './ui/Cart_Total';
const queryString = require('query-string');
import Katalog_Navigator from './ui/Katalog_Navigator';
import Login_Form from './ui/Login_Form';
import Registration_Form from './ui/Registration_Form';
import Message_List from './ui/Message_List';
import Entity_Item from './ui/Entity_Item';
import Entity_List from './ui/Entity_List';
import Head from './ui/Head';
import Order from './ui/Order';
import Search_Panel from './ui/Search_Panel';
import Global_Search from './ui/Global_Search';
import Option from './ui/Option';
import consts from '../constants';
import selectors from './Selector';
import Function from './Function';


const TableStateToProps = (state, props) => {
    let search = queryString.parse(props.location.search);
    try {
        search = JSON.parse(search['search'])
    } catch (e) {};
    const entity = props.entity;
    switch (entity) {
        case 'cart':
        {
            if (state['store']['cart'])
                if (state['store']['cart'].length == 0)
                return {
                entity: entity,
                view: [],
                schema: SCHEMA[entity],
                model: state['store'],
                all_schema: SCHEMA,
                current_user,
                cart_total: {}
            };
            
            let view = selectors.view_selector[entity]({
                   entity,
                    model: state['store'][entity],
                    state: state['store'],
                    schema: SCHEMA
            });

            let cart_total = selectors.cart_total_selector({
                cart: view,
            });
          
            let current_user;
            if (state['current_user'])
                if (state['current_user']['id'])
                    current_user = state['current_user']['id'];

            return {
                entity: entity,
                view: view,
                schema: SCHEMA[entity],
                model: state['store'],
                all_schema: SCHEMA,
                current_user,
                cart_total: cart_total
            };
        }
        case 'product':
            {

            const search_product_kategory = selectors.search_product_kategory_selector({
                    state: state['store'],
                    search: search['kategory'],
                    schema: SCHEMA[entity]
                });


                const view = selectors.view_selector[entity]({
                    entity,
                    model: search_product_kategory,
                    state: state['store'],
                    schema: SCHEMA
                });

                let search2 = {};
                Object.keys(search).map(key => {
                    if (key != 'kategory')
                        search2[key] = search[key]
                })
                const search_view = selectors.search_selector[entity]({
                    entity,
                    state: view,
                    search: search2,
                    schema: SCHEMA[entity]
                });

                const sort_view = selectors.sort_selector[entity]({
                    state: search_view,
                    sort: state['sort'][entity],
                    schema: SCHEMA[entity]
                });

                    
                return {
                    entity: entity,
                    view: sort_view.view,
                    sort: sort_view.sort,
                    schema: SCHEMA['product'],
                    cart: state['store']['cart'],
                    model: state['store'],
                    all_schema: SCHEMA
                }
            };
        default:
        {

            const view = selectors.view_selector[entity]({
                entity,
                model: state['store'][entity],
                state: state['store'],
                schema: SCHEMA
            });

            const search_view = selectors.search_selector[entity]({
                entity,
                search,
                state: view,
                schema: SCHEMA[entity]
            });
            const sort_view = selectors.sort_selector[entity]({
                state: search_view,
                sort: state['sort'][entity],
                schema: SCHEMA[entity]
            });

            return {
                entity: entity,
                view: sort_view.view,
                sort: sort_view.sort,
                schema: SCHEMA[entity]
            };
        }
    }
}


const TableDispatchToProps = (dispatch, props) =>
{
    const entity = props.entity;
    return    ({
        onSort: (key, descending) => dispatch(sort[entity](key, descending)),
        addCart: (params) => dispatch(add['cart'](params)),
        editCart: (params) => dispatch(edit['cart'](params)),
        deleteCart: (params) => dispatch(remove['cart'](params)),
        onResetPassword: (id) => dispatch(edit.reset_password(id)),
        onMessage: (message) => dispatch(add.message(message)),
        by: (params) => dispatch(by.order(params))

    })
}

export const Table_Container = connect(TableStateToProps, TableDispatchToProps)(MyTable);
export const Table_Panel_Container = connect((state, props) => {
    const entity = props.entity;
    const isAdmin = state['current_user']['role'] == 'admin' ? true : false;
    return {
        entity,
        search: state['search'].text, isAdmin
    }
}, (dispatch, props) => {
    return {onSearch: (text) => dispatch(search(text))}
})(Table_Panel);



const Page_stateToProps = (state, props) => {
    const current_user = state['current_user'];
    const entity = props.entity;
    const id = props.id;

    let data = [];
    if (props.type != 'add') {
        if (entity == 'personal_info' || entity == 'change_password')
            data = state['store']['user'];
        else
            data = state['store'][entity];
        const model = data.find((row) => row.id == id);
        let cart_button = consts.actions.cart_actions.cant;
        let find_product_in_cart;
        if (entity == 'product') {
            if (model) {
                find_product_in_cart = state['store']['cart'].find(row => model['id'] == row['product'])
                if (find_product_in_cart)
                    cart_button = consts.actions.cart_actions.already;
                if (!find_product_in_cart && model['count'] <= 0)
                    cart_button = consts.actions.cart_actions.cant;
                if (!find_product_in_cart && model['count'] > 0)
                    cart_button = consts.actions.cart_actions.can;
            }
        }
        let view = Function.viewfunc({entity: entity, model: [model], state: state['store'], schema: SCHEMA})
        view = view[0];
        return {schema: SCHEMA[entity], view, model, type: props.type, current_user: current_user, cart_button};
    } else
        return {schema: SCHEMA[entity], view: {}, model: {}, type: props.type, current_user: current_user};
}
const Page_dispatchToProps = (dispatch, props) => {
    const entity = props.entity;
    return({
        onAdd: (params) => dispatch(add[entity](params, () => props.history.goBack())),
        onEdit: (params) => dispatch(edit[entity](params, () => props.history.goBack())),
        onRemove: (params) => dispatch(remove[entity](params, props.history.push(`/${entity}`))),
        addCart: (params) => dispatch(add['cart'](params)),
        onMessage: (message) => dispatch(add.message(message))
    })
}

export const Page_Container = connect(Page_stateToProps, Page_dispatchToProps)(Page);


export const Katalog_menu_container = connect(state=> ({state:state['store']}))(Katalog_Menu);

export const Katalog_Navigator_Container = connect((state) => ({kategory:state['store']['kategory']}))(Katalog_Navigator)

export const Cart_Total_Container = connect(TableStateToProps, TableDispatchToProps)(Cart_Total);

const dispatchToProps_login_form = (dispatch, props) => ({
        login: (params) => dispatch(login(params)),
        logout: () => dispatch(logout()),
        onMessage: (message) => dispatch(add.message(message))
    })
const dispatchToProps_registration_Form = (dispatch, props) => ({
        registration: (params) => dispatch(registration(params)),
        onMessage: (message) => dispatch(add.message(message))
    })
    
export const Login_Form_Container = connect(state=>({current_user:state['current_user']}), dispatchToProps_login_form)(Login_Form);
export const Registration_Form_Container = connect(()=>{}, dispatchToProps_registration_Form)(Registration_Form);
export const Message_List_Container = connect(state => ({messages: state.store.message}), dispatch => ({removeMessage: (id) => dispatch(remove.message(id))}))(Message_List);

export const Entity_List_Container = connect(
        (state, props) => ({
        current_user: state['current_user'],
        match: props.match,
        location: props.location,
        history: props.history
    }),
        dispatch => ({
                onMessage: (message) => dispatch(add.message(message))
            }))(Entity_List);

export const Entity_Item_Container = connect(
        (state, props) => ({
        current_user: state['current_user'],
        match: props.match,
        location: props.location,
        history: props.history
    }),
        dispatch => ({
                onMessage: (message) => dispatch(add.message(message))
            }))(Entity_Item);

export const Header_Container = connect((state, props) => ({
        entity: props.entity,
        isAdmin: state['current_user']['role'] == 'admin',
        location: props.location,
        history: props.history
    }))(Head)



const Order_StateToProps = (state, props) => {

    let view = selectors.order_view_selector({
        products: state['store']['product'],
        order: state['store']['order'],
        user_order: state['store']['user_order'],
        schema: SCHEMA['order_display']
    });

    let search_query = queryString.parse(props.location.search);
    try {
        search_query = JSON.parse(search_query['search'])
    } catch (e) {
    }
    ;
    let date = search_query['date'];
    let search = search_query['search'];
    view = selectors.order_search_selector({
        view,
        what: search,
        date,
        schema1: SCHEMA['order_display'],
        schema2: SCHEMA['user_order_display']
    });

    return {
        current_user: state['current_user'],
        view,
        entity: 'view_order',
        model: state['store'],
        all_schema: SCHEMA,
        match: props.match,
        location: props.location,
        history: props.history,
    }
}

const Order_dispatchToProps = () => ({
        onMessage: () => dispatch(add.message(params)),
        onEdit(params) {
            dispatch(edit[entity](params));
            props.history.push(`/${entity}`)
        },
        onRemove(params) {
            dispatch(remove[entity](params));
            props.history.push(`/${entity}`)
        }
    })
export const Order_Container = connect(Order_StateToProps, Order_dispatchToProps)(Order);

const Search_Panel_StateToProps = (state, props) => {
    let minmax = null;
    if (props.entity == 'product')
        minmax = selectors.find_minmax_selector({
            state: state['store']['product'],
        });

    return ({
        entity: props.entity,
        firm: state['store']['firm'],
        location: props.location,
        history: props.history,
        price: minmax
    })
}
const matches = ({katalog_view, katalog_model, search, schema}) => {
    let matches = [];
    let fields = schema.filter(item => item['id'].toString().indexOf('kategory') > -1);
    fields = fields.map(row => row['id']);
    let what = search;
    if (what !== '' && what)
        katalog_view.map((row, rown) => {
            for (let f = 0; f < fields.length; f++)
                if (row[fields[f]])
                    if (row[fields[f]].toString().toLowerCase().indexOf(what.toString().toLowerCase()) > -1)
                        if (f != 0)
                        {
                            let model = [];
                            for (let i = 0; i <= f; i++)
                                model[i] = katalog_model[rown][fields[i]];
                            matches.push({id: row['id'], display: row[fields[f - 1]] + '=>' + row[fields[f]], model});
                        } else {
                            let model = [katalog_model[rown][fields[0]]];
                            matches.push({id: row['id'], display: row[fields[f]], model});
                        }
        })
    let matches2 = {};
    matches.map((a) => matches2[a['display']] = {
            id: a['id'],
            model: a['model']
        });
    matches = [];
    matches = Object.keys(matches2).map(display => ({
            id: matches2[display]['id'],
            display: display,
            model: matches2[display]['model']
        }));
    return matches;

}
export const Search_Panel_Container = connect(Search_Panel_StateToProps)(Search_Panel);

const Global_Search_StateToProps = (state, props) => {
    let search = {};
    search['search'] = state['search'].text;
    if ((search['search'] == '') || (search['search'] == null) || (search['search'] == undefined))
    return {product: [],
        kategory: [],
        model: state['store'],
        all_schema: SCHEMA
        }
    
    const product_view = selectors.view_selector['product']({
        entity: 'product',
        model: state['store']['product'],
        state: state['store'],
        schema: SCHEMA
    });


    const product_search = selectors.search_selector['product']({
        entity: 'product',
        state: product_view,
        search,
        schema: SCHEMA['product']
    });

    const katalog_view = selectors.view_selector['katalog']({
        entity: 'katalog',
        model: state['store']['katalog'],
        state: state['store'],
        schema: SCHEMA
    });

    const kategory_search = matches({
        katalog_view,
        katalog_model: state['store']['katalog'],
        search: search['search'],
        schema: SCHEMA['katalog']});
    
    product_search.splice(10);
    kategory_search.splice(10);
    
    return {
        product: product_search,
        kategory: kategory_search,
        model: state['store'],
        all_schema: SCHEMA
    }
}
export const Global_Search_Container = connect(
        Global_Search_StateToProps,
        dispatch => ({
                onSearch: (text) => dispatch(search(text))})
)(Global_Search);

export const Option_Container=connect((state,props)=>({options:state['store'][props.from]}),null,null,{ withRef: true })(Option);