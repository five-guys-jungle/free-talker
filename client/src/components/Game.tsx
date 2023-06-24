import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Phaser from "phaser";
import AirPortScene from "../scenes/Airport";
import styled from "styled-components";
import {
    setPlayerId,
    setPlayerNickname,
    setPlayerTexture,
} from "../stores/userSlice";
import {
    selectPlayerId,
    selectPlayerNickname,
    selectPlayerTexture,
} from "../stores/userSlice";

import { GAME_STATUS } from "../stores/gameSlice";
import { RootState } from "../stores";
import NPCDialog from "./NPCDialog";
import FreeDialog from "./FreeDialog";
import Report from "./Report";  
import ReportBook from "./Reportbook";  

const Game = () => {
    // socket intialization, connection

    const { START, AIRPORT, USA, NPCDIALOG, FREEDIALOG, REPORT } = GAME_STATUS;
    const { mode } = useSelector((state: RootState) => {
        return { ...state.mode };
    });

    return <BackgroundDiv>
        {mode === NPCDIALOG && <NPCDialog />}
        {mode === FREEDIALOG && <FreeDialog />}
        {mode === REPORT && <Report/>}
        {mode !== REPORT || mode !== NPCDIALOG || mode !== FREEDIALOG&& <ReportBook/>}
        </BackgroundDiv>;
};

export { Game };

const BackgroundDiv = styled.div`
    width: 100%;
    height: 100%;
    // position: relative;
    // overflow: hidden;
`;
