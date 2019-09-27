import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';
import FormField from '../../ui/FormField';
import { validDate } from '../../ui/misc';
import {firebasePromotion} from '../../../firebase';


class Enroll extends Component {

    state = {
        formError : false,
        formSuccess: ' ',
        formData: {
            email: {
                element:'input',
                value:'',
                config: {
                    name:'email_input',
                    type:'email',
                    placeholder:'Enter your email',
                },
                validation: {
                    required: true,
                    email:true
                },
                valid:true,
                validationMessage:''
            }
        }
    }

// validation input 
    updateForm(element) {
        // This how we can copy the state 
       const newFormdata  = {...this.state.formData};
       const newElement = {...newFormdata[element.id]};

       newElement.value = element.event.target.value;
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

    resetFormSuccess(type){
        const newFormdata  = {...this.state.formData};
        for(let key in newFormdata){
            newFormdata[key].value= '';
            newFormdata[key].valid= false;
            newFormdata[key].validationMessage = '';
        }
        
        this.setState({
            formError: false,
            formData:newFormdata,
            formSuccess: type ? 'Congratulation' : 'already on database'
        });
        this.successMessage();
    }

    successMessage(){
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
            firebasePromotion.orderByChild('email').equalTo(dataToSubmit.email).once("value")
            .then((snapshot) => {
                // here we're cheking the email if it's already exiset 
                if(snapshot.val() === null){
                    firebasePromotion.push(dataToSubmit);
                    this.resetFormSuccess(true);
                }else{
                    this.resetFormSuccess(false);
                }
            })
            
        }else {
            this.setState({
                formError: true
            })
        }
    }


    render() {
        return (
            <Fade>
                <div className="enroll_wrapper">
                    <form onSubmit={(event) => this.submitForm(event)}>
                        <div className="enroll_title">
                            Enter your email
                        </div>
                        <div className="enroll_input">
                            {/* we send this props to the formfieeld component */}
                            <FormField
                            id='email'
                            formData={this.state.formData.email}
                            change={(element) => this.updateForm(element)}
                            />
                            {
                                this.state.formError ? 
                                <div className="error_label">Something wrong, try again</div>
                                : null
                            }
                            <div className="success_label">{this.state.formSuccess}</div>
                            <button onClick={(event) => this.submitForm(event)} className="button_enroll">Enroll</button>
                            <div className="enroll_discl">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
                            </div>
                        </div>
                    </form>
                </div>
            </Fade>
        );
    }
}

export default Enroll;