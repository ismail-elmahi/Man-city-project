import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {firebasePlayers, firebaseMatches} from '../../firebase';
import {firebaseLooper, reverseArray} from '../ui/misc';
import LeagueTable from './table';
import MatchesList from './MatchesList'
class TheMatches extends Component {
   
    state = { 
        loading : true,
        matches: [] ,
        filterMatches: [],
        playedFilter: 'All',
        resultFilter: 'All'
    }
   componentDidMount(){
       firebaseMatches.once('value').then((snapshot) => {
           const matches= firebaseLooper(snapshot);

           this.setState({
               loading: false,
               matches: reverseArray(matches),
               filterMatches: reverseArray(matches)
           })
       })
   }

   showPlayed = (played) => {
       const list = this.state.matches.filter((match) => {
           return match.final === played;
       });

       this.setState({
           filterMatches: played === 'All' ? 
           this.state.matches : list,
           playedFilter: played,
           resultFilter: 'All'
       })
   }

   showResults = (result) => {
    const list = this.state.matches.filter((match) => {
        return match.result === result;
    });

    this.setState({
        filterMatches: result === 'All' ? 
        this.state.matches : list,
        playedFilter: 'All',
        resultFilter: result
    })
   }

    render() {
        const state = this.state;
        return (
            <div className="the_matches_container">
                <div className="the_matches_wrapper">
                    <div className="left"> 
                        <div className="match_filters">
                             <div className="match_filters_box">
                                 <div className="tag">
                                    Show matches
                                 </div>
                                 <div className="cont">
                                    <div className={`option ${this.state.playedFilter === 'All' ? 'active' : ''}`}
                                    onClick={() => this.showPlayed('All')}
                                    >
                                        All
                                    </div>
                                    <div className={`option ${this.state.playedFilter === 'Yes' ? 'active' : ''}`}
                                    onClick={() => this.showPlayed('Yes')}
                                    >
                                        Played
                                    </div>
                                    <div className={`option ${this.state.playedFilter === 'No' ? 'active' : ''}`}
                                    onClick={() => this.showPlayed('No')}
                                    >
                                        Not Played
                                    </div>
                                 </div>
                             </div>

                             <div className="match_filters_box">
                                 <div className="tag">
                                    Results Games 
                                 </div>
                                 <div className="cont">
                                    <div className={`option ${this.state.resultFilter === 'All' ? 'active' : ''}`}
                                    onClick={() => this.showResults('All')}
                                    >
                                        All
                                    </div>
                                    <div className={`option ${this.state.resultFilter === 'W' ? 'active' : ''}`}
                                    onClick={() => this.showResults('W')}
                                    >
                                        W
                                    </div>
                                    <div className={`option ${this.state.resultFilter === 'L' ? 'active' : ''}`}
                                    onClick={() => this.showResults('L')}
                                    >
                                        L
                                    </div>
                                    <div className={`option ${this.state.resultFilter === 'D' ? 'active' : ''}`}
                                    onClick={() => this.showResults('D')}
                                    >
                                        D
                                    </div>
                                 </div>
                             </div>
                        </div>
                        <MatchesList
                         matches={state.filterMatches}
                        />
                    </div>
                    <div className="right">
                        <LeagueTable />
                    </div>
                </div>
            </div>
        );
    }
}

export default TheMatches;