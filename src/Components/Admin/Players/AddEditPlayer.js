import React, { Component } from 'react';
import AdminLayout from '../../../Hoc/AdminLayout';
import FormField from '../../ui/FormField';
import {validDate} from '../../ui/misc';

import Fileuploader from '../../ui/Fileuploader';
import {firebasePlayers, firebaseDb, firebase} from '../../../firebase';


class AddEditPlayer extends Component {
   
    state = {
        playerId: '',
        formType: '',
        formError: false,
        formSuccess: '',
        defaultImg: '',
        formData:{
            name: {
                element:'input',
                value:'',
                config: {
                    label:'Player Name',
                    name:'name_input',
                    type:'text',
                },
                validation: {
                    required: true,
                },
                valid:true,
                validationMessage:'',
                showlabel: true
            },
            lastname: {
                element:'input',
                value:'',
                config: {
                    label:' Player Last name',
                    name:'name_input',
                    type:'text',
                },
                validation: {
                    required: true,
                },
                valid:true,
                validationMessage:'',
                showlabel: true
            },
            number: {
                element:'input',
                value:'',
                config: {
                    label:'Player Number',
                    name:'number_input',
                    type:'text',
                },
                validation: {
                    required: true,
                },
                valid:true,
                validationMessage:'',
                showlabel: true
            },
            position: {
                element:'select',
                value:'',
                config: {
                    label:'Select a position',
                    name:'select_position',
                    type:'select',
                    options: [
                        {key:'Keeper', value:'Keeper'},
                        {key:'Defence', value:'Defence'},
                        {key:'Midfield', value:'Midfield'},
                        {key:'Striker', value:'Striker'},                      
                    ]
                },
                validation: {
                    required: true,              
                },
                valid:true,
                validationMessage:'',
                showlabel: true
            },
            image: {
                element: 'image',
                value: '',
                validation: {
                    required: true, 
                },
                valid: false
            }  
        }
        }
 

    updateFields = (player,playerId,formType,defaultImg) => {
    const newformData = {...this.state.formData}
    for(let key in newformData){
    newformData[key].value = player[key]
    newformData[key].valid = true
}
 
    this.setState({
        playerId,
        defaultImg,
        formType,
        formData: newformData
    })
   
}

componentDidMount() {
    const playerId =  this.props.match.params.id;
    if(!playerId){
        this.setState({
            formType: 'Add Player'
        })
    }else{
        firebaseDb.ref(`players/${playerId}`).once('value')
        .then( snapshot => {
            const playerData = snapshot.val();
            firebase.storage().ref('player')
            .child(playerData.image).getDownloadURL()
            .then(url => {            
                this.updateFields(playerData,playerId,'Edit player',url)              
            }).catch((e) => {
                this.updateFields({
                    ...playerData,
                    image:''
                },playerId,'Edit player','')
            })
        })
    }

     
}

updateForm(element, content=''){
            // This how we can copy the state 
           const newFormdata  = {...this.state.formData};
           const newElement = {...newFormdata[element.id]};
    if(content === ''){
        newElement.value = element.event.target.value;
    }else{
        newElement.value=content
    }
           
          // here we call the func from misce to validate the value
           let validData = validDate(newElement)
           newElement.valid = validData[0];
           newElement.validationMessage = validData[1];
     
           newFormdata[element.id] = newElement;
           // update the state with new values 
           this.setState({
               formError: false,
               formData : newFormdata
           })
        }

        successForm = (message) =>{
            this.setState({
                formSuccess:message
            });
            setTimeout(() => {
                this.setState({
                    formSuccess: ''
                })
            },2000)
        }

            // This is how to submite data
submitForm(event) {

            // Here how we can copy the state in the datatosubmite object
            // After click the button
        event.preventDefault();
        let dataToSubmit = {} ;
        let formIsValid = true;

        for(let key in this.state.formData){
            dataToSubmit[key] = this.state.formData[key].value;
            formIsValid = this.state.formData[key].value && formIsValid
        }


        if(formIsValid) {
           if(this.state.formType === 'Edit player'){
            firebaseDb.ref(`players/${this.state.playerId}`)
            .update(dataToSubmit).then(() => {
                 this.successForm('Update seccessfuly');
                
            }).catch( err => {
                this.setState({
                    formError:true
                })
            })
           }else{
                
              firebasePlayers.push(dataToSubmit).then(() => {
                  this.props.history.push('/admin_players')
              }).catch((err) => {
                  this.setState({
                      formError: true
                  })
              })   
           }
        }else {
            this.setState({
                formError: true
            })
        }
}

    resetImage = () => {
    const newformData = {...this.state.formData}
    newformData['image'].value = '';
    newformData['image'].valid = false;

    this.setState({
        defaultImg:'',
        formData: newformData
    })

    }

    storedFilename = (filename) => {
    this.updateForm({id:'image'},filename)
    }

   
    render() {
       
        return (
            <AdminLayout>
                <div className="editplayers_dialog_wrapper">
                 <h2>
                     {this.state.formType}
                 </h2>
                 <div>
                     <form onSubmit={(event) => this.submitForm(event)}>
                     
                    <Fileuploader
                     dir="player"
                     tag="Player image"
                     defaultImg= {this.state.defaultImg}
                     defaultImgName = {this.state.formData.value}
                     resetImage = {() => this.resetImage()}
                     filename = {(filename) => this.storedFilename(filename)}
                    />
                     
                     <FormField
                            id='name'
                            formData={this.state.formData.name}
                            change={(element) => this.updateForm(element)}
                      />
                      <FormField
                            id='lastname'
                            formData={this.state.formData.lastname}
                            change={(element) => this.updateForm(element)}
                      />
                      <FormField
                            id='number'
                            formData={this.state.formData.number}
                            change={(element) => this.updateForm(element)}
                      />
                      <FormField
                            id='position'
                            formData={this.state.formData.position}
                            change={(element) => this.updateForm(element)}
                      />

                <div className="success_label">
                    {this.state.formSuccess}
                </div>
                {this.state.formError ? 
                <div className="error_label">
                    Something is wrong
                </div>
                : ''
                 }

                <div className="admin_submit">
                    <button onClick={(event) => this.submitForm(event)}>
                        {this.state.formType}   
                    </button>

                </div>

                     </form>
                 </div>
                 </div>   
            </AdminLayout>
        );
    }
}

export default AddEditPlayer;