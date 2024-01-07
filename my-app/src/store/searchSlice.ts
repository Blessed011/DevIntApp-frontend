import { createSlice } from "@reduxjs/toolkit";

interface searchState {
    name: string

    status: string
    formationDateStart: string | null
    formationDateEnd: string | null
}

const initialState: searchState = {
    name: '',

    status: '',
    formationDateStart: null,
    formationDateEnd: null,
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setName: (state, { payload }) => {
            state.name = payload
        },
        setStatus: (state, { payload }) => {
            state.status = payload
        },
        setDateStart: (state, { payload }) => {
            state.formationDateStart = payload
        },
        setDateEnd: (state, { payload }) => {
            state.formationDateEnd = payload
        },
    },
});

export default searchSlice.reducer;

export const { setName, setStatus, setDateStart, setDateEnd } = searchSlice.actions;