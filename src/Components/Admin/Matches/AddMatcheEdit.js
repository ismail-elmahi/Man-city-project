import React, { Component } from 'react';
import AdminLayout from '../../../Hoc/AdminLayout';
import FormField from '../../ui/FormField';
import {validDate} from '../../ui/misc';

import {firebaseTeams, firebaseDb, firebaseMatches} from '../../../firebase';
import {firebaseLooper} from '../../ui/misc';

class AddMatcheEdit extends Component {

    state = {
        matchId: '',
        formType: '',
        formError: false,
        formSuccess: '',
        teams: [],
        formData: {
            date: {
                element:'input',
                value:'',
                config: {
                    label:'Event Date',
                    name:'date_input',
                    type:'date',
                },
                validation: {
                    required: true,
                },
                valid:true,
                validationMessage:'',
                showlabel: true
            },  
            local: {
                element:'select',
                value:'',
                config: {
                    label:'Select a local team',
                    name:'select_local',
                    type:'select',
                    options: []
                },
                validation: {
                    required: true,              
                },
                valid:true,
                validationMessage:'',
                showlabel: false
            },
            resultLocal: {
                element:'input',
                value:'',
                config: {
                    label:'result Local',
                    name:'result_local_input',
                    type:'text',
                },
                validation: {
                    required: true,
                },
                valid:true,
                validationMessage:'',
                showlabel: false
            },
            away: {
                element:'select',
                value:'',
                config: {
                    label:'Select a away team',
                    name:'select_away',
                    type:'select',
                    options: []
                },
                validation: {
                    required: true,              
                },
                valid:true,
                validationMessage:'',
                showlabel: false
            },
            resultAway: {
                element:'input',
                value:'',
                config: {
                    label:'result Away',
                    name:'result_away_input',
                    type:'text',
                },
                validation: {
                    required: true,
                },
                valid:true,
                validationMessage:'',
                showlabel: false
            },
            referee: {
                element:'input',
                value:'',
                config: {
                    label:'Referee',
                    name:'referee_input',
                    type:'text',
                },
                validation: {
                    required: true,
                },
                valid:true,
                validationMessage:'',
                showlabel: true
            },
            stadium: {
                element:'input',
                value:'',
                config: {
                    label:'Stadium',
                    name:'stadium_input',
                    type:'text',
                },
                validation: {
                    required: true,
                },
                valid:true,
                validationMessage:'',
                showlabel: true
            },
            result: {
                element:'select',
                value:'',
                config: {
                    label:'Team result',
                    name:'select_result',
                    type:'select',
                    options: [
                        {key:'w', value:'w'},
                        {key:'L', value:'L'},
                        {key:'D', value:'D'},
                        {key:'a/n', value:'a/n'},
                    ]
                },
                validation: {
                    required: true,              
                },
                valid:true,
                validationMessage:'',
                showlabel: true
            },  
            final: {
                element:'select',
                value:'',
                config: {
                    label:'Game Played',
                    name:'select_played',
                    type:'select',
                    options: [
                        {key:'Yes', value:'Yes'},
                        {key:'No', value:'No'},
                       
                    ]
                },
                validation: {
                    required: true,              
                },
                valid:true,
                validationMessage:'',
                showlabel: true
            },  
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
    updateFiels(match, teamOptions, teams, type, matchId){
        const newFormData = {
            ...this.state.formData
        }
// here update the state 
        for(let key in newFormData){
            if(match){
                // put the info of the match in the inputs and select
                newFormData[key].value = match[key];
                newFormData[key].valid = true; 
            }
            // put the teams to the select options
            if(key === 'local' || key === 'away') {
                newFormData[key].config.options = teamOptions;
            }
        }
        this.setState({
            matchId,
            formType:type,
            formData:newFormData,
            teams
        })
    }

    componentDidMount(){
        /*
        just to remamber when we use routers it's 
        give us a props that we can feteching 
        any thing on browser like path ... 
        */
        const matchId = this.props.match.params.id;
        // this func to get data from firebase
        const getTeams = (match,type) => {
            firebaseTeams.once('value').then(snapshoot => {
                const teams = firebaseLooper(snapshoot);
                const teamOptions = [];
    // convert data from object to array to put it in a select option
                snapshoot.forEach((childsnapshoot) => {
                    teamOptions.push({
                        key:childsnapshoot.val().shortName,
                        value:childsnapshoot.val().shortName,
                    })
                });
                this.updateFiels(match, teamOptions, teams, type, matchId)
            })
        }


        if(!matchId){
            getTeams(false, 'Add Match')
        }else{
            // searching for a match with a specific id 
            firebaseDb.ref(`matches/${matchId}`).once('value')
            .then((snapshoot) => {
                const match = snapshoot.val();
                getTeams(match, 'Edit Match')
            })
        }
    }

// show the successful message  
successForm(message) {
        this.setState({
            formSuccess:message
        });
        setTimeout(() => {
            this.setState({
                formSuccess:''
            });
        }, 2000);
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

   this.state.teams.forEach((team) => {
       if(team.shortName === dataToSubmit.local){
           dataToSubmit['localThmb'] = team.thmb
       }
   })

   if(formIsValid) {
       // update the match
      if(this.state.formType === 'Edit Match'){
          firebaseDb.ref(`matches/${this.state.matchId}`)
          .update(dataToSubmit).then(() =>{
              this.successForm('Update successfuly');
          }).catch((e) => {
              this.setState({
                formError: true
              })
          })
      }else{
          // add match 

          firebaseMatches.push(dataToSubmit).then(()=>{
              this.props.history.push('/admin_matches')
          }).catch((e) => {
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


    render() {
        return (
            <AdminLayout>
                <div className="editmatch_dialog_wrapper">
                    <h2>
                        {this.state.formType}
                    </h2>
                    <div>
                        <form onSubmit={(event) => this.submitForm()}>
                        <FormField
                            id='date'
                            formData={this.state.formData.date}
                            change={(element) => this.updateForm(element)}
                          />
                            <div className="select_team_layout">
                                <div className="label_inputs">Local</div>
                                <div className="wrapper">
                                    <div className="left">
                                      <FormField
                                        id='local'
                                        formData={this.state.formData.local}
                                        change={(element) => this.updateForm(element)}
                                    />
                                    </div>
                                    <div>
                                    <FormField
                                        id='resultLocal'
                                        formData={this.state.formData.resultLocal}
                                        change={(element) => this.updateForm(element)}
                                    />
                                </div>
                        </div>
                </div>

                <div className="select_team_layout">
                        <div className="label_inputs">Away</div>
                                <div className="wrapper">
                                    <div className="left">
                                    <FormField
                                        id='away'
                                        formData={this.state.formData.away}
                                        change={(element) => this.updateForm(element)}
                                    />                                 
                                    </div>
                                    <div>      
                                    <FormField
                                        id='resultAway'
                                        formData={this.state.formData.resultAway}
                                        change={(element) => this.updateForm(element)}
                                    />
                                    </div>
                        </div>
                </div>


                <div className="split_fields">
                    <FormField
                        id='referee'
                        formData={this.state.formData.referee}
                        change={(element) => this.updateForm(element)}
                    />
                    <FormField
                        id='stadium'
                        formData={this.state.formData.stadium}
                        change={(element) => this.updateForm(element)}
                    />
                </div> 
                <div className="split_fields last">
                    <FormField
                        id='result'
                        formData={this.state.formData.result}
                        change={(element) => this.updateForm(element)}
                    />
                    <FormField
                        id='final'
                        formData={this.state.formData.final}
                        change={(element) => this.updateForm(element)}
                    />
                    
                </div>

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

export default AddMatcheEdit;