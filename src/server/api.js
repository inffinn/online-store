import { Router }
from 'express'
import consts from '../constants'
import { v4 }
from 'uuid'
var path = require('path');
var fs = require('fs');
var multer = require('multer')
var crypto = require('crypto');
const jwt = require('jsonwebtoken')
import {add, edit, remove, sort, search, login, logout, by}
from '../Actions.js';
//var upload = multer()
var join = path.join;
const router = Router()
const imgpath = path.join(__dirname, '../../dist/assets/img')

const dispatchAndRespond = (req, res, action) => {
req.store.dispatch(action)
res.status(200).json(action)
}


const verify_email = (email) => {
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (regExp.test(email));
}
const createToken = ({id, username, role}, req, res, next) => {
    const payload = {
        id: id,
        username: username,
        role: role,
        iss: 'http://localhost:3000',
        permissions: 'poll',
    }
    const options = {
        expiresIn: '7d',
        jwtid: v4(),
    }

    const secret = new Buffer('CLIENT_SECRET', 'base64')
    jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
            return res.status(200).json(add.message({message: err.message, message_type: 'error'}))
        }
        res.contentType('application/json');
        res.cookie('token', token, {
            maxAge: 9999999,
            httpOnly: false,
            secure: false
        });
        res.send({type: 'LOGIN', id: id, username: username, role: role}); //end the response
    })


}



const requireToken = (req, res, next) => {
    const token = req.cookies['token'];
    const secret = new Buffer('CLIENT_SECRET', 'base64')

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(200).json(add.message({message: 'Please login', message_type: "error"}))
        }
        req.params.userId = decoded.id,
                req.params.role = decoded.role,
                next()
    }
    )
}

const destroyToken = (req, res, next) =>
        {
            res.contentType('application/json');
            res.clearCookie("token");
            res.send({type: 'LOGOUT'}); //end the response

        }

router.post("/by", requireToken, (req, res) =>
        {
            let cart = req.body.cart;
            let user = req.body.user;
            let date = new Date();
            let year = String(date.getFullYear());
            let month = String(date.getMonth() + 1);
            if (month.length == 1)
                month = '0' + month;
            let day = String(date.getDate());
            if (day.length == 1)
                day = '0' + day;
            let hour = String(date.getHours());
            if (hour.length == 1)
                hour = '0' + hour;
            let min = String(date.getMinutes());
            if (min.length == 1)
                min = '0' + min;
            let sec = String(date.getSeconds());
            if (sec.length == 1)
                sec = '0' + sec;
            date = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
            let state = req.store.getState();
            let check = 1;
            let products = state['store']['product'];
            cart.map(cart_row =>
                products.some(product_row => {
                    if (product_row.id == cart_row.product)
                        if (product_row.count - cart_row.count < 0)
                        {
                            check = 0;
                            return 1
                        }
                    ;
                }))

            if (check) {
                let total=0;
                cart.map(cart_row => products.map(product_row=>{
                if (product_row.id==cart_row.product) 
                    total=total+parseInt(product_row.price)*parseInt(cart_row.count);
               }))
               total=total+total*parseInt(req.body.nds)/100+req.body.delivery;
                let order_add_action = add.order({
                    user, 
                    date,
                    nds:req.body.nds,
                    delivery:req.body.delivery,
                    total:total
                });
                let action = [];
                action.push(order_add_action);
                cart.map(cart_row => {
                    action.push(by.product({id: cart_row.product, count: cart_row.count}));
                    action.push(add.user_order({
                        user,
                        order: order_add_action.id,
                        product: cart_row.product,
                        count: cart_row.count,
                        price: cart_row.price,
                    }));
                });
                action.push(by.cart());
                action.map(action =>
                    req.store.dispatch(action)
                )
                res.send({type: consts.type.ACTION_ARRAY , actions: action});
            } else
                res.send(add.message({message: 'there is no such product count', message_type: 'error'}));
        })

router.post("/login", (req, res) => {
    var login = req.body.login;
    var password = req.body.password;
    let result = [];
    let users = req.store.getState()['store']['user'];
    result = users.filter(row => row.login === login)
    if (result.length == 0) {
        return  res.status(200).json(add.message({message: ' Unknown user ' + login, message_type: "error"}))
    } else {
        result = result[0];
        let salt = result.salt;
        var newhash = crypto.createHash('sha512')
                .update(salt + password)
                .digest('hex');
// если пароль соответствует
        password = result.password;
        if (password === newhash) {
            let token = createToken(result, req, res);
            //return res.json({ data: token, message:'login success!' })
        } else {
            res.status(200).json(add.message({message: 'invalid password!', message_type: "error"}))
        }
    }
}
)

router.post("/logout", requireToken, (req, res) => {//res.json({ data:'asd'});
    destroyToken(req, res);
})

router.post("/registration", (req, res) =>
{
    console.log('registration');
    var login = req.body.login;
    let users = req.store.getState()['store']['user'] || [];
    if (users.find(row => row.login == login))
        return  res.status(200).json(add.message({message: 'This login is already exist', message_type: "error"}));
    var password = req.body.password;
    var username = req.body.username;
    var email = req.body.email;
    if (!verify_email(email))
      return  res.status(200).json(add.message({message: 'Invalid email', message_type: 'error'}))
    if (!login && !password && !username)
      return  res.status(200).json(add.message({message: 'Error. Empty field', message_type: 'error'}))
    var salt = Math.round((new Date().valueOf() * Math.random())) + '';
    var hashpassword = crypto.createHash('sha512')
            .update(salt + password)
            .digest('hex');
    let id = v4();
    // users.push({id: v4(), login: login, password: hashpassword, salt: salt, username: username})
    req.store.dispatch(add.user({id, login, password: hashpassword, salt, username, role: 'user', email}));
    createToken({id, username, role: 'user'}, req, res);
})




router.post("/img/delete", (req, res) => {
    console.log('delete!!!!!!!!!!!!!!!!!!!!!!');
    const name = req.body.photo;
    console.log(name);
    fs.unlink(imgpath + '/' + name, (err) => {
        if (err)
            throw err;
        console.log('successfully deleted' + name);
        res.status(200).json({status: "delete"})
    });
    // dispatchAndRespond(req, res, {filename:req.files[0].originalname});
})




var storage = multer.diskStorage({
    destination: imgpath,
    filename: function (req, file, cb) {
        cb(null, v4() + path.extname(file.originalname))
    }
}
)
//var upload = multer({ dest: imgpath })
var upload = multer({storage: storage});
router.post("/img", upload.array('photo'), (req, res) => {
    console.log('upload!: ' + req.files[0].filename);
    res.status(200).json({filename: '/img/' + req.files[0].filename})
    // dispatchAndRespond(req, res, {filename:req.files[0].originalname});
})

router.post("/firm", requireToken, (req, res) =>
{
    dispatchAndRespond(req, res, {
        type: consts.type.ADD,
        entity: consts.entity.firm,
        id: v4(),
        name: req.body.name,
    }
    )
})

router.post("/kategory", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.ADD,
        entity: consts.entity.kategory,
        id: v4(),
        name: req.body.name,
    }
    )
)

router.post("/product", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.ADD,
        entity: consts.entity.product,
        id: v4(),
        firm: req.body.firm,
        katalog: req.body.katalog,
        name: req.body.name,
        img: req.body.img,
        count: req.body.count,
        price: req.body.price,
        comment: req.body.comment,
    }
    )
)

router.post("/katalog", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.ADD,
        entity: consts.entity.katalog,
        id: v4(),
        kategory1: req.body.kategory1,
        kategory2: req.body.kategory2,
        kategory3: req.body.kategory3,
        kategory4: req.body.kategory4,
        kategory5: req.body.kategory5,
        kategory6: req.body.kategory6,
        name: req.body.name
    }
    )
)
router.post("/cart", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.ADD,
        entity: consts.entity.cart,
        id: v4(),
        product: req.body.product,
        count: req.body.count,
    }
    )
)





router.put("/firm/:id/edit", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.EDIT,
        entity: consts.entity.firm,
        id: req.params.id,
        name: req.body.name,
    })
)
router.put("/kategory/:id/edit", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.EDIT,
        entity: consts.entity.kategory,
        id: req.params.id,
        name: req.body.name,
    })
)
router.put("/product/:id/edit", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.EDIT,
        entity: consts.entity.product,
        id: req.params.id,
        firm: req.body.firm,
        katalog: req.body.katalog,
        name: req.body.name,
        img: req.body.img,
        count: req.body.count,
        price: req.body.price,
        comment: req.body.comment,
    })
)

router.put("/katalog/:id/edit", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.EDIT,
        entity: consts.entity.katalog,
        id: req.params.id,
        kategory1: req.body.kategory1,
        kategory2: req.body.kategory2,
        kategory3: req.body.kategory3,
        kategory4: req.body.kategory4,
        kategory5: req.body.kategory5,
        kategory6: req.body.kategory6,
        name: req.body.name
    })
)
router.put("/cart/:id/edit", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.EDIT,
        entity: consts.entity.cart,
        id: req.params.id,
        product: req.body.product,
        count: req.body.count,
    })
)
router.put("/user/:id/edit", requireToken, (req, res) => {



    if (req.body.what == 'all_info') {
        if (req.params.role == 'admin') {
            let email = req.body.email;
            if (!verify_email(email))
                res.status(200).json(add.message({message: 'Invalid email', message_type: 'error'}))
            console.log('change_all_info');
            dispatchAndRespond(req, res, {
                type: consts.type.EDIT,
                entity: consts.entity.user,
                what: req.body.what,
                id: req.params.id,
                login: req.body.login,
                username: req.body.username,
                role: req.body.role,
                email
            })
        } else
            res.status(200).json(add.message({message: 'access denied!', message_type: "error"}))
    }

    if (req.body.what == 'personal_info') {
        if (req.params.id == req.params.userId) {
            let email= req.body.email;
            if (!verify_email(email))
                res.status(200).json(add.message({message: 'Invalid email', message_type: 'error'}))
            console.log('change_personal_info');
            let action={
                type: consts.type.EDIT,
                entity: consts.entity.user,
                what: req.body.what,
                id: req.params.id,
                username: req.body.username,
                email
            };
            req.store.dispatch(action)
            let actions=[];
            actions.push(action);
            action={
                type:consts.type.LOGIN,
                id: req.params.id,
                username: req.body.username,
                role:req.params.role
            }
            actions.push(action);
            actions.push(add.message({message: 'success!', message_type: "success"}));
            res.status(200).json({type:consts.type.ACTION_ARRAY,actions})
        } else
            res.status(200).json(add.message({message: 'access denied!', message_type: "error"}))
    }

    if (req.body.what == 'reset_password') {
        if (req.params.id == req.params.userId || req.params.role == 'admin') {
            console.log('reset_password');
            let id = req.body.id;
            if (!id)
                return  res.status(200).json(add.message({message: 'id not found', message_type: 'error'}));
            let password = 'password';
            let salt = Math.round((new Date().valueOf() * Math.random())) + '';
            let hashpassword = crypto.createHash('sha512').update(salt + password).digest('hex');
            req.store.dispatch({
                type: consts.type.EDIT,
                entity: consts.entity.user,
                what: "password",
                id: req.params.id,
                password: hashpassword,
                salt
            });
            res.status(200).json(add.message({message: 'password has been reset!', message_type: 'success'}));
        } else
            res.status(200).json(add.message({message: 'access denied!', message_type: 'error'}))
    }


    if (req.body.what == 'change_password') {
        if (req.params.id == req.params.userId || req.params.role == 'admin') {
            console.log('change_password');
            let old_password = req.body.old_password;
            let new_password = req.body.new_password;
            let result = [];
            let users = req.store.getState()['store']['user'];
            result = users.filter(row => row.id === req.params.id)
            if (result.length == 0) {
                return  res.status(200).json(add.message({message: 'Unknown user ' + login, message_type: 'error'}))
            } else {
                result = result[0];
                let salt = result.salt;
                let newhash = crypto.createHash('sha512')
                        .update(salt + old_password)
                        .digest('hex');
// если пароль соответствует
                if (result.password === newhash) {
//let token = createToken(result, req, res);
                    salt = Math.round((new Date().valueOf() * Math.random())) + '';
                    let hashpassword = crypto.createHash('sha512').update(salt + new_password).digest('hex');
                    req.store.dispatch({
                        type: consts.type.EDIT,
                        entity: consts.entity.user,
                        what: "password",
                        id: req.params.id,
                        password: hashpassword,
                        salt
                    });
                    res.status(200).json(add.message({message: 'password has been changed!', message_type: 'success'}));
                } else {
                    res.status(200).json(add.message({message: 'invalid password!', message_type: "error"}))
                }
            }
        } else
            res.status(200).json(add.message({message: 'access denied!', message_type: "error"}))
    }


})


router.put("/order/:id/edit", requireToken, (req, res) =>{
    
    let user_oder=req.store.getState()['store']['user_order'].filter(row=>req.body.id==row.order);
      let total=0;
    user_oder.map(row=>total=total+parseInt(row.count)*parseInt(row.price));
      total=parseInt(total)+parseInt(total)*parseInt(req.body.nds)/100+parseInt(req.body.delivery); 
      
    dispatchAndRespond(req, res, {
        type: consts.type.EDIT,
        entity: consts.entity.order,
        id: req.params.id,
        user: req.body.user,
        date: req.body.date,
        nds: req.body.nds,
        delivery: req.body.delivery,
        total
    })
    })
router.put("/user_order/:id/edit", requireToken, (req, res) =>{
  
    let action= {
        type: consts.type.EDIT,
        entity: consts.entity.user_order,
        id: req.params.id,
        product: req.body.product,
        order: req.body.order,
        count: req.body.count,
        price: req.body.price,
    }
    let actions=[];
    actions.push(action);
    req.store.dispatch(action);
    
      let user_oder=req.store.getState()['store']['user_order'].filter(row=>req.body.order==row.order);
      let total=0;
      user_oder.map(row=>total=total+parseInt(row.count)*parseInt(row.price));
      let oder=req.store.getState()['store']['order'].find(row=>req.body.order==row.id);
      total=parseInt(total)+parseInt(total)*parseInt(oder.nds)/100+parseInt(oder.delivery);   
      
    action={
        type: consts.type.EDIT,
        entity: consts.entity.order,
        ...oder,
        total
    }
    
     req.store.dispatch(action)
      actions.push(action);
      res.send({type: consts.type.ACTION_ARRAY , actions});
    })


router.delete("/firm/:id/delete", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.REMOVE,
        entity: consts.entity.firm,
        id: req.params.id,
    })
)

router.delete("/kategory/:id/delete", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.REMOVE,
        entity: consts.entity.kategory,
        id: req.params.id,
    })
)
router.delete("/product/:id/delete", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.REMOVE,
        entity: consts.entity.product,
        id: req.params.id,
    })
)

router.delete("/katalog/:id/delete", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.REMOVE,
        entity: consts.entity.katalog,
        id: req.params.id,
    })
)
router.delete("/cart/:id/delete", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.REMOVE,
        entity: consts.entity.cart,
        id: req.params.id,
    })
)
router.delete("/user/:id/delete", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.REMOVE,
        entity: consts.entity.user,
        id: req.params.id,
    })
)
router.delete("/order/:id/delete", requireToken, (req, res) =>{
    let actions=[];
      let user_oder=req.store.getState()['store']['user_order'].filter(row=>req.params.id==row.order);
      user_oder.map(row=>
      actions.push({
      type: consts.type.REMOVE,
      entity: consts.entity.user_order,
      id: row.id,
    }))

 actions.push({
        type: consts.type.REMOVE,
        entity: consts.entity.order,
        id: req.params.id,
    })
    
actions.map(row=>
req.store.dispatch(row)
);

actions.map(row=>
req.store.dispatch(row)
);
res.send({type: consts.type.ACTION_ARRAY , actions});
})

router.delete("/user_order/:id/delete", requireToken, (req, res) =>{
   let delete_user_order=req.store.getState()['store']['user_order'].find(row=>req.params.id==row.id);
   
    let actions=[];
      let action= {
        type: consts.type.REMOVE,
        entity: consts.entity.user_order,
        id: req.params.id,
    }
    req.store.dispatch(action);
    actions.push(action);
    
    let user_oder=req.store.getState()['store']['user_order'].filter(row=>delete_user_order.order==row.order);
    let oder=req.store.getState()['store']['order'].find(row=>delete_user_order.order==row.id); 
    
       if (user_oder.length!=0){
      let total=0;
      user_oder.map(row=>total=total+parseInt(row.count)*parseInt(row.price)); 
      total=parseInt(total)+parseInt(total)*parseInt(oder.nds)/100+parseInt(oder.delivery);
      action={
        type: consts.type.EDIT,
        entity: consts.entity.order,
        ...oder,
        total
    }
    req.store.dispatch(action);
    actions.push(action);
    
      } else {    
             
      action={
        type: consts.type.REMOVE,
        entity: consts.entity.order,
        id: oder.id,
    }
    req.store.dispatch(action);
    actions.push(action);
      }
 res.send({type: consts.type.ACTION_ARRAY , actions})    
 })
router.delete("/user/:id/delete", requireToken, (req, res) =>
    dispatchAndRespond(req, res, {
        type: consts.type.REMOVE,
        entity: consts.entity.user,
        id: req.params.id,
    })
)







export default router
