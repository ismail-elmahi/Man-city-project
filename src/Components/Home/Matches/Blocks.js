import React, { Component } from 'react';
import {firebaseMatches} from '../../../firebase';
import {firebaseLooper, reverseArray} from '../../ui/misc';
import MatchesBlock from '../../ui/Matches_Block';
import Slide from 'react-reveal/Slide';

class Blocks extends Component {
  
    state={
        matches: []
    }
   
    // get Data from server in this case we use firebase 
    // I use limitToLast to get the last 6 matches 
    componentDidMount() {
        firebaseMatches.limitToLast(6).once('value').then((snapshot) => {
            const matches = firebaseLooper(snapshot);
           this.setState({
               matches: reverseArray(matches)
           })
        });
    }
// This fun to show matches in the blocks
   showMatches = (matches) => (
       matches ? 
       matches.map((match) => (
           <Slide bottom key={match.id}>
        <div className="item">
        <div className="wrapper">
            <MatchesBlock match={match} />
        </div>
    </div>
    </Slide>
       ))
       :null
   )

    render() {
        console.log(this.state)
        return ( 
            <div className="home_matches">
                {this.showMatches(this.state.matches)}
            </div>
        );
    }
}

export default Blocks;