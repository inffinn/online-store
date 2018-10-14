import consts from './constants'
        import { v4 } from 'uuid'
        import { PropTypes } from 'prop-types'

        import fetch from 'isomorphic-fetch'

        const parseResponse = response => response.json()

const logError = error=> console.log(error.message);
const fetchThenDispatch = (dispatch, url, method, body,callback) =>
    fetch(url, {method, body, headers: {'Content-Type': 'application/json'}})
            .then(parseResponse)
            .then(dispatch_(dispatch,callback))
            .catch(logError)
const dispatch_ = (dispatch,callback) => (action) =>
    {
       switch (action.type) {                     
                
                  case consts.type.LOGIN:
                {
                    window.location.replace('/product');
                    break;
                }                
            case consts.type.LOGOUT:
                {
                    window.location.replace('/product');
                    break;
                } 

                    case consts.type.ACTION_ARRAY:
            {
                action['actions'].map(action => dispatch(action));
                if (action.message_type!='error')
                if (callback) callback();
                break;
           }
            default :
            {
             dispatch(action);
             if (action.message_type!='error')
             if (callback) callback();
             break;
            }
        }
    }
export const  by = {
    order: ({user, cart,nds,delivery}) => dispatch => {
            const action = {
                user,
                cart,
                nds,
                delivery
            }
            fetchThenDispatch(
                    dispatch,
                    '/api/by',
                    'POST',
                    JSON.stringify(action)
                    )
            /* fetch('/api/by', {method: 'POST', body: JSON.stringify(action), headers: {'Content-Type': 'application/json'}})
             .then(parseResponse)
             .then(dispatchBy(dispatch))
             .catch(logError)*/
        },
    cart: () => ({type: consts.type.BY, entity: "cart"}),
    product: ({id, count}) => ({type: consts.type.BY, entity: "product", id, count})
}

export const  update = () => dispatch => {
        const action = {
            type: 'update'
        }
        fetchThenDispatch(
                dispatch,
                '/api/update',
                'POST',
                JSON.stringify(action)
                )
    }

export const  registration = ({login, password, username, role, email},collback) => dispatch => {
        const action = {
            login,
            password,
            username,
            role: 'user',
            email
        }
        fetchThenDispatch(
                dispatch,
                '/api/registration',
                'POST',
                JSON.stringify(action),
                collback
                )
    }

export const  login = ({login, password},collback) => dispatch => {
        const action = {
            login,
            password
        }
        fetchThenDispatch(
                dispatch,
                '/api/login',
                'POST',
                JSON.stringify(action),
                collback
                )
    }
export const  logout = (collback) => dispatch => {
        const action = {};
        fetchThenDispatch(
                dispatch,
                '/api/logout',
                'POST',
                JSON.stringify(action),
                collback
                )
    }



export const add = {
    firm: ({name},collback) => dispatch =>
        {
            const action = {
                type: consts.type.ADD,
                entity: consts.entity.firm,
                //  id: v4(),
                name,
            };
            fetchThenDispatch(
                    dispatch,
                    '/api/firm',
                    'POST',
                    JSON.stringify(action),
                    collback
                    )
        },

    kategory: ({name},collback) => dispatch => {
            const action = {
                type: consts.type.ADD,
                entity: consts.entity.kategory,
                // id: v4(),
                name,
            };
            fetchThenDispatch(
                    dispatch,
                    '/api/kategory',
                    'POST',
                    JSON.stringify(action),
                    collback
                    )
        },

    product: ({firm, katalog, name, img, count, price, comment},collback) => dispatch => {
            const action = {
                type: consts.type.ADD,
                entity: consts.entity.product,
                // id: v4(),
                firm,
                katalog,
                name,
                img,
                count,
                price,
                comment,
            };
            fetchThenDispatch(
                    dispatch,
                    '/api/product',
                    'POST',
                    JSON.stringify(action),
                    collback
                    )
        },

    katalog: ({kategory1, kategory2, kategory3, kategory4, kategory5, kategory6},collback) => dispatch => {
            const action = {
                type: consts.type.ADD,
                entity: consts.entity.katalog,
                // id: v4(),
                kategory1,
                kategory2,
                kategory3,
                kategory4,
                kategory5,
                kategory6,
            };
            fetchThenDispatch(
                    dispatch,
                    '/api/katalog',
                    'POST',
                    JSON.stringify(action),
                    collback
                    )
        },
    cart: ({product, count}) => {

        return  {
            type: consts.type.ADD,
            entity: consts.entity.cart,
            id: v4(),
            product,
            count,
        };
        /*    fetchThenDispatch(
         dispatch,
         '/api/cart',
         'POST',
         JSON.stringify(action)
         )*/
    },

    message: ({message,message_type}) => ({
            type: consts.type.ADD,
            entity: consts.entity.message,
            id: v4(),
            message,
            message_type
        }),
    order: ({user, date,nds,delivery,total}) => (
                {type: consts.type.ADD,
                    entity: consts.entity.order,
                    id: v4(),
                    user,
                    date,
                    nds,
                    delivery,
                    total
                }
        ),
    user_order: ({product, order, count, price}) => (
                {type: consts.type.ADD,
                    entity: consts.entity.user_order,
                    id: v4(),
                    product,
                    order,
                    count,
                    price
                }
        ),
    user: ({id,login, password, salt, username, role, email}) => (
                {type: consts.type.ADD,
                    entity: consts.entity.user,
                    id,
                    login,
                    password,
                    salt,
                    username,
                    role,
                    email

                }),
              
}




export const edit = {
    firm: ({id, name},collback) => dispatch => {
            const action = {
                type: consts.type.EDIT,
                entity: consts.entity.firm,
                id,
                name,
            };
            fetchThenDispatch(
                    dispatch,
                    `/api/firm/${id}/edit/`,
                    'PUT',
                    JSON.stringify(action),
                    collback
                    )
        },

    kategory: ({id, name},collback) => dispatch => {
            const action = {
                type: consts.type.EDIT,
                entity: consts.entity.kategory,
                id,
                name,
            };
            fetchThenDispatch(
                    dispatch,
                    `/api/kategory/${id}/edit/`,
                    'PUT',
                    JSON.stringify(action),
                    collback
                    )
        },

    product: ({id, firm, katalog, name, img, comment, count, price},collback) => dispatch => {
            const action = {
                type: consts.type.EDIT,
                entity: consts.entity.product,
                id,
                firm,
                katalog,
                name,
                img,
                count,
                price,
                comment,

            };

            fetchThenDispatch(
                    dispatch,
                    `/api/product/${id}/edit/`,
                    'PUT',
                    JSON.stringify(action),
                    collback
                    )
        },

    katalog: ({id, kategory1, kategory2, kategory3, kategory4, kategory5, kategory6},collback) => dispatch => {
            const action = {
                type: consts.type.EDIT,
                entity: consts.entity.katalog,
                id,
                kategory1,
                kategory2,
                kategory3,
                kategory4,
                kategory5,
                kategory6,

            };

            fetchThenDispatch(
                    dispatch,
                    `/api/katalog/${id}/edit/`,
                    'PUT',
                    JSON.stringify(action),
                    collback
                    )
        },
    cart: ({id, product, count}) => {

        return  {
            type: consts.type.EDIT,
            entity: consts.entity.cart,
            id,
            product,
            count
        };

        /*   fetchThenDispatch(
         dispatch,
         `/api/cart/${id}/edit/`,
         'PUT',
         JSON.stringify(action)
         )*/
    },

    order: ({id, user, date,nds,delivery},collback) => dispatch => {
            const action = {type: consts.type.EDIT,
                entity: consts.entity.order,
                id,
                user,
                date,
                nds,
                delivery
            }
            fetchThenDispatch(
                    dispatch,
                    `/api/order/${id}/edit/`,
                    'PUT',
                    JSON.stringify(action),
                    collback
                    )
        },

    user_order: ({id, product, order, count, price},collback) => dispatch => {
            const action = {
                type: consts.type.EDIT,
                entity: consts.entity.user_order,
                id,
                product,
                order,
                count,
                price
            }
            fetchThenDispatch(
                    dispatch,
                    `/api/user_order/${id}/edit/`,
                    'PUT',
                    JSON.stringify(action),
                    collback
                    )
        },

    user: ({id, login, username, role, email},collback) => dispatch => {
            const action = {
                type: consts.type.EDIT,
                entity: consts.entity.user,
                what: 'all_info',
                id,
                login,
                username,
                role,
                email
            };
            fetchThenDispatch(
                    dispatch,
                    `/api/user/${id}/edit/`,
                    'PUT',
                    JSON.stringify(action),
                    collback
                    )
        },

    personal_info: ({id, username, email},collback) => dispatch => {
            const action = {
                type: consts.type.EDIT,
                entity: consts.entity.user,
                what: "personal_info",
                id,
                username,
                email
            }
            fetchThenDispatch(
                    dispatch,
                    `/api/user/${id}/edit/`,
                    'PUT',
                    JSON.stringify(action),
                    collback
                    )

        },
        
    reset_password: (id,collback) => dispatch => {
            const action = {
                type: consts.type.EDIT,
                entity: consts.entity.user,
                what: "reset_password",
                id
            }
            fetchThenDispatch(
                    dispatch,
                    `/api/user/${id}/edit/`,
                    'PUT',
                    JSON.stringify(action),
                    collback
                    )

        },
          change_password: ({id,old_password,new_password,new_password2},callback) => dispatch => {
            if (new_password!==new_password2) {
            dispatch(add.message({message:'passwords do not match',message_type:'error'}));
            }
            else {
            const action = {
                type: consts.type.EDIT,
                entity: consts.entity.user,
                what: "change_password",
                id,
                old_password,
                new_password
            }
            fetchThenDispatch(
                    dispatch,
                    `/api/user/${id}/edit/`,
                    'PUT',
                    JSON.stringify(action),
                    callback
                    )

        }}

    
}

export const remove = {
    firm: (id,collback) => dispatch => {
            const action = {
                type: consts.type.REMOVE,
                entity: consts.entity.firm,
                id,
            };
            fetchThenDispatch(
                    dispatch,
                    `/api/firm/${id}/delete/`,
                    'DELETE',
                    JSON.stringify(action),
                    collback
                    )
        },

    kategory: (id,collback) => dispatch => {
            const action = {
                type: consts.type.REMOVE,
                entity: consts.entity.kategory,
                id,
            };
            fetchThenDispatch(
                    dispatch,
                    `/api/kategory/${id}/delete/`,
                    'DELETE',
                    JSON.stringify(action),
                    collback
                    )
        },
    product: (id,collback) => dispatch => {
            const action = {
                type: consts.type.REMOVE,
                entity: consts.entity.product,
                id,
            };

            fetchThenDispatch(
                    dispatch,
                    `/api/product/${id}/delete/`,
                    'DELETE',
                    JSON.stringify(action),
                    collback
                    )
        },
    katalog: (id,collback) => dispatch => {
            const action = {
                type: consts.type.REMOVE,
                entity: consts.entity.katalog,
                id,
            };

            fetchThenDispatch(
                    dispatch,
                    `/api/katalog/${id}/delete/`,
                    'DELETE',
                    JSON.stringify(action),
                    collback
                    )
        },
    cart: (id) => {
        return  {
            type: consts.type.REMOVE,
            entity: consts.entity.cart,
            id,
        };

        /*    
         fetchThenDispatch(
         dispatch,
         `/api/cart/${id}/delete/`,
         'DELETE',
         JSON.stringify(action)
         )*/
    },
    message: (id) => {
        return  {
            type: consts.type.REMOVE,
            entity: consts.entity.message,
            id,
        };
    },

    order: (id,collback) => dispatch => {
            const action = {
                type: consts.type.REMOVE,
                entity: consts.entity.order,
                id,
            };
            fetchThenDispatch(
                    dispatch,
                    `/api/order/${id}/delete/`,
                    'DELETE',
                    JSON.stringify(action),
                    collback
                    )
        },

    user_order: (id,collback) => dispatch => {
            const action = {
                type: consts.type.REMOVE,
                entity: consts.entity.user_order,
                id,
            };
            fetchThenDispatch(
                    dispatch,
                    `/api/user_order/${id}/delete/`,
                    'DELETE',
                    JSON.stringify(action),
                    collback
                    )
        },
    user: (id,collback) => dispatch => {
            const action = {
                type: consts.type.REMOVE,
                entity: consts.entity.user,
                id,
            };
            fetchThenDispatch(
                    dispatch,
                    `/api/user/${id}/delete/`,
                    'DELETE',
                    JSON.stringify(action),
                    collback
                    )
        },

}
export const sort = {
    firm: (key, descending) =>
        ({
            type: consts.type.SORT,
            entity: consts.entity.firm,
            sortby: key,
            descending
        }),

    kategory: (key, descending) =>
        ({
            type: consts.type.SORT,
            entity: consts.entity.kategory,
            sortby: key,
            descending
        }),

    product: (key, descending) =>
        ({
            type: consts.type.SORT,
            entity: consts.entity.product,
            sortby: key,
            descending
        }),

    katalog: (key, descending) =>
        ({
            type: consts.type.SORT,
            entity: consts.entity.katalog,
            sortby: key,
            descending
        }),
    cart: (key, descending) =>
        ({
            type: consts.type.SORT,
            entity: consts.entity.cart,
            sortby: key,
            descending
        }),
    user: (key, descending) =>
        ({
            type: consts.type.SORT,
            entity: consts.entity.user,
            sortby: key,
            descending
        }),
    order: (key, descending) =>
        ({
            type: consts.type.SORT,
            entity: consts.entity.order,
            sortby: key,
            descending
        }),
    user_order: (key, descending) =>
        ({
            type: consts.type.SORT,
            entity: consts.entity.user_order,
            sortby: key,
            descending
        }),
}
export const search = (text) =>
    ({
        type: consts.type.SEARCH,
        text
    })

edit.firm.propTypes = {
    entity: PropTypes.string.isRequired,
    view: PropTypes.object.isRequired,
//model: PropTypes.object.isRequired,
}
