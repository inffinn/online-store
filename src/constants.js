const consts = {
"delivery":35,
"nds":20,
entity: {
firm:'firm',
product:'product',
kategory:'kategory',
katalog:"katalog",
cart:"cart",
user:'user',
order:'order',
user_order:'user_order',
message:'message',
personal_info:"personal_info",
change_password:"change_password"
},
selector_entity:
["firm",
"product",
"kategory",
"katalog",
"cart",
"user",
"order",
"user_order"
],
type: {
ADD:'ADD',
EDIT:'EDIT',
REMOVE:'REMOVE',
SEARCH:'SEARCH',
SORT:'SORT',
BY:'BY',
LOGIN:'LOGIN',
LOGOUT:'LOGOUT',
RESET_PASSWORD:'RESET_PASSWORD',
ACTION_ARRAY:'ACTION_ARRAY'
},
command: {
read:'read',
add:'add',
edit:'edit',
delete:'delete',
},
actions:{
cart_actions:{
can:"can",
cant:"cant",
already:"already",
delete:"delete"
},
user_actions:{
reset_password:"reset_password"
}
}
}
export default consts;