import { NavLink, Link} from 'react-router-dom'
import React, {TraditionalObjectOrientedView ,Component}
from 'react';
const selectedStyle = {color: 'red'}
import '../../../css/components/katalog_Menu.scss';
import schema from '../../../data/schema.json';
import {PropTypes} from 'prop-types';

class Katalog_Menu extends Component 
{
    constructor(props) {
        super(props)
    }

    calculate_menu(e,katalog,fields) {          
        e.preventDefault(); 
        let kategory_lvl=parseInt(e.target.dataset.kategory_lvl);
        let id=e.target.dataset.kategory_id;
        let coords={};
        let menu_history=[]; 
        let menu_history2=[];
        let startpos;
        let menu=[];
        let all_coords={};
        let result=katalog;

        let rect=e.target.parentNode.parentNode.getBoundingClientRect();
        let rect2=e.target.parentNode.getBoundingClientRect();
        kategory_lvl++;     

       if (kategory_lvl==0){
           startpos={x:rect.x,y:rect.y}
       this.setState({startpos:startpos});
   }
       else startpos=this.state.startpos;
       coords={x:rect.width,y:0-10};         
       if (this.state){
           if (this.state.startpos)
               coords={x:rect.x-startpos.x+rect.width,y:rect2.y-startpos.y-10};
          if (this.state.menu)  
       menu=this.state.menu||[];
        if (this.state.menu_history)
            menu_history=this.state.menu_history||[];
             if (this.state.coords)
       all_coords=this.state.coords||{}; 
       }
      
      if(!kategory_lvl==0){
  result=result.filter(row=>{if(row[fields[kategory_lvl-1]]==id) return 1}) //поиск строк каталога по выбранной категории
            for (let i=kategory_lvl-2;i>=0;i--){
           result=result.filter(row=>{
               if(row[fields[i]]==this.state.menu_history[i]) return 1}) //отбор только тех строк каталога, которые соответствуют истории переходов по категориям            
       }      
   }

   result=result.map(row=>{   return row[fields[kategory_lvl]]});//вывод массива категории на данной итерации
 Array.isArray(result)?result=result.filter((e, i, a) => {if (e==""||e==null||e==undefined)return 0; return a.indexOf(e) == i}):result=result;//удаление дублей
       menu[kategory_lvl]=result; menu_history[kategory_lvl-1]=id;
       all_coords[kategory_lvl]=coords;
       let menu2=[];       let coords2=[];
 for (let i=0;i<=kategory_lvl;i++)
 {menu2[i]=menu[i];coords2[i]=all_coords[i]; menu_history2[i]=menu_history[i]} //обрезание массивов до выбранного номера категории
       this.setState({menu:menu2,coords:coords2,menu_history:menu_history});
    }
    
katalog_info(state,fields,kategory_lvl,value){
let katalog=state['katalog'];
let product=state['product'];
      let result=null;
   let result2=false;
       
  result=katalog.filter(row=>{if(row[fields[kategory_lvl]]==value) return 1}) //поиск строк каталога с указанной категорией
            for (let i=kategory_lvl-1;i>=0;i--){
           result=result.filter(row=>{
               if(row[fields[i]]==this.state.menu_history[i]) return 1}) //поиск строк каталога категорий из истории           
       }      
   
   result2=result.some(row=>{                                  //есть ли в следующем уровне каталога категории
       let value=row[fields[parseInt(kategory_lvl)+1]];
           if (!((value=="")||(value==null)||(value==undefined)))
                        return 1;
    })
        let count=0;
        result.map(katalog_row=>{
        let filter_product=product.filter(product_row=>
          product_row['katalog']==katalog_row['id']);
        count=count+filter_product.length;
    })
    return {katalog_exist:result2,katalog_count:count}
   
   
}

    render() {
        let fields=[];
        let katalog = this.props.state.katalog;
        let kategory=this.props.state.kategory;   
        fields=schema['katalog'].filter((col, coln) =>
        {
            if (col.id!= 'id'&&col.id!= 'name') return 1;
        })
        fields=fields.map(r=>r['id']);
   let submenus = null;
   if (this.state)     
   if (this.state.menu) {  
   let menu=  this.state.menu;
  submenus=menu.map((row,kategory_lvl)=>{
  let li=null;
  if (menu[kategory_lvl])
  if( Array.isArray(menu[kategory_lvl])){
  li= menu[kategory_lvl].map(kategory_id =>{
  let value=kategory.find(k_row=>kategory_id==k_row.id);
value? value=value['name']:value='???'; 
let search=[];let search2={}
for (let i=0;i<=kategory_lvl;i++)
search[i]=this.state.menu_history[i]
search2['kategory']=search;
 let search_link='/product?search='+JSON.stringify(search2);
 let info=this.katalog_info(this.props.state,fields,kategory_lvl,kategory_id);
 let gt='',count=0;
 if(info.katalog_exist)gt=<div className="gt">&gt;</div>
  if(info.katalog_count)count=<div className="count">{info.katalog_count}</div>
value=value+' ('+info.katalog_count+')';
 return (<li ><Link to={search_link} data-kategory_id={kategory_id}  data-kategory_lvl={kategory_lvl} onMouseOver={(e) => this.calculate_menu(e,katalog,fields,kategory_lvl)} >{value}</Link>{gt}</li>)})
   } 
  if(li.length>0){
let left=this.state.coords[kategory_lvl].x+'px';
let top=this.state.coords[kategory_lvl].y+'px';
return (<ul className='submenu' style={{left:left,top:top}} > {li}  </ul>)
    }

  })}    
        return (<div className="Katalog_Menu">
        <ul className="menu" >
        <li >
        <Link to='/product'  data-kategory_lvl={-1} data-val={null} data-rown={0} onMouseOver={(e) => this.calculate_menu(e,katalog,fields)}>katalog</Link>
        {submenus} 
                </li>
                </ul> 
                </div>                  
                )
    }
    }

export default Katalog_Menu;

Katalog_Menu.propTypes = {
history:PropTypes.object.isRequired,
history:PropTypes.object.isRequired,
state:PropTypes.object.isRequired,
};


