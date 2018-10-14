import consts from '../constants'

const  Function={
 cart_total_func : ({cart}) =>
{//alert('total')
    let summ = 0;
    let delivery = consts.delivery;
    let nds = consts.nds;
    let total = 0;
    let summ_delivery = 0;
    if (cart) {
        cart.map(row => {
            summ = summ + row.count * row.price
        });
        total = summ + summ * nds / 100 + delivery;
    }
    return {summ, nds, delivery, total};


},
 
 viewfunc : ({entity, model = [], state = [], schema = []}) =>
{
    //alert('viewfunc'+entity);
    let view = [];
    if (model[0])
        model.map((row, rown) => {
            let viewrow = {};
            schema[entity].map((field, fieldn) => {
                let value = row[field.id];
                if (field.from_entity)
                {
                    let find;
                    if (field.from_field)
                    find = state[field.from_entity].find(fromrow => fromrow.id == row[field.from_field]);
                    else
                    find = state[field.from_entity].find(fromrow => fromrow.id == row[field.id]);
                    if (find)
                        field.from_entity_display_field?find=find[field.from_entity_display_field]:find = find['name']
                    viewrow[field.id] = find;
                    return;
                }
                viewrow[field.id] = value;
            })
            view.push(viewrow);
        })

    return view;


}, 
order_search_func :({view, what, date, schema1, schema2}) => {
//alert("order_search_func");
    if (date)
        if ((date[0] && date[0] != "") && (date[1] && date[1] != "")) {
            let from = new Date(date[0]);
            let to = new Date(date[1]);
            let view2 = view.filter(row => {
                let current_date = new Date(row['date'].split(' ')[0]);
                let result = (from <= current_date) && (current_date <= to);
                return result;
            })
            view = view2;
        }
    if (what == '' || what == undefined)
        return view;
    let fields = schema1.map(row => row.id);
    fields.push('user_order');
    let seachable1 = schema1.map(row => row.searchable);
    seachable1.push(true);
    let fields2 = schema2.map(row => row.id);
    let seachable2 = schema2.map(row => row.searchable);
    let view2 = view.filter(row => {
        for (let i = 0; i < fields.length; i++) {
            let item = row[fields[i]];
            if (item && seachable1[i])
                if (typeof (item) == "object") {
                    let result = 0;
                    item.some(item_row => {
                        for (let j = 0; j < fields2.length; j++) {
                            let item2 = item_row[fields2[j]];
                            if (item2 && seachable2[i])
                                if (item2.toString().toLowerCase().indexOf(what.toString().toLowerCase()) > -1)
                                {
                                    result = 1;
                                    return 1;
                                }
                        }
                    })
                    return result;
                } else {
                    if (row[fields[i]].toString().toLowerCase().indexOf(what.toString().toLowerCase()) > -1)
                        return true;
                }

        }
    })
    return view2;
},
order_view_func:({products, order, user_order, schema}) =>
{
    //alert("order_view_func");
    let view = [];
    if (order) {
        view = order.map(order_row => {
            let orders = [];
            let user_orders = [];
            if (user_order)
                orders = user_order.filter(user_order_row => user_order_row.order == order_row.id)
            user_orders = orders.map(user_orders_row => {
                let order_product = products.find(product_row => product_row.id == user_orders_row.product);
                if (order_product)
                return {...user_orders_row, img: order_product['img'], name: order_product['name']}
            else  return {...user_orders_row}
            })
            return {...order_row, user_order: user_orders}
        })
    }
    return view;
},

 sortfunc : ({state = [], sort = {descending:false, sortby:'id'}, schema}) => {
     // alert('sortfunc');
    const view = state.sort(function (a, b) {
        return sort.descending
                ? (a[sort.sortby] < b[sort.sortby] ? 1 : -1)
                : (a[sort.sortby] > b[sort.sortby] ? 1 : -1);
    })
    return {view, sort};
},

 search_func :({entity, state = [], search = {}, schema}) =>
{
    // alert("search_func"+entity);
    let result = state;
    let result2 = [];
    if (Object.keys(search).length==0)
        return result;
    Object.keys(search).map(key => {
        let what = search[key];
        if (key == 'firm' && entity == 'product') {
            if (typeof (what) == 'object') { //если искомое это массив
                if (what.length == 0)
                    return result;
                let union = [];
                what.map(what_key => {
                    result2 = result.filter(result_row => result_row['firm'] == what_key);
                    union = union.concat(result2);
                })
                result = union;
            } else {
                result2 = result.filter(result_row => result_row['firm'] == what_key);
                result = result2;
            }
        }
        if (key == 'search') {
            const fields = schema.map(item => item.id);
            const searchable = schema.map(item => item.searchable);
            if (typeof (what) == 'object') { //если искомое это массив
                Object.keys(search).map(key => {
                    let what = search[key];
                    if (what !== '' && what)
                        result2 = result.filter(row => {
                            for (let f = 0; f < fields.length; f++)
                                if (row[fields[f]] && searchable[f])
                                    if (row[fields[f]].toString().toLowerCase().indexOf(what.toString().toLowerCase()) > -1)
                                        return true;
                            return false;
                        })
                    result = result2;
                })
            } else {
                if (what !== '' && what) {

                    result2 = result.filter(row => {
                        for (let f = 0; f < fields.length; f++) {
                            if (row[fields[f]] && searchable[f])
                                if (row[fields[f]].toString().toLowerCase().
                                        indexOf(what.toString().toLowerCase()) > -1) {
                                    return true;
                                }
                        }
                        return false;
                    })
                    result = result2;
                }
            }
        }

        if (key == 'price' && entity == 'product') {
            result2 = result.filter(row => {
                if (parseInt(what[0]) <= parseInt(row['price']) && parseInt(row['price']) <= parseInt(what[1]))
                    return 1;
            }
            )
            result = result2;
        }



    })

    return result;
},


  search_product_kategory_func : (state = [], search = []) => {
    let  katalog2 = [];
    let product = state['product'];

    if (search.length === 0)
        return product;
    let katalog = state['katalog'];
    let fields = Object.keys(katalog[0]).filter(key => key.indexOf('kategory') > -1)    //kategory1-6
    katalog2 = katalog.filter(katalog_row => {
        let filter = false;
        if (typeof (search) == 'object') //если искомое это массив
            search.some((search_row, nrow) => {
                if (search_row == katalog_row[fields[nrow]])
                    filter = true; //фильтр тех строк каталогов, которые совпадают по искомым категориям
                else {
                    filter = false;
                    return true;
                }
            })
        else if (search == katalog_row[fields[0]])
            filter = true; //если искомое просто значение
        return filter;
    })

    //поиск продуктов с найденными каталогами
    let result = [];
    katalog2.map(katalog_row => {
        let filter_product = product.filter(product_row => {
            return  product_row['katalog'] == katalog_row['id']
        })
        result.push(...filter_product);

    })

    return result;
},

  find_minmax_func :({state}) =>
        {
            let min = 999999;
            let max = 0;
            let price = [0, 1000];
            if (state) {
                state.map(row => {
                    let current = parseInt(row.price);
                    if (max < current)
                        max = current;
                    if (min > current)
                        min = current;
                });
                price[0] = min;
                price[1] = max;
            }
            return  price;

        }
    }
    
    export default Function;