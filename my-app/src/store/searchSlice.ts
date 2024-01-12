import { createSlice } from "@reduxjs/toolkit";

interface searchState {
    name: string
    user: string
    status: string
    formationDateStart: string | null
    formationDateEnd: string | null
}

const initialState: searchState = {
    name: '',
    user: '',
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
        setUser: (state, { payload }) => {
            state.user = payload
        },
        setMissionStatus: (state, { payload }) => {
            state.status = payload
        },
        setDateStart: (state, { payload }) => {
            state.formationDateStart = payload
        },
        setDateEnd: (state, { payload }) => {
            state.formationDateEnd = payload
        },
        reset: (state) => {
            state = initialState
        }
    },
});

export default searchSlice.reducer;

export const { setName, setUser, setMissionStatus, setDateStart, setDateEnd, reset } = searchSlice.actions;