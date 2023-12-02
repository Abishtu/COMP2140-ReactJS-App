import React from 'react'
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import './Header.css';

/**
 * Simple component to define header title and its styling
 * 
 * @returns {React.JSX.Element} React component of the header title
 */
const Title = () => {
    return (
        <div className='Title'>
            <h2>
                <NavLink className="HomeLink" to='/' activeClassName="active"
                         exact>
                    SongTrax
                </NavLink>
            </h2>
        </div>
    );
}

/**
 * Simple component to define header tagline and its styling
 * 
 * @returns {React.JSX.Element} React component of the header tagline
 */
const TagLine = () => {
    return (
        <div className='TagLine'>
            <span>
                Create & Share Location Based Music Samples!
            </span>
        </div>
    )
}

/**
 * Simple component to define header and its styling
 * 
 * @returns {React.JSX.Element} React component of the header
 */
const Header = () => {
    return (
        <header className='Header'>
            <Title />
            <TagLine />
        </header>
    );
}

export default Header;