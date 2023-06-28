// import ReactAudioPlayer from 'react-audio-player'; 
import bgms from '../assets/bgm/bgmList';
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // react-redux에서 useSelector를 불러옵니다.
import type { RootState } from "../stores";
import { GAME_STATUS } from "../stores/gameSlice";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import MusicOffRoundedIcon from '@mui/icons-material/MusicOffRounded';
import { bgmOn, bgmOff } from '../stores/bgmOnoffSlice';
import store from "../stores";

const audios = Object.entries(bgms).map(([key, audio]) => ({
    name: key,
    audio,
}));



const Bgm = () => {
  
    const { START, AIRPORT, USA, NPCDIALOG, USERDIALOG, LOGIN, FREEDIALOG, REPORT } = GAME_STATUS;
    const {  mode } = useSelector((state: RootState) => {
        return { ...state.mode };
    });

    const {bgmonoff} = useSelector((state: RootState) => {
        return { ...state.bgmonoff};
    });

    
    const dispatch = useDispatch();
    useEffect(() => {
    }, [mode]);
    useEffect(() => {
        console.log(bgmonoff);
    }, [bgmonoff]);

    const handleClick=()=>{
        console.log(bgmonoff);
        if (bgmonoff==true) {store.dispatch(bgmOff());}
        else {store.dispatch(bgmOn());}
    }
    
    return (
        <div style={{position:"absolute", bottom: '2%', left: '1%',}}>
            <Box style={{position:"relative"}}
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    top: 0,
                }}
                >
                <Fab
                    color="primary"
                    onClick={handleClick}
                    sx={{
                    border: `3px ridge ${'#B0C4DE'}`,
                    padding: '2rem',
                    }}
                >
                    {bgmonoff && <AudiotrackIcon />}
                    {!bgmonoff && <MusicOffRoundedIcon />}
                </Fab>
            </Box>
        {(mode==START || mode==LOGIN) && <>
        {bgmonoff && <audio id="myAudio" src={audios[0].audio} controls autoPlay loop style={{ display: "none" }}/>}
        {!bgmonoff && <audio id="myAudio" src={audios[0].audio} controls autoPlay muted style={{ display: "none" }}/>}
        </>}
        {mode==AIRPORT && <>
        {bgmonoff && <audio src={audios[1].audio} controls autoPlay loop style={{  display: "none" }}/>}
        {!bgmonoff && <audio src={audios[1].audio} controls autoPlay muted style={{  display: "none" }}/>}
        </>}
        {mode==USA && <>
        {bgmonoff && <audio src={audios[2].audio} controls autoPlay loop style={{  display: "none" }}/>}
        {!bgmonoff && <audio src={audios[2].audio} controls autoPlay muted style={{  display: "none" }}/>}
        </>}
        {(mode==NPCDIALOG || mode== USERDIALOG || mode==REPORT || mode==FREEDIALOG) && <>
        {bgmonoff &&<audio src={audios[3].audio} controls autoPlay loop style={{  display: "none" }}/>}
        {!bgmonoff &&<audio src={audios[3].audio} controls autoPlay muted style={{  display: "none" }}/>}
        </>}
        </div>
    //   <ReactAudioPlayer src="assets/.mp3" autoPlay controls />
    );
  
}

export default Bgm;