import React from 'react';
import {Tag} from '../../ui/misc';
import Blocks from './Blocks';
const MatchesHome = () => {
    return (
        <div className="home_matches_wrapper">
            <div className="container">
                <Tag 
                bck="#0e1731"
                size="50px"
                color="#ffffff"
                
                >
                Matches
                </Tag>

                <Blocks />

             <Tag 
             bck="#ffffff"
             color="#0e1731"
             size="22px"
             link ={true}
             linkto="the_team"
             >
                 See All Matches 
             </Tag>
            </div>
        </div>
    );
};

export default MatchesHome;