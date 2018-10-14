import Dialog from './Dialog';
import MyTable from './MyTable';
import Form from './Form'; // 
import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import { Katalog_menu_container} from '../Containers'
import '../../../css/components/Table_Panel.scss';
import {
Message_List_Container,
        Global_Search_Container
        } from '../Containers';
import Menu from '../ui/Menu';


class Table_Panel extends Component {
    constructor(props) {
        super(props);
        this.state = {position: 'relative'};

    }
    componentDidMount()
    {
        window.onscroll = () => this.func();
    }
    func() {
        var scrolled = window.pageYOffset || document.documentElement.scrollTop;
        let panel;
        panel = document.getElementsByClassName('Table_Panel');

        if (panel)
            if (scrolled > 250)
                this.setState({position: "fixed"})
            else
                this.setState({position: "relative"})
    }
    shouldComponentUpdate(nextProps, nextState)
    {
        if (this.props !== nextProps || this.state.position !== nextState.position)
            return 1;
        else
            return 0;
    }
    _search(e) {
        const needle = e.target.value.toLowerCase();
        this.props.onSearch(needle);
    }
    render() {
        let text = '';
        if (this.props.search)
            text = this.props.search;
        let style = {};
        if (this.state.position === 'fixed')
            style = {position: 'fixed', top: '0px'}
        if (this.state.position === 'relative')
            style = {position: 'relative', top: '0px'}
        let add;
        this.props.isAdmin ?
                add = (<div className="container">
                   <div onClick={() => this.props.history.push(`/${this.props.entity}/new/add`)}
                        className="btn">
                       add
                   </div>
               </div>) : add = '';
        return (
                <div className="Table_Panel_container">
                    <div className="Table_Panel" style={style}>
                        <div className="Table_PanelToolbar" >
                            <div className="container">
                                <Katalog_menu_container history={this.props.history} location={this.props.location}/>
                            </div>
                            {add}
                            <div className="container">
                                <div
                                    onClick={() => this.props.history.push(`/cart`)}
                                    className="btn">
                                    cart
                                </div>
                            </div>
                            <div className="container">
                                <div
                                    onClick={() => this.props.history.push(`/view_order`)}
                                    className="btn">
                                    orders
                                </div>
                            </div>
                            <div className="container">
                                <input className="search"
                                       placeholder="Search..." value={text}
                                       onChange={this._search.bind(this)}/>
                
                                <div className='global_search_container'> 
                                    <Global_Search_Container history={this.props.history} location={this.props.location}/></div>
                            </div>
                            <div className="x_container">
                                <div className='msg_container'> <Message_List_Container/></div>
                            </div>
                        </div>
                    </div>
                </div>
                );
    }
}

export default Table_Panel;
    
Table_Panel.propTypes = {
entity: PropTypes.string,
history: PropTypes.object,
isAdmin: PropTypes.bool,
location: PropTypes.object,
onSearch: PropTypes.func,
search: PropTypes.string
};