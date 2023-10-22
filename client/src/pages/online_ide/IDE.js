import logo from "../../logo.svg";
import "./ide.css";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import defaultInput from "../../data/defaultInput";
import { useSelector, useDispatch } from "react-redux";
import { setInput, setCode } from "../../store/index.js";

function IDE() {
    const {
        language: userLang,
        input: userInput,
        mode: userTheme,
        fontSize,
        code: userCode,
    } = useSelector((state) => state);

    const [userOutput, setUserOutput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const options = {
        fontSize: fontSize,
    };

    const compile = async () => {
        setIsLoading(true);
        if (userCode === "") return;

        const data = {
            code: userCode,
            language: userLang,
            input: userInput,
        };

        try {
            const output = await axios.post(
                "http://localhost:8000/compile",
                data
            );
            setUserOutput(output.data.output);
        } catch (e) {
            console.log(e);
        }

        setIsLoading(false);
    };

    const clearOutput = () => {
        setUserOutput("");
    };

    return (
        <div className="App">
            <Navbar />
            <div className="main">
                <div className="left-container">
                    <Editor
                        options={options}
                        height="calc(100vh - 50px)"
                        width="100%"
                        theme={userTheme}
                        language={userLang}
                        defaultLanguage="python"
                        value={defaultInput[userLang]}
                        onChange={(value) => {
                            dispatch(setCode({ code: value }));
                        }}
                    />
                    <button className="run-btn" onClick={() => compile()}>
                        Run
                    </button>
                </div>
                <div className="right-container">
                    <h4>Input:</h4>
                    <div className="input-box">
                        <textarea
                            id="code-inp"
                            onChange={(e) =>
                                dispatch(setInput({ input: e.target.value }))
                            }
                        ></textarea>
                    </div>
                    <h4>Output:</h4>
                    {isLoading ? (
                        <div className="spinner-box">
                            <img src={logo} alt="Loading..." />
                        </div>
                    ) : (
                        <div className="output-box">
                            <pre>{userOutput}</pre>
                            <button
                                onClick={() => {
                                    clearOutput();
                                }}
                                className="clear-btn"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default IDE;
