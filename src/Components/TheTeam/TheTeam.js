import React, { Component } from 'react';
import PlayerCard from '../ui/PlayerCards'
import Fade from 'react-reveal/Fade';
import Stripes from '../../Resources/images/stripes.png';
import { firebasePlayers, firebase } from '../../firebase';
import {firebaseLooper} from '../ui/misc';
import { Promise } from 'core-js';

class TheTeam extends Component {
    
    state = {
        loading: true,
        players: [],
    }

    componentDidMount() {
// This how we fetching players from firebase 
        firebasePlayers.once('value').then((snapshot) => {
            const players = firebaseLooper(snapshot);
            let promises = [];
            for(let key in players) {
               promises.push(
                   // here we get the url from storge using promise
                   new Promise((resolve,reject) => {
                    firebase.storage().ref('player')
                    .child(players[key].image).getDownloadURL()
                    .then((url) => {
                      players[key].url = url;
                      resolve();  
                    })
                   })
               )
            }

            Promise.all(promises).then(() => {
                this.setState({
                    loading: false,
                    players
                })
            })

        })
    }
    
// This how we show the players cards by category 
    showPlayersByCategory= (category) => (
        this.state.players ? 
            this.state.players.map((player,i) => {
                return player.position === category ? 
                    <Fade left delay={i*20} key={i}>
                        <div className="item">
                           <PlayerCard
                            number={player.number}
                            name={player.name}
                            lastname={player.lastname}
                            bck={player.url}                    
                            />
                         </div>
                    </Fade>
                :null
            })
        : null
    )

    render() {
  
        return (
            <div className="the_team_container"
            style={{
                background:`url(${Stripes}) repeat`
            }}
            >
                {!this.state.loading ? 
                    <div>
                    <div className="team_category_wrapper">
                        <div className="title">Keppers</div>
                        <div className="team_cards">
                        {this.showPlayersByCategory('Keeper')}
                        </div>                      
                    </div>

                    <div className="team_category_wrapper">
                        <div className="title">Defences</div>
                        <div className="team_cards">
                        {this.showPlayersByCategory('Defence')}
                        </div>
                    </div> 
                    
                    <div className="team_category_wrapper">
                        <div className="title">Midfields</div>
                        <div className="team_cards">
                        {this.showPlayersByCategory('Midfield')}
                        </div>                      
                    </div> 
                    
                    <div className="team_category_wrapper">
                        <div className="title">Strikers</div>
                        <div className="team_cards">
                        {this.showPlayersByCategory('Striker')}
                        </div>                      
                    </div> 
                </div>
                
                    :null
                } 
                
                 
                 
            </div>
        );
    }
}

export default TheTeam;