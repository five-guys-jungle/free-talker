import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface RTCState {
    socketNamespace: string;
}

export const initialState: RTCState = {
    socketNamespace: process.env.REACT_APP_SERVER_URL!,
};

export const rtcSlice = createSlice({
    name: "rtc",
    initialState,
    reducers: {
        setSocketNamespace: (state, action: PayloadAction<RTCState>) => {
            state.socketNamespace = action.payload.socketNamespace;
        },
        appendSocketNamespace: (state, action: PayloadAction<RTCState>) => {
            state.socketNamespace += action.payload.socketNamespace;
        },
    },
});

export const { setSocketNamespace, appendSocketNamespace } = rtcSlice.actions;

export default rtcSlice.reducer;
