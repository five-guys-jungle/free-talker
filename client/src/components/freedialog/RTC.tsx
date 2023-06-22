import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import AssignmentIcon from "@material-ui/icons/Assignment"
import PhoneIcon from "@material-ui/icons/Phone"
import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import {Instance} from "simple-peer"
import io, { Socket } from "socket.io-client"

const FreeDialog = () => {
    const [ me, setMe ] = useState("")
	const [ stream, setStream ] = React.useState<MediaStream | undefined>(undefined)
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState<any>()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = React.useRef<HTMLVideoElement>(null);
	const userVideo = React.useRef<HTMLVideoElement>(null);
	const connectionRef = React.useRef<Instance | null>(null);
    const socket = useRef<Socket | null>(null);
	
	
    useEffect(() => {
		socket.current = io("http://localhost:5000/freedialog");
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            if (myVideo.current) {
                myVideo.current.srcObject = stream
				console.log(myVideo.current.srcObject)
            }
        })
		
		
		socket.current!.on("connect", () => {
			console.log("socket is connected: ", socket.current!.id);
		});
		socket.current!.on("me", (id) => {
			setMe(id);
			console.log("id:::", id)
		});

        socket.current!.on("callUser", (data) => {
			setReceivingCall(true);
			setCaller(data.from);
			setName(data.name);
			setCallerSignal(data.signal);
			console.log("callUser2222222222")
		});
	}, []);


       

    const callUser = (id: string) => {
		console.log("id:", id)
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data: any) => {
			console.log("111111111111111")
			socket.current!.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: name
			})
		})
		peer.on("stream", (stream) => {
			
				userVideo.current!.srcObject = stream
			
		})
		socket.current!.on("callAccepted", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	const answerCall =() =>  {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.current!.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current!.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const leaveCall = () => {
		setCallEnded(true)
		if (connectionRef.current) {
            connectionRef.current.destroy();
          }
        };

		return (
			<>
				<div style={{ 
					display: 'flex', 
					justifyContent: 'center', 
					alignItems: 'center', 
				}}>
					<div className="call-button" style={{ position: 'fixed', textAlign: 'center', top: '5px'}}>
						
						{callAccepted && !callEnded ? (
							<IconButton color="secondary" aria-label="endcall" onClick={leaveCall}>
							<PhoneIcon fontSize="large" />
							</IconButton>
						) : (
							<IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
							<PhoneIcon fontSize="large" />
							</IconButton>
						)}
						{receivingCall && !callAccepted && (
							<div className="caller" style={{ display: 'inline-flex', alignItems: 'center', bottom : '5px' }}>
								<h1> {name} is calling... </h1>
								<Button variant="contained" color="primary" onClick={answerCall}>
									Answer
								</Button>
							</div>
						)}
						{idToCall}
						</div>

				</div>
				<div className="container" style={{ 
					flexDirection: "column", 
					alignItems: "center", 
					justifyContent: "center", 
					paddingTop: "50px" 
				}}> 					
					<div className="video-container" style={{ 
						display: "flex", 
						flexDirection: "column", 
						alignItems: "center", 
						justifyContent: "center", 
						width: "100%",
						marginTop: "30px", 
						transform: "scaleX(-1)" 
					}}>
						<div className="video" style={{ 
							display: "flex", 
							justifyContent: "center", 
							alignItems: "center",
							width: "100%",
							height: "100%",
							marginBottom: "30px",
						}}>
							{stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "50%",  margin: "auto"}} />}
						</div>
						{/* <div className="video" style={{ 
							display: "flex", 
							justifyContent: "center", 
							alignItems: "center",
							width: "100%",
							height: "100%",
						}}>
							{callAccepted && !callEnded ?
								<video playsInline ref={userVideo} autoPlay style={{width: "50%", margin: "auto"  }} /> :
								(stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "50%",  margin: "auto" }} />)
							}
						</div> */}
						<div className="video" style={{ 
							display: "flex", 
							justifyContent: "center", 
							alignItems: "center",
							width: "100%",
							height: "100%",
						}}>
							{callAccepted && !callEnded ?
								<video playsInline ref={userVideo} autoPlay style={{ width: "50%", margin: "auto" }} /> :
								null}
						</div>


					</div>
		
					
		
				</div>
			</>
		)
		

				  }
export default FreeDialog;