import schema from '../../data/schema.json'
        import consts from '../constants.js'


        export const sort = (state = {}, action) =>
        {


            if (action.type == consts.type.SORT) {
                state = Object.assign(state, {[action.entity]: {sortby: action.sortby, descending: action.descending}})
            }
            return state
        }

export const search = (state = {}, action) =>
        {
            if (action.type == consts.type.SEARCH) {
                state = Object.assign(state, {text: action.text})
            }
            return state
        }

export const current_user = (state = {}, action) =>
        {
            if (action.type == consts.type.LOGIN) {
                state = Object.assign({}, {id: action.id, username: action.username, role: action.role})
            }
                if (action.type == consts.type.RELOGIN) {
                state = Object.assign({}, state)
            }
            if (action.type == consts.type.LOGOUT) {
                state = Object.assign({})
            }
            return state
        }

export const store = (state = {}, action) =>
        {

            if (action.type && action.entity) {
                const part = entityreducer(state[action.entity], action, state)
                state[action.entity] = part;
                state = Object.assign({}, state);
                return state;
            } else
                return state;
        }

export const entityreducer = (state = [], action, all_state) => {

    switch (action.type) {
        case consts.type.ADD :
        {
            return [                
                reducer({}, action, all_state),...state
            ]
        }
        case consts.type.EDIT :
        {
            return state.map(
                    c => reducer(c, action, all_state)
            )
        }
        case consts.type.BY :
        {
            if (action.entity == 'product')
                return state.map(
                        c => reducer(c, action, all_state)
                )
            if (action.entity == 'cart')
                return [];

        }
        case consts.type.REMOVE :
            return state.filter(
                    c => c.id !== action.id
            )

        default:
        {
            if (state)
                return state
        }
}
}

export const reducer = (state = {}, action, all_state) => {
    switch (action.type) {
        case consts.type.BY:
        {
            switch (action.entity) {
                case consts.entity.product:
                    if (state.id !== action.id)
                        return state;
                    else {
                        state.count = state.count - action.count;
                        return state
                    }
                    ;


            }
        }
        case consts.type.ADD:
        switch (action.entity) {
            case consts.entity.firm:
                return {
                    id: action.id,
                    name: action.name,
                }
            case consts.entity.kategory:
                return {
                    id: action.id,
                    name: action.name,
                }
            case consts.entity.product:
                return {
                    id: action.id,
                    firm: action.firm,
                    katalog: action.katalog,
                    name: action.name,
                    img: action.img,
                    count: action.count,
                    price: action.price,
                    comment: action.comment
                }
            case consts.entity.katalog:
            {
 let fields = Object.keys(action).filter(key => key.indexOf('kategory') > -1)
                    let ids = fields.map(field => action[field])
                    let name=[];
                     ids.map(row => {
                        let find = all_state['kategory'].find(k => k.id == row)
                        if (find)
                            if (find['name']!= "" && find['name'] != undefined)
                            name.push(find['name']);
                    })
                    name = name.join('=> ');
                return {
                    id: action.id,
                    kategory1: action.kategory1,
                    kategory2: action.kategory2,
                    kategory3: action.kategory3,
                    kategory4: action.kategory4,
                    kategory5: action.kategory5,
                    kategory6: action.kategory6,
                    name
                }
            }
            case consts.entity.cart:
                return {
                    id: action.id,
                    product: action.product,
                    count: action.count,
                }
            case consts.entity.user:
                return {
                    id: action.id,
                    login: action.login,
                    password: action.password,
                    salt: action.salt,
                    username: action.username,
                    role: action.role,
                    email: action.email,
                }
            case consts.entity.order:
                return {
                    id: action.id,
                    user: action.user,
                    date: action.date,
                    nds:action.nds,
                    delivery:action.delivery,
                    total:action.total,
                }
            case consts.entity.user_order:
                return {
                    id: action.id,
                    product: action.product,
                    order: action.order,
                    count: action.count,
                    price: action.price,
                }
            case consts.entity.message:
                return {
                    id: action.id,
                    message: action.message,
                    message_type:action.message_type
                }
        }

        case consts.type.EDIT:
        switch (action.entity) {
            case consts.entity.firm:
            {
                return (state.id !== action.id) ?
                        state :
                        {
                            ...state,
                            name: action.name
                        }
            }
            case consts.entity.kategory:
                return (state.id !== action.id) ?
                        state :
                        {
                            ...state,
                            name: action.name
                        }
            case consts.entity.product:
            {
                return (state.id !== action.id) ?
                        state :
                        {
                            ...state,
                            id: action.id,
                            firm: action.firm,
                            katalog: action.katalog,
                            name: action.name,
                            img: action.img,
                            count: action.count,
                            price: action.price,
                            comment: action.comment
                        }
            }
            case consts.entity.katalog:
            {
                if
                        (state.id !== action.id)
                    return state;
                else
                {
                    let fields = Object.keys(action).filter(key => key.indexOf('kategory') > -1)
                    let ids = fields.map(field => action[field])
                    let name=[];
                     ids.map(row => {
                        let find = all_state['kategory'].find(k => k.id == row)
                        if (find)
                            if (find['name']!= "" && find['name'] != undefined)
                            name.push(find['name']);
                    })
                    name = name.join('=> ');
                    return  {
                        ...state,
                        id: action.id,
                        kategory1: action.kategory1,
                        kategory2: action.kategory2,
                        kategory3: action.kategory3,
                        kategory4: action.kategory4,
                        kategory5: action.kategory5,
                        kategory6: action.kategory6,
                        name
                    }
                }
            }
            case consts.entity.cart:
            {
                return (state.id !== action.id) ?
                        state :
                        {
                            ...state,
                            id: action.id,
                            product: action.product,
                            count: action.count,
                        }
            }
            case consts.entity.user:
            {
                if (state.id == action.id) {
                    if (action.what == 'all_info')
                        return   {
                            id: action.id,
                            login: action.login,
                            password: state.password,
                            salt: state.salt,
                            username: action.username,
                            role: action.role,
                            email: action.email
                        }
                    if (action.what == 'personal_info')
                        return   {
                            id: state.id,
                            login: state.login,
                            password: state.password,
                            salt: state.salt,
                            username: action.username,
                            role: state.role,
                            email: action.email
                        }
                    if (action.what == 'password')
                        return   {
                            id: action.id,
                            login: state.login,
                            password: action.password,
                            salt: action.salt,
                            username: state.username,
                            role: state.role,
                            email: state.email
                        }
                } else
                    return state;
            }
            case consts.entity.order:
            {
                if (state.id !== action.id) return  state; else
                        {
                            return ({
                            id: action.id,
                            user: action.user,
                            date: action.date,
                            nds:action.nds,
                            delivery:action.delivery,
                            total:action.total
                        })
                        }
            }
            case consts.entity.user_order:
            {
                if (state.id !== action.id) return state; else{                           
                        return ({
                            id: action.id,
                            product: action.product,
                            order: action.order,
                            count: action.count,
                            price: action.price,
                        })
            }

        }
        }
        default :
            return state
}
}
