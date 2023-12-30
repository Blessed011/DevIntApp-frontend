import { createSlice } from "@reduxjs/toolkit";

interface searchState {
    name: string

    status: string
    dateApproveStart: string | null
    dateApproveEnd: string | null
}

const initialState: searchState = {
    name: '',

    status: '',
    dateApproveStart: null,
    dateApproveEnd: null,
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
            state.dateApproveStart = payload
        },
        setDateEnd: (state, { payload }) => {
            state.dateApproveEnd = payload
        },
    },
});

export default searchSlice.reducer;

export const { setName, setStatus, setDateStart, setDateEnd } = searchSlice.actions;