import React, { Component } from 'react';
import { firebase } from '../../firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import FileUploader from 'react-firebase-file-uploader';

class Fileuploader extends Component {
   
    state = {
        name: '',
        isUploading: false,
        fileURL: '',
    }

    handleruploadStart = () => {
        this.setState({
            isUploading: true
        })
    }
    handleruploadError = () => {
        this.setState({
            isUploading : false
        })
    }
    handleruploadSuccess= (filename) => {
        console.log(filename)
    this.setState({
        name:filename,
        isUploading: false
    });
    // this is how we get the URL from firebase and we 
    // searching on firebase for image using the filename that we have 
    //  to show the pics to user  

    firebase.storage().ref(this.props.dir).child(filename)
    .getDownloadURL().then(url => {      
        this.setState({fileURL:url})
    })
// here we send the name of file to component addplayer 
    this.props.filename(filename)
    }

 

/* This static is loading first before everything 
so this static is checking if the defualtImg is true or false,
and always return something   
*/  
      static getDerivedStateFromProps(props, state) {

        
        if(props.defaultImg){
            // so if defaultImg is true we'll return new state
            // and replacing the old state 
            
            return state = {
                name: props.defaultImgName,
                fileURL: props.defaultImg,
                
            }

        }

        return null;
    }
   
    uploadAgain = () => {
        this.setState({
            name: '',
            isUploading: false,
            fileURL: '',
        });
        this.props.resetImage();
    }
     
   
    render() {
        return (
            <div>
                {/* here we're checking the url if we have a url we'll hide input
                 if we don't we'll show the input to uploade image */}
                {!this.state.fileURL ?
                 <div>
                    <div className="label_inputs">{this.props.tag}</div>
                    <FileUploader
                    accept="image/*"
                    name="image"
                    randomizeFilename
                    // this how to connect to firebase, 
                    //this props to create a folder to puts all the images 
                    storageRef= {firebase.storage().ref(this.props.dir)}
                    onUploadStart={this.handleruploadStart}
                    onUploadError={this.handleruploadError}
                    onUploadSuccess={this.handleruploadSuccess}

                    />
                 </div>                
                 :null
            }

            { this.state.isUploading ? 
                <div className="progress"
                style={{textAlign:"center", margin:"30px 0"}}
                > 
                <CircularProgress 
                style={{color:"#98c6e9"}}
                thickness={7}
                />
                </div>    
                :null
            }
             {
                this.state.fileURL ? 
                <div className="image_upload_container">
                <img 
                style={{
                    width:"100%"
                }}
                src={this.state.fileURL}
                alt={this.state.name}
                />
                <div className="remove" onClick={() => this.uploadAgain()}>
                    Remove
                </div> 
            </div>  
            :null
            }
           
        </div>
        );
    }
}

export default Fileuploader;