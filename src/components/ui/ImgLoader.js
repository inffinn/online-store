import React, {Component} from 'react'
import  '../../../css/components/ImgLoader.scss';
import fetch from 'isomorphic-fetch'
import {PropTypes} from 'prop-types';

        class ImgLoader extends Component {
    constructor(props) {
        super(props);
        props.defaultValue ?
                this.state = {
                    file: null,
                    name: props.defaultValue,
                    status: null
                } :
                this.state = {
                    file: null,
                    name: null,
                    status: null
                }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }
    onFormSubmit(e) {
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file)
    }

    getValue() {
        return  this.state.name;
    }
    upload_result = (response) => {
        this.setState({name: response.filename, status: 'load done!'});
    }
    cancel_result = (response) => {

        //alert(JSON.stringify(response))
    }
    parseResponse = response => {
        return response.json()
    }
    logError = error => console.error(error)
    onChange(e) {
        this.setState({file: e.target.files[0], name: null, status: null})
    }
componentWillUpdate( nextProps,  nextState){
   // alert(JSON.stringify(nextState))
}
    onCancel() {
        this.setState({file: null, name: null, status: null})
        /*     fetch('/api/img/delete', {method: 'POST', body: JSON.stringify({photo:this.state.name}),headers: {'Content-Type': 'application/json'}})
         .then(this.parseResponse).then(this.cancel_result)
         .catch(this.logError)
         */
    }
    fileUpload(file) {
        if (!file) {
            alert('no file selected!');
            return;
        }
      
        let formData = new FormData();
        // alert('loading')
        this.setState({status: 'loading...'})
        formData.append('photo', file)
        fetch('/api/img', {method: 'POST', body: formData})//,mode:'no-cors'
                .then(this.parseResponse).then(this.upload_result)
                .catch(this.logError)

    }

    render() {
        //  let name=()=>   { if (this.state.name) return  (<input type="text" readonly value={this.state.name}/>)}
        let status = () => {
            if (this.state.status)
                return  (<label className="Status">{this.state.status}</label>)
        }

        if (!this.state.name) {
            return (
                    <div className="ImgLoader">
                        {status()}
                        <form onSubmit={this.onFormSubmit} encType="multipart/form-data">                                               
                            <input className="Button" type="file" className="file" name="photo" onChange={this.onChange} />
                       <div>      <button className="Button" type="submit">Upload</button></div> 
                        </form>
                    </div>
                    )
        } else {
            return (
                    <div className="ImgLoader">
                         {status()}
                        <form onSubmit={this.onFormSubmit} encType="multipart/form-data">
                            <img src={this.state.name} alt="Фото"/>                                      
                            <div>      <label className="Button" onClick={() => this.onCancel()}>Cancel img</label></div> 
                        </form>
                    </div>
                    )
        }
    }
}
export default ImgLoader;
    
ImgLoader.propTypes = {
defaultValue:PropTypes.string,
id:PropTypes.string.isRequired
};
