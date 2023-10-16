import { configureStore, createSlice } from '@reduxjs/toolkit';
import defaultInput from '../data/defaultInput';

const initialState = {
    mode: 'vs-dark',
    language: 'python3',
    input: '',
    fontSize: 20,
    code: defaultInput['python3']
}

const slice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === 'vs-dark' ? 'light' : 'vs-dark';
        },
        setInput: (state, action) => {
            state.input = action.payload.input;
        },
        setFontSize: (state, action) => {
            state.fontSize = action.payload.fontSize;
        },
        setLang: (state, action) => {
            state.language = action.payload.language;
            state.code = defaultInput[action.payload.language];
        },
        setCode: (state, action) => {
            state.code = action.payload.code;
        }
    }
})

const store = configureStore({
    reducer: slice.reducer
});

export const { setMode, setInput, setFontSize, setLang, setCode } = slice.actions;
export default store;