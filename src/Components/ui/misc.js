import React from 'react';
import { Link } from 'react-router-dom';


export const Tag = (props) => {

    const template = <div
    style={{
        background: props.bck,
        fontSize: props.size,
        color: props.color,
        padding: '5px 10px',
        fontFamily: 'Righteous',
        display:'inline-block',
        // we do this props to add a specail styel to the component 
        ...props.add
       

    }}
    >
        {props.children}
    </div>
    
    if(props.link) {
        return (
            <Link to={props.linkto}>
               {template}
            </Link>
        )
    }else {
        return template 
    }    
}
// this function to convert data object in the server to array
export const firebaseLooper = (snapshot) => {
    let data = [];
    snapshot.forEach((childSnapshot) => {
        data.push({
            ...childSnapshot.val(),
            id:childSnapshot.key
        })
    });

    return data 
}
// this function to revers data from last to first
export const reverseArray = (actualArray) => {
let reversedArray = [];

for(let i = actualArray.length-1; i>=0; i--) {
    reversedArray.push(actualArray[i])
}
return reversedArray;
}

// This func to validate the input
export const validDate = (element) => {

    let error = [true, ''];

    if(element.validation.email) {
        const valid = /\S+@\S+\.\S+/.test(element.value);
        const message = `${!valid ? 'Must be a valid email' : ''}`;
        error = !valid ? [valid,message] : error;
    }

    if(element.validation.required) {
        const valid = element.value.trim() !== '';
        const message = `${!valid ? 'This field is required' : ''}`;
        error = !valid ? [valid,message] : error
    }
    return error;
}