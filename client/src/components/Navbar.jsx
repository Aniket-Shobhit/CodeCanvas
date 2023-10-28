import Select from "react-select";
import "./Navbar.css";
import whiteboard from "../whiteboard.svg";
import { useSelector, useDispatch } from "react-redux";
import { setFontSize, setLang, setMode } from "../store/index.js";
import { Link } from "react-router-dom";

const Navbar = () => {
    const fontSize = useSelector((state) => state.fontSize);

    const dispatch = useDispatch();

    const languages = [
        { value: "c", label: "C" },
        { value: "cpp", label: "C++" },
        { value: "python3", label: "Python" },
        { value: "java", label: "Java" },
        { value: "javascript", label: "JavaScript" },
    ];

    const themes = [
        { value: "vs-dark", label: "Dark" },
        { value: "light", label: "Light" },
    ];

    function langChangeHandler(e) {
        dispatch(setLang({ language: e.value }));
    }

    function themeChangeHandler(e) {
        if (e.target.checked) {
            dispatch(setMode({ mode: "light" }));
        } else {
            dispatch(setMode({ mode: "vs-dark" }));
        }
    }

    function fontChangeHandler(e) {
        dispatch(setFontSize({ fontSize: e.target.value }));
    }

    return (
        <div className="navbar">
            <h1>CompileX</h1>
            <Select
                options={languages}
                onChange={langChangeHandler}
                defaultValue={languages[2]}
            />
            {/* <Select
                options={themes}
                onChange={themeChangeHandler}
                defaultValue={themes[0]}
            /> */}
            <label>Font Size</label>
            <input
                type="range"
                min="18"
                max="30"
                value={fontSize}
                step="2"
                onChange={fontChangeHandler}
            />
            <div className="whiteboard">
                <Link to="/board">
                    <img
                        src={whiteboard}
                        alt="whiteboard"
                        height={50}
                        width={50}
                    />
                </Link>
            </div>
            <input
                id="toggle"
                className="toggle"
                type="checkbox"
                onChange={themeChangeHandler}
            />
        </div>
    );
};

export default Navbar;
