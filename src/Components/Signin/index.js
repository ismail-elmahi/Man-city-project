import React, { Component } from 'react';
import FormField from '../ui/FormField';
import { validDate } from '../ui/misc';
import {firebase} from '../../firebase'

class SignIn extends Component {


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
            },
            password: {
                element:'input',
                value:'',
                config: {
                    name:'password_input',
                    type:'password',
                    placeholder:'Enter your password',
                },
                validation: {
                    required: true
                },
                valid:true,
                validationMessage:''
            }
        }
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
      firebase.auth()
      .signInWithEmailAndPassword(
          dataToSubmit.email,
          dataToSubmit.password
      ).then(() => {
          this.props.history.push('/dashboard')
      }).catch(error => {
          this.setState({
              formError: true
          })
      }) 
   }else {
       this.setState({
           formError: true
       })
   }
}

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

    render() {
        return (
            <div className="container">
                <div className="signin_wrapper" style={{margin:'100px'}}>
                    <form onSubmit={(event)=> this.submitForm(event)}>
                        <h2>Please Login</h2>

                        <FormField
                            id='email'
                            formData={this.state.formData.email}
                            change={(element) => this.updateForm(element)}
                        />
                        <FormField
                            id='password'
                            formData={this.state.formData.password}
                            change={(element) => this.updateForm(element)}
                            />

                            {
                                this.state.formError ? 
                                <div className="error_label">Something wrong, try again</div>
                                : null
                            }

                     <button onClick={(event) => this.submitForm(event)} className="button_enroll">Log in</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default SignIn;