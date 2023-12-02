import React, { ChangeEvent, useEffect, useState } from "react";
// import edit from '../cache/edit.json';
import { useParams } from "react-router-dom";
import '../pages/Page.css'
import { getSamples, putSample } from "../api/Sample";
import './EditSample.css';
import { NEW_SAMPLE } from "../api/global";
import { instruments } from "../data/instrument";

/**
 * Defines edit the following objects:
 * NEW_SAMPLE(): default new entry object that will be populated with edited
 *               fields.
 * mod: a flag to annouce if any modifications have been made or not.
 * id: the sample id of the edited sample
 */
let newChanges = [NEW_SAMPLE(), {mod: false}, {id: 0}];
/**
 * Here for convenience, allows mapping function when rendering components to 
 * do a simple 'type in INSTRUMENTLIST' check when tryign to figure out which
 * instrument to play.
 */
const INSTRUMENTLIST =  {
    "piano": true,
    "french-horn": true,
    "guitar": true,
    "drums": true,
    "violin": true
}

/**
 * Simple button on click function to toggle the button styling
 * 
 * @param {React.MouseEvent<HTMLInputElement>} event HTML Element details of the
 *                                                   react component being 
 *                                                   clicked
 */
const changeToggleState = (event) => {
    event.target.className = ((event.target.className === 'toggle') ? 
                              'toggle-selected' : 'toggle');
}

/**
 * 
 * @param {string} sampleName name of the sample
 * @param {boolena} preview flag to check if a song preview is running
 * @returns {React.JSX.Element} React component for editing sample name, previewing
 *                              sample and saving changes.
 */
const SampleNameForm = ({sampleName, preview, setPreview}) => {
    const [inputText, setInputText] = useState("");

    /**
     * Simple button on click function to update input value add it to edit 
     * object
     * 
     * @param {React.MouseEvent<HTMLInputElement>} event HTML Element details 
     *                                                   of the react component 
     *                                                   being clicked.
     */
    const NameChange = (event) => {
        setInputText(event.target.value);
        newChanges[0].name = inputText;
        newChanges[1].mod = true;
    }

    /**
     * Button click event to save edits made and send back to API
     */
    const saveChanges = () => {
        if (newChanges[1].mod) {
            let changed = newChanges[0];
            let id = newChanges[2].id;

            changed.recording_data = JSON.stringify(changed.recording_data);
            if (id !== 'new') {
                putSample(changed, id).then((result) => {
                    localStorage.setItem(`s${id}`, result);
                    newChanges[2].mod = false;
                });
            }
            getSamples().then((result) => {
                localStorage.setItem(`samples`, JSON.stringify(result));
            })

        }
    }

    /**
     * Enables preview song function
     * 
     * @param {React.MouseEvent<HTMLInputElement>} event HTML Element details 
     *                                                   of the react component 
     *                                                   being clicked.
     */
    const previewSample = (event) => {
        setPreview(!preview);
    }

    return (
        <form className="SongSample">
            <input type="text" onChange={NameChange} defaultValue={sampleName}></input>
            <div className="SongSampleButtons">
                <button onClick={previewSample} type="button" className="button">
                    {(preview) ? "Stop Preview" : "Preview"}
                </button>
                <button onClick={saveChanges} type="button" className="bright-button">
                    Save
                </button>
            </div>
        </form>
    );
}

/**
 * Creates an instrument row and changes styling based on instrument selected.
 * 
 * @param  {string} type instrument type already in the data
 * @returns {React.JSX.Element}
 */
const InstrumentRow = ({type}) => {
    /**
     * Chnaged the instrument type on click in the edit object.
     * 
     * @param {React.MouseEvent<HTMLInputElement>} event HTML Element details 
     *                                                   of the react component 
     *                                                   being clicked.
     */
    const changeType = (event) => {
        newChanges[0].type = event.target.id;
        newChanges[1].mod = true;
    }

    /**
     * Simple method to recursively turn off all previous siblings (if any) if
     * an instrument has been selected.
     * 
     * @param {React.MouseEvent<HTMLInputElement>} target HTML Element details 
     *                                                    of the react component 
     *                                                    being clicked.
     * @param {boolean} state defines the current element state is on selected 
     *                        or not
     * @returns {null}
     */
    const changePreviousSates = (target, state) => {
        if (target != null) {
            target.className = state;
            return changePreviousSates(target.previousSibling, state);
        }

        return null;
    }

    /**
     * Simple method to recursively turn off all succsesive siblings (if any) if
     * an instrument has been selected.
     * 
     * @param {React.MouseEvent<HTMLInputElement>} target HTML Element details 
     *                                                    of the react component 
     *                                                    being clicked.
     * @param {boolean} state defines the current element state is on selected 
     *                        or not
     * @returns {null}
     */
    const changeNextStates = (target, state) => {
        if (target != null) {
            target.className = state;
            return changeNextStates(target.nextSibling, state);
        }

        return null;
    }

    return (
        <div className="RowToggle">
            <div className="RowLabel">
                <h4>Instrument</h4>
            </div>
            <div className="RowSequence">
                <button id='guitar' onClick={(event) => {
                    changeToggleState(event);
                    if (event.target.className === 'toggle-selected') {
                        changePreviousSates(event.target.previousSibling, 'toggle');
                        changeNextStates(event.target.nextSibling, 'toggle');
                    }
                    changeType(event);
                }}class={((type === 'guitar') ? 'toggle-selected' : 'toggle')}>Guitar</button>
                <button id='piano' onClick={(event) => {
                    changeToggleState(event);
                    if (event.target.className === 'toggle-selected') {
                        changePreviousSates(event.target.previousSibling, 'toggle');
                        changeNextStates(event.target.nextSibling, 'toggle');
                    }
                    changeType(event);
                }}class={((type === 'piano') ? 'toggle-selected' : 'toggle')}>Piano</button>
                <button id='violin' onClick={(event) => {
                    changeToggleState(event);
                    if (event.target.className === 'toggle-selected') {
                        changePreviousSates(event.target.previousSibling, 'toggle');
                        changeNextStates(event.target.nextSibling, 'toggle');
                    }
                    changeType(event);
                }}class={((type === 'violin') ? 'toggle-selected' : 'toggle')}>Violin</button>
                <button id='drums' onClick={(event) => {
                    changeToggleState(event);
                    if (event.target.className === 'toggle-selected') {
                        changePreviousSates(event.target.previousSibling, 'toggle');
                        changeNextStates(event.target.nextSibling, 'toggle');
                    }
                    changeType(event);
                }}class={((type === 'drums') ? 'toggle-selected' : 'toggle')}>Drums</button>
                <button id='french-horn' onClick={(event) => {
                    changeToggleState(event);
                    if (event.target.className === 'toggle-selected') {
                        changePreviousSates(event.target.previousSibling, 'toggle');
                        changeNextStates(event.target.nextSibling, 'toggle');
                    }
                    changeType(event);
                }}class={((type === 'french-horn') ? 'toggle-selected' : 'toggle')}>French Horn</button>
            </div>
        </div>
    );
}


const InstrumentNotes = ({notes}) => {

    /**
     * A method to toggle on and off a specific bar of a pitch and modify its
     * entry in the edit object. This does not control sound.
     * 
     * @param {Number} pitchIndex index of the current pitch being selected 
     *                            (pitch: A, B, C, ....)
     * @param {string} pitch the pitch to be used
     * @param {Number} noteIndex index of the pitch's bar that's selected
     * @param {boolean} state the current state of the bar.
     */
    const editNotes = (pitchIndex, pitch, noteIndex, state) => {
        const new_recording_data = newChanges[0].recording_data.map((value, index) => {
            if (index === pitchIndex) {
                let newValue = value;
                newValue[pitch] = newValue[pitch].map((note, index) => {
                    if (index === noteIndex) {
                        return state;
                    }

                    return note;
                })

                return newValue;
            }

            return value;
        })

        newChanges[0].recording_data = new_recording_data;
        newChanges[1].mod = true;
    };

    /**
     * Plays the bar sound depending on the pitch row its on.
     * 
     * @param {string} instrument instrument selected
     * @param {string} pitch pitch of the selected bar
     */
    const barSound = (instrument, pitch) => {
        console.log(instrument);
        console.log(pitch);
        instruments[`${instrument}`].play(pitch);
    }

    return (
        <>
            {
                notes.map((note, pitchIndex) => {
                    return (
                        <div id={pitchIndex} className="RowToggle">
                            <div className="RowLabel">
                                <h4>
                                    {(Object.keys(note))[0]}
                                </h4>
                            </div>
                            <div id={(Object.keys(note))[0]} className="RowSequence">
                                {
                                    note[(Object.keys(note))[0]]
                                    .map((value, noteIndex) => {
                                        return (
                                            <button id={noteIndex} onClick={(event) => {
                                                changeToggleState(event);
                                                editNotes(
                                                    pitchIndex, 
                                                    (Object.keys(note))[0],
                                                    noteIndex, !value
                                                );
                                                if ((newChanges[0].type in INSTRUMENTLIST)) {
                                                    barSound(
                                                        newChanges[0].type,
                                                        `${(Object.keys(note))[0]}`
                                                    )
                                                }
                                            }} className={(value) ? 
                                                'toggle-selected' : 'toggle'}></button>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    );
                })
            }
        </>
    );
}

/**
 * A react page that defines all the components and functions of the edit sample
 * page, also handles parsing the recording_data of the sample.
 * 
 * @returns {React.JSX.Element} React component defining the edit page.
 */
const EditSample = () => {

    const { id } = useParams();
    const [ data, setData ] = useState();
    const [ preview, setPreview ] = useState(false);

    const defaultNotes = [
        {'B':[false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false, false]},
        {'A':[false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false, false]},
        {'G':[false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false, false]},
        {'F':[false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false, false]},
        {'E':[false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false, false]},
        {'D':[false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false, false]},
        {'C':[false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, false, false]},
    ];

    useEffect(() => {
        newChanges[1].mod = false;
        newChanges[0].recording_data = defaultNotes;
        newChanges[2].id = (id !== 'new') ? Number(id) : "new";
    }, []);    

    useEffect(() => {
        setData(JSON.parse(localStorage.getItem('s'+id)));
        if (data !== undefined) {
            newChanges.type = data.type || 'piano';
            newChanges[2].id = data.id || 0;
        }
        
    });

    let notes = [];
    if (data && data.recording_data) {
        try{
            notes = (data.recording_data.split('},{')).map((note, index) => {
                if (index === 0) {
                    return JSON.parse(JSON.stringify((note.slice(1)) + '}'))
                }
        
                if (index === 6) {
                    return JSON.parse(JSON.stringify('{' + (note.slice(0, note.length-1))));
                }
        
                return JSON.parse(JSON.stringify('{' + note + '}'));
            }).map((note) => {return JSON.parse(note)});
            if (!(newChanges[1].mod)) {
                newChanges[0].recording_data = notes;
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <main>
            <h2 className="PageTitle">
                Editing This Sample
            </h2>

            {
                ((data) ? 
                    <>
                        <SampleNameForm sampleName={data.name} 
                                        preview={preview} 
                                        setPreview={setPreview} />
                        <InstrumentRow type={data.type} />
                        <InstrumentNotes notes={notes} /> 
                    </>
                :   
                    <>
                    <SampleNameForm sampleName={""} 
                                    preview={preview} 
                                    setPreview={setPreview} />
                    <InstrumentRow type={""} />
                    <InstrumentNotes notes={defaultNotes} /> 
                    </>)
            }
        </main>
    );
}

export { EditSample, InstrumentNotes };