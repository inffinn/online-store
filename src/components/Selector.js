import { createSelector,defaultMemoize,createSelectorCreator } from 'reselect';
import SCHEMA from '../../data/schema';
import consts from '../constants';
import Function from './Function';

const equalfunc=(a,b)=>{
    a=JSON.stringify(a);
    b=JSON.stringify(b);
    let result=a===b;
    return result;
    }
    
const custorm_view_selector=createSelectorCreator(defaultMemoize, equalfunc)
const create_view_selector =()=> custorm_view_selector(
            [({entity}) => entity, ({model}) => model, ({state}) => state, ({schema}) => schema],
            (entity, model, state, schema) =>
        Function.viewfunc({entity, model, state, schema}))
let view_selector = {};
consts.selector_entity.map(entity => view_selector[entity] = create_view_selector());

const custorm_sort_selector=createSelectorCreator(defaultMemoize, equalfunc)
const create_sort_selector =()=> custorm_sort_selector(
                    [({state}) => state, ({sort}) => sort, ({schema}) => schema],
                    (state, sort, schema) => {
                return (Function.sortfunc({state, sort, schema}))
            }
            )
let sort_selector = {};
consts.selector_entity.map(entity => sort_selector[entity] = create_sort_selector());

const custorm_search_selector=createSelectorCreator(defaultMemoize, equalfunc)
const create_search_selector =()=> custorm_search_selector
        (
                [({entity}) => entity, ({state}) => state, ({search}) => search, ({schema}) => schema],
                (entity, state, search, schema) => {
            return (Function.search_func({entity, state, search, schema}))
        }
        );
let search_selector = {};
consts.selector_entity.map(entity => search_selector[entity] = create_search_selector());

 const cart_total_selector = createSelector
        (
                [({cart}) => cart],
                (cart) => {
            return (Function.cart_total_func({cart}))
        }
        );
 const search_product_kategory_selector= createSelector
        (
                [({state}) => state, ({search}) => search],
                (state, search) => {
            return (Function.search_product_kategory_func(state, search))
        }
        );
 const find_minmax_selector =
        createSelector
        (
                [({state}) => state],
                (state) => {
            return (Function.find_minmax_func({state}))
        }
        )
const order_view_selector =
        createSelector
        (
                [({entity}) => entity, ({products}) => products, ({order}) => order, ({user_order}) => user_order, ({schema}) => schema],
                (entity, products, order, user_order, schema) => {
            return (Function.order_view_func({entity, products, order, user_order, schema}))
        }
        )

const order_search_selector =
        createSelector
        (
                [({view}) => view,({what}) => what, ({date}) => date, ({schema1}) => schema1, ({schema2}) => schema2],
                (view, what, date, schema1, schema2) => {
            return (Function.order_search_func({view, what, date, schema1, schema2}))
        }
        )
  
  const   selectors={
        view_selector,
        sort_selector,
        search_selector,
        cart_total_selector,
        search_product_kategory_selector,
        order_view_selector,
        order_search_selector,
        find_minmax_selector
    }
export default selectors;