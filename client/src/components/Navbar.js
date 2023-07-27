import Select from 'react-select';
import './Navbar.css';

const Navbar = ({userLang, setUserLang, userTheme, setUserTheme, fontSize, setFontSize}) => {
    
    const languages = [
        { value: "c", label: "C" },
        { value: "cpp", label: "C++" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" }
    ];

    const themes = [
        { value: "vs-dark", label: "Dark" },
        { value: "light", label: "Light" },
    ];

    // const fontSizes = [
    //     { value: '18', label:'18'},
    //     { value: '20', label:'20'},
    //     { value: '22', label:'22'},
    //     { value: '24', label:'24'},
    //     { value: '26', label:'26'},
    //     { value: '28', label:'28'}
    // ]

    function langChangeHandler(e) {
        setUserLang(e.value)
    }

    function themeChangeHandler(e) {
        setUserTheme(e.value)
    }

    function fontChangeHandler(e) {
        setFontSize(e.target.value)
    }

    return (
        <div className='navbar'>
            <h1>Online_IDE</h1>
            <Select options={languages} 
                onChange={langChangeHandler} placeHolder={userLang}/>
            <Select options={themes}
                onChange={themeChangeHandler} placeHolder={userTheme} />
            <label>Font Size</label>
            <input type="range" min="18" max="30"
                value={fontSize} step="2" onChange={fontChangeHandler} />
            {/* <Select value={themes}  */}
                {/* onChange={fontChangeHandler} placeHolder={fontSize}/> */}
        </div>
    )
};

export default Navbar;