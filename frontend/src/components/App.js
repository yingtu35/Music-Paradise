import React from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";


export default function App(props) {
    // props are arguments passed into React components
    return (
        <div className="center">
            <HomePage />
        </div>
    )
};

const appDiv = document.getElementById("app");
// render the App component inside appDiv
render(<App />, appDiv)