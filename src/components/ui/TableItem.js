import React,{Component} from 'react';
import  '../../../css/components/TableItem.scss';
const TableItem=(props)=>{
   // alert(JSON.stringify(props));
    return(<div className={props.id}>{props.defaultValue}</div>)
};
export default TableItem;


