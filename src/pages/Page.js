import React from "react"
import './Page.css'

/**
 * Defines an abstract page as some component with a title and a set of 
 * components, this generalisation can be done as all pages have the same basic
 * styling for the background, header, footer and page title.
 * 
 * This was intended to be used for every page, however complications 
 * surrounding the use of page routing parameters meant it was easier to bake
 * in the main tags to the individual edit and share components. So its only
 * ever used to generate the List of Song Samples page.
 * 
 * This is a pretty nice concept though and was a good way to experiement with
 * dynamincally generating components with functions like map.
 * 
 * @param {string} title Title of the page
 * @param {Array<React.JSX.Element>} pageComponents An array of React components
 *                                                  for the page.
 * @returns {React.JSX.Element} A page as a React Component with all its 
 *                              respective components.
 */
const Page = ({title, pageComponents}) => {
    
    return (
        <main>
            <h2 className="PageTitle">
                {title}
            </h2>

            {
                pageComponents.map((component) => {
                    return (
                    <>
                        {component}
                    </>);
                })
            }

        </main>
    );
}

export default Page;