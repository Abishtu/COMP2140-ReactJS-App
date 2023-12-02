import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, 
         Route, Routes } from 'react-router-dom';
import Page from './pages/Page';
import { SongSample } from './components/SongSample';
import CreateSample from './components/CreateSample';
import { EditSample } from './components/EditSample';
import React, { useEffect, useState } from 'react';
import { getSamples } from "./api/Sample.js"
import API from './api/global';
import { getLocations } from './api/Location';
import LocationRow from './components/ShareSample';

/**
 * Defines the react component of the whole app.
 * @returns {React.JSX.Element} React component of the whole app
 */
function App() {
  const [sampletolocation, setSampleToLocation] = useState([]);
  const [updateData, setUpdateData] = useState(true);

  const newSampleTemplate = {
    key: 'new',
    type: 'type',
    name: 'name',
    recording_data: JSON.stringify([
        {'B':[false, false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false]},
        {'A':[false, false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false]},
        {'G':[false, false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false]},
        {'F':[false, false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false]},
        {'E':[false, false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false]},
        {'D':[false, false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false]},
        {'C':[false, false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false]},
    ]),
    api_key: API().KEY
  };

  /**
   * Simple function to fetch samples from the api and add them to localStorage
   * to act as cache access, this will be run once upon rendering the page.
   */
  const fetchExistingSamples = () => {
    getSamples().then((result) => {
      localStorage.setItem('samples', JSON.stringify(result));
      result.forEach((sample) => {
        localStorage.setItem(`s${sample.id}`, JSON.stringify(sample));
      });
    });
  }

  useEffect(() => {
    fetchExistingSamples();
  }, []);

  useEffect(() => {
    getLocations().then((result) => {
      localStorage.setItem('locations', JSON.stringify(result));
    });
  }, []);


  let samplePage = [<SongSample/>, <CreateSample />];

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<Page title='Your Song Samples' 
                                pageComponents={samplePage}/>}/>
          <Route path="/edit/:id" element={<EditSample />}/>
          <Route path="/share/:id" element={<LocationRow />}/>
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
