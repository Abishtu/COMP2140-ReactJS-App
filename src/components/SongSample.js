import React, { useEffect, useState, use } from "react";
import { BrowserRouter as Router, Route, 
         Routes, NavLink } from 'react-router-dom';
import './SongSample.css';
import { getSamples } from "../api/Sample";

/**
 * React component to display song sample details such as its name and
 * modified/addded time
 * 
 * @param {string} songName Name of the song 
 * @param {string} date Date song was added/modified
 * @returns {React.JSX.Element} A React component that displays song samples
 *                              details.
 */
const SongDetails = ({songName, date}) => {
    const dateTime = new Date(date);
    const doubleDigit = (number) => {
        return number > 9 ? ""+number : "0" + number;
    }

    const hours = doubleDigit(dateTime.getHours());
    const minutes = doubleDigit(dateTime.getMinutes());

    const time = dateTime.toLocaleTimeString('en-US', {
        hour: '2-digit', minute:'2-digit', formatMatcher: 'best fit'
    });
    const day = doubleDigit(dateTime.getDay());
    const month = dateTime.toLocaleString('default', { month: 'long' });
    const year = dateTime.getFullYear();

    return (
        <div className="SongDetails">
            <h3>{songName}</h3>
            <p>{time} on {day} {month} {year}</p>
        </div>
    );
}

/**
 * Defines a react component to enable users to navigate to the share page,
 * where they can share the song sample to a predefined list of locations.
 * 
 * @param {string} id unique id of the song sample 
 * @returns {React.JSX.Element} A React component that allows navigation to 
 *                              share page.
 */
const ShareButton = ({id}) => {
    return (
        <>
            <NavLink className="bright-button" to={`/share/${id}`} 
                     activeClassName="active">
                Share
            </NavLink>
        </>
    );
}

/**
 * Defines a react component to enable users to preview the song sample,
 * for now, it only changes the text to depending on if its pressed or not.
 * 
 * @param {string} id unique id of the song sample 
 * @returns {React.JSX.Element} A React component that allows navigation to 
 *                              share page.
 */
const PreviewButton = ({id}) => {
    const [ preview, setPreview ] = useState(false);
    return (
        <>
            <a onClick={() => setPreview(!preview)} href="#" className="button">
                {((preview) ? "Stop Preview" : "Preview")}
            </a>
        </>
    );
}

/**
 * Defines a react component to enable users to navigate to the edit page,
 * where they can edit the song sample.
 * 
 * @param {string} id unique id of the song sample 
 * @returns {React.JSX.Element} A React component that allows navigation to 
 *                              share page.
 */
const EditButton = ({id}) => {
    return (
        <>
            <NavLink className="bright-button" to={`/edit/${id}`} 
                     activeClassName="active">
                Edit
            </NavLink>
        </>
    );
}

/**
 * Defines a react component to arrange the share, preview and edit buttons and
 * style them appropriately.
 * 
 * @param {string} id unique id of the song sample 
 * @returns {React.JSX.Element} A React component that organises navigation and
 *                              interaction buttons.
 */
const SongSampleButtons = ({id}) => {
    return (
        <div className="SongSampleButtons">
            <ShareButton id={id}/>
            <PreviewButton id={id}/>
            <EditButton id={id}/>
        </div>
    );
}

/**
 * Defines a React component to list out and display the various song samples
 * added to the api.
 * 
 * @returns {React.JSX.Element} A React component for a song sample item.
 */
const SongSample = () => {
    const [data, setData] = useState();
    useEffect(() => {
        getSamples().then((result) => {
            localStorage.setItem('samples', JSON.stringify(result));
            result.forEach((sample) => {
            localStorage.setItem(`s${sample.id}`, JSON.stringify(sample));
            setData(JSON.parse(localStorage.getItem('samples')));
            });
        });
    }, []);
    
    return (
        <>
            {
               ((data) ? 
                data.map((sample) => {
                    if (sample.id !== undefined){
                        return (
                            <div className="SongSample">
                                <SongDetails songName={sample.name} 
                                            date={sample.datetime}
                                            key={sample.id}/>
                                <SongSampleButtons id={sample.id}/>
                            </div>
                        );
                    }
                }) : "")
            }
        </>
    );
}

export {SongSample, SongDetails, ShareButton, PreviewButton};