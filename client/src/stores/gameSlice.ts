import { createSlice } from "@reduxjs/toolkit";

export const GAME_STATUS = {
    START: "START",
    LOGIN: "LOGIN",
    AIRPORT: "AIRPORT",
    USA: "USA",
    NPCDIALOG: "NPCDIALOG",
    USERDIALOG: "USERDIALOG",
    REPORT: "REPORT"
};

export interface GameModeState {
    mode: string;
}

const initialState: GameModeState = {
    mode: GAME_STATUS.START,
};

export const GameModeSlice = createSlice({
    name: "mode",
    initialState,
    reducers: {
        openStart: (state) => {
            state.mode = GAME_STATUS.START;
        },
        openLogin: (state) => {
            state.mode = GAME_STATUS.LOGIN;
        },
        openAirport: (state) => {
            state.mode = GAME_STATUS.AIRPORT;
        },
        openUSA: (state) => {
            state.mode = GAME_STATUS.USA;
        },
        openNPCDialog: (state) => {
            state.mode = GAME_STATUS.NPCDIALOG;
        },
        openReport: (state) => {
            state.mode = GAME_STATUS.REPORT;
        },
    },
});
export const { openAirport, openUSA, openNPCDialog, openStart, openLogin, openReport } =
    GameModeSlice.actions;

export default GameModeSlice.reducer;