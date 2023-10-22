import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import IDE from "./pages/online_ide/IDE";
import Drawing from "./pages/whiteboard/Drawing";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<IDE />} />
                    <Route path="/board" element={<Drawing />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
