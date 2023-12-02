import React, { useEffect, useState } from "react";
import './CreateSample.css';
import { NavLink } from "react-router-dom";
import { postSample } from "../api/Sample";
import { NEW_SAMPLE } from "../api/global";

/**
 * Defines a component for a button that will create a new empty sample and send 
 * it to the API, this will also redirect user to the new samples respective
 * edit page 
 * 
 * @returns {React.JSX.Element} React component for the create sample button.
 */
const CreateSampleButton = () => {
    /**
     * Uppon clicking the final component, this function will execute and send
     * a POST request to the API who's body contains a default empty new song
     * sample.
     */
    const newSample = () => {
        postSample(
            NEW_SAMPLE()
        ).then((sample) => {
            localStorage.setItem('snew', JSON.stringify(sample));
        })
    }
    return (
        <>
            <NavLink onClick={newSample} className="full-button" to = '/edit/new'
                     activeClassName="active">
                Create Sample
            </NavLink>
        </>
    );
}

/**
 * A simple wrapper component that exists to contain the sample button and 
 * enables styling the button. It does not have any other function.
 * 
 * @returns {React.JSX.Element} Wrapper component for CreateSampleButton.
 */
const CreateSample = () => {
    return (
        <div className="CreateSample">
            <CreateSampleButton />
        </div>
    );
}

export default CreateSample;