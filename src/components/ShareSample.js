import React, { useEffect, useState } from "react";
import { PreviewButton, SongDetails } from "./SongSample";
import './SongSample.css';
import './EditSample.css';
import { useParams } from "react-router-dom";
import { deleteSampleToLocation, getSampleToLocation, postLocation } from "../api/Location";
import API from "../api/global";

/**
 * Simple component to define preview button and its styling
 * 
 * @param {Number} id id of element being shared
 * @returns {React.JSX.Element} React component of the preview button
 */
const SongSharePreviewButton = ({id}) => {
    return (
        <div className="SongSampleButtons">
            <PreviewButton id={id}/>
        </div>
    );
}

/**
 * React component that renders information of the shared sample, locations it 
 * can share to and if its shared to them or not.
 * 
 * @returns {React.JSX.Element} React component of the location row
 */
const LocationRow = () => {
    const { id } = useParams();
    const [ locations, setLocations ] = useState([]);
    const [ data, setData ] = useState({});
    
    /**
     * Load in shared locations
     */
    useEffect(() => {
        getSampleToLocation().then((_sampleToLocations) => {
            const locationIds = _sampleToLocations.filter((sampleTolocation) => {
                return `${sampleTolocation.sample_id}` === `${id}`
            }).map((sampleTolocation) => {
                return {
                    id: sampleTolocation.id,
                    location_id: sampleTolocation.location_id
                };
            });
            localStorage.setItem(`sl_${id}`, JSON.stringify(locationIds));
            console.info(JSON.parse(localStorage.getItem(`sl_${id}`)));
        });
    }, []);

    /**
     * Load in sample data
     */
    useEffect(() => {
        setData(JSON.parse(localStorage.getItem(`s${id}`)));
    }, data);

    /**
     * Load in availble locations
     */
    useEffect(() => {
        setLocations(JSON.parse(localStorage.getItem('locations')));
    }, locations);

    /**
     * Shares this sample with the loaction selected
     * 
     * @param {Number} location_id id of the location to share this sample to
     * @param {React.MouseEvent<HTMLInputElement>} event HTML Element details 
     *                                                    of the react component 
     *                                                    being clicked.
     * @returns 
     */
    const addLocation = (location_id, event) => {
        console.log(location_id);
        const sampleTolocations = JSON.parse(localStorage.getItem(`sl_${id}`));
        if (sampleTolocations.length > 0) {
            const alreadyThere = sampleTolocations.filter((location) => {
                return `${location.location_id}` === `${location_id}`;
            })
            console.log(alreadyThere);
            // Don'tadd anymore if location is already there.
            // cause backend doesn't do that for you -_- 
            if (alreadyThere.length > 0) {
                return true;
            }
        }

        postLocation({
            api_key: API().KEY,
            sample_id: Number(id),
            location_id: Number(location_id)
        }).then((result) => {
            console.log(result);
            event.target.className = "toggle-selected";
            event.target.nextSibling.className = "toggle";
            localStorage.setItem(`sl_${id}`, JSON.stringify([...sampleTolocations, {id: result.id, location_id: result.location_id}]));
        })

        return true;
    }

    /**
     * Unshares this sample with the loaction selected
     * 
     * @param {Number} location_id id of the location to un-share this sample 
     *                             from.
     * @param {React.MouseEvent<HTMLInputElement>} event HTML Element details 
     *                                                    of the react component 
     *                                                    being clicked.
     * @returns 
     */
    const removeLocation = (location_id, event) => {
        const sampleTolocations = JSON.parse(localStorage.getItem(`sl_${id}`));
        if (sampleTolocations.length > 0) {
            const entriesToDelete = sampleTolocations.filter((sampleTolocation) => {
                return `${sampleTolocation.location_id}` === `${location_id}`;
            });
            console.log(entriesToDelete);
            entriesToDelete.forEach((entry) => {
                console.log(entry.id);
                deleteSampleToLocation(entry.id).then((result) => {
                    event.target.className = "toggle-selected";
                    event.target.previousSibling.className = "toggle";
                    const withRemove = sampleTolocations.filter((sampleTolocation) => {
                        return `${sampleTolocation.id}` !== `${entry.id}`;
                    });
                    localStorage.setItem(`sl_${id}`, JSON.stringify(withRemove));
                });
            })
        }
    }
    
    /**
     * Checks the if this sample has been shared to the specified location
     * 
     * @param {string} location_id location id to check for this sample.
     * @returns {boolean} true is present, false otherwise.
     */
    const shared = (location_id) => {
        const sampleTolocations = JSON.parse(localStorage.getItem(`sl_${id}`));
        if (sampleTolocations.length > 0) {
            const value = sampleTolocations.filter((location) => {
                return `${location_id}` === `${location.location_id}`;
            });
            return value.length > 0;
        }

        // console.log(stl);

        return false;
    }

    return (
        <main>
            <h2 className="PageTitle">
                Share This Sample
            </h2>
            <div className="SongSample">
                {
                    ((data) ? 
                        <>
                            <SongDetails songName={data.name} 
                                         date={data.datetime}/>
                            <SongSharePreviewButton id={data.id}/>
                        </>
                    :   
                        <>
                            <SongDetails songName="" 
                                         date=""/>
                            <SongSharePreviewButton id=""/>
                        </>)
                }
                
            </div>
            {   
                ((locations) ?
                    locations.map((location) => {
                        return (
                            <>
                            <div className="RowToggle">
                                <h4>{location.name}</h4>
                            </div>

                            <div className="RowSequence" id={location.id}>
                                <button onClick={(event) => {
                                    addLocation(location.id, event);
                                }}  class={((shared(location.id)) 
                                    ? 'toggle-selected' : 'toggle')} id={location.id}>
                                    Shared
                                </button>
                                <button onClick={(event) => {
                                    removeLocation(location.id, event);
                                }} class={((!shared(location.id)) 
                                ? 'toggle-selected' : 'toggle')} id={location.id}>
                                    Not Shared
                                </button>
                            </div>
                            </>
                        );
                    })
                :
                    <>
                    
                    </>
                )
            }
        </main>
    );
}

export default LocationRow;