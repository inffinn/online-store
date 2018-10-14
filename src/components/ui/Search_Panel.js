import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import '../../../css/components/Search_Panel.scss';
const queryString = require('query-string');
import '../../../css/components/Slider.scss';
import '../../../css/components/ToolTip.scss';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

    class Search_Panel extends Component {
constructor(props) {
super(props);
//this.state={search:false,firm: false,price:false};

this.state={search:false,firm: false,price:false,date:false};
}
 
componentWillReceiveProps(nextProps)
{
    if (nextProps.price)
        if (this.state.min)
this.setState({search:this.state.search,firm: this.state.firm,price:this.state.price,min:this.state.min,max:this.state.max});
else this.setState({search:this.state.search,firm: this.state.firm,price:this.state.price,min:nextProps.price[0],max:nextProps.price[1]});
}


_search(e) {
const needle = e.target.value.toLowerCase();
this.props.onSearch(needle);
}
search=(firm)=>{
    let new_search={};
    if (this.refs.search)
    if (this.refs.search.value)
    new_search['search']=this.refs.search.value;
    if (firm){
    let firm_=firm.filter(row=>row.checked);
     if (firm_.length!=0){
    firm_=firm_.map(row=>row.value);
    new_search['firm']=firm_;
 }}
  if (this.refs.min&&this.refs.max){
    let price=[];
    price[0]=this.refs.min.value;
    price[1]=this.refs.max.value;
        new_search['price']=price;
  }
       if (this.refs.date1&&this.refs.date2){
    let date=[];
    date[0]=this.refs.date1.value;
    date[1]=this.refs.date2.value;
    new_search['date']=date;
 }

  
let search;let search2={};
try{search=queryString.parse(this.props.location.search)}catch(e){};
if ('search' in search){
search=JSON.parse(search['search']);
if (search['kategory'])
search2['kategory']=search['kategory'];
Object.keys(new_search).map(key=>search2[key]=new_search[key])
}else search2=new_search;
if (Object.keys(search2).length!=0){
search2="/"+this.props.entity+"?search="+JSON.stringify(search2);
}else search2="/"+this.props.entity;
this.props.history.push(search2)

}

setminmax=({min,max})=>{    
 if (min)
     this.setState({min});
  if (max)
     this.setState({max});
     
 }
render() {  
    
let elements=[];
    let element=null;   
       if (this.state.search)
    element=( <div className='container' key="search">
    <div className='container_header' onClick={
   ()=>{this.state.search?this.setState({search: false}):this.setState({search: true})}
    }>
    <span className='arrow'>{this.state.search ? '\u2191' : ' \u2193'}</span>
    <span>search</span>
    </div>
    <div className='container_options'>
<input className="search"
placeholder="Search..." ref='search'/>
</div></div>
)
else element=( <div className='container' key="search">
    <div className='container_header' onClick={
   ()=>{this.state.search?this.setState({search: false}):this.setState({search: true})}
    }>
       <span className='arrow'>{this.state.search ? '\u2191' : ' \u2193'}</span>
    <span>search</span>
    </div> </div>
 )
 elements.push(element);
 
let  firm=[];
if ((this.props.firm) && (this.props.entity=='product')){
    if (this.state.firm)
    element=( <div className='container' key="firm">
    <div className='container_header' onClick={
   ()=>{this.state.firm?this.setState({firm: false}):this.setState({firm: true})}
    }>
    <span className='arrow'>{this.state.firm ? '\u2191' : ' \u2193'}</span>
    <span>firm</span>
    </div>
<div className='container_options'>{this.props.firm.map((row,rown)=>{return (
        <div className='container_options_item' key={rown}>
        <span>{row['name']}</span>
        <label className='check_container'>
        <input className='input' type='checkbox' ref={(t=row['name'])=>firm[rown]=t} value={row['name']}/>
        <span className="checkmark"></span>
        </label>       
        </div>
        )})}
</div></div>
)
else element=( <div className='container' key="firm">
    <div className='container_header' onClick={
   ()=>{this.state.firm?this.setState({firm: false}):this.setState({firm: true})}
    }>
       <span className='arrow'>{this.state.firm ? '\u2191' : ' \u2193'}</span>
    <span>firm</span>
    </div> </div>
 )
 elements.push(element);
   }
 
  if ((this.props.price)&&(this.props.entity=='product')){
  let min,max;
  this.state.min?min=this.state.min:min=this.props.price[0];
   this.state.max?max=this.state.max:max=this.props.price[1];
       if (this.state.price)
    element=( <div className='container' key="price">
    <div className='container_header' onClick={
   ()=>{this.state.price?this.setState({price: false}):this.setState({price: true})}
    }>
    <span className='arrow'>{this.state.price ? '\u2191' : ' \u2193'}</span>
    <span>price</span>
    </div>
    <div className='container_options_price'>
    <div className='min_max_container'>
  <input className="min_max"
placeholder="min..." onChange={(e)=>this.setminmax({min:parseInt(e.target.value)})}value={min} ref='min'/>
  <input className="min_max"
placeholder="max..." onChange={(e)=>this.setminmax({max:parseInt(e.target.value)})} value={max} ref='max'/> 
</div>  
  <Range min={this.props.price[0]} max={this.props.price[1]} value={[min, max]} ref="range" tipFormatter={value => `${value}$`} 
  onChange={(val)=>this.setminmax({min:val[0],max:val[1]})}/>
</div></div>
)
else element=( <div className='container' key="price">
    <div className='container_header' onClick={
   ()=>{this.state.price?this.setState({price: false}):this.setState({price: true})}
    }>
       <span className='arrow'>{this.state.price ? '\u2191' : ' \u2193'}</span>
    <span>price</span>
    </div> </div>
 )
 elements.push(element); 
 }
 
   let date=new Date();
                let year=  String(date.getFullYear());
                let month=  String(date.getMonth()+1);
                if (month.length==1) month='0'+month;
                let day=  String(date.getDate());
                if (day.length==1) day='0'+day;           
                date=year+'-'+month+'-'+day;
                
if (this.props.entity=='view_order' ){
    if (this.state.date)
    element=( <div className='container' key="date">
    <div className='container_header' onClick={
   ()=>{this.state.date?this.setState({date: false}):this.setState({date: true})}
    }>
    <span className='arrow'>{this.state.date ? '\u2191' : ' \u2193'}</span>
    <span>date</span>
    </div>
<div className='container_options'>
        <div className='container_options_item'>
        <span>from</span>
        <input className='input' className="date" type='date' ref='date1' defaultValue={date}/>
           </div>
           <div className='container_options_item'>
        <span>to</span>
        <input className='input' type='date' className="date" ref='date2' defaultValue={date}/>   
        </div>
</div></div>
)
 else element=( <div className='container' key="date">
    <div className='container_header' onClick={
   ()=>{this.state.date?this.setState({date: false}):this.setState({date: true})}
    }>
       <span className='arrow'>{this.state.date ? '\u2191' : ' \u2193'}</span>
    <span>date</span>
    </div> </div>
)
elements.push(element); 
}
 
                                                                
return (
       
 <div className="Search_Panel">
<div className='search_header'>search panel</div>

{elements}

<div className='btn' onClick={()=>this.search(firm)}>search</div>
</div>

)
}
}

Search_Panel.propTypes = {
entity:PropTypes.string.isRequired,
firm:PropTypes.array.isRequired,
history:PropTypes.object.isRequired,
location:PropTypes.object.isRequired,
price:PropTypes.array,
};

export default Search_Panel;

    