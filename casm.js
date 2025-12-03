import Feedback from "./feedback.js"
import {LevelLoader,Sprite} from "https://unpkg.com/type3games-engine/engine.js"
import {Event} from "https://unpkg.com/type3games-engine/coretools.js"
let version;
Feedback.load(()=> version = Feedback.version);
let connected = false;
let host = true;
let peerConnection = new RTCPeerConnection()



Event.on("Frame", ()=>{
    if (!connected) return;
})



document.addEventListener("keydown", async (e)=>{
    if (e.code == "NumpadMultiply" && e.ctrlKey && e.shiftKey && e.metaKey){
        host = !host;
        if (!host) {
            console.log("Host mode:",host);
            
            peerInt()

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            setTimeout( ()=>receiveAnswer(prompt("Zadejte odpověď (answer):")), 10000);
        } else {
            console.log("Host mode:",host);
            peerConnection.close();
            peerConnection = new RTCPeerConnection();
            makeAnswer(prompt("Zadejte nabídku (offer):") );
        }
    }


})

function peerInt(){
            peerConnection.onicecandidate = (event) => {
            if (event.candidate == null) {
                console.log(JSON.stringify(peerConnection.localDescription));
            }
            };

            // create a data channel so the SDP contains a media section and ICE gathering starts
            const dc = peerConnection.createDataChannel("casm-dc");
            dc.onopen = () => console.log("data channel opened");
            dc.onclose = () => console.log("data channel closed");
}

async function makeAnswer(sdpString){
    peerInt();
    const sdp = JSON.parse(sdpString);
    await peerConnection.setRemoteDescription(sdp);
    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer);
}

async function receiveAnswer(sdpString){
    const sdp = JSON.parse(sdpString);
    await peerConnection.setRemoteDescription(sdp);
}
