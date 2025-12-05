import Feedback from "./feedback.js"
import {LevelLoader,Sprite} from "https://unpkg.com/type3games-engine/engine.js"
import {Vector,Event} from "https://unpkg.com/type3games-engine/coretools.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
try{


// --- Firebase init ---
let app, db, auth;
let unsubscribeOffer, unsubscribeAnswer;
app = initializeApp({
    apiKey: "AIzaSyBnebXFwBM60JbXgAxfpBVLNHwCTpg-Euk",
    authDomain: "test-a2584.firebaseapp.com",
    projectId: "test-a2584",
    storageBucket: "test-a2584.firebasestorage.app",
    messagingSenderId: "830922670530",
    appId: "1:830922670530:web:9c66376eeaa411b438565b"
});

db = getFirestore(app);
auth = getAuth(app);
signInAnonymously(auth).catch(err => console.error("Firebase sign-in error:", err));

// ---------------------------
// SEND OFFER
// ---------------------------
async function sendOffer(roomId, offer) {
    try {
        if (!db) return;
        await setDoc(doc(db, "rooms", roomId, "signaling", "offer"), {
            type: offer.type,
            sdp: offer.sdp
        });
    } catch (err) {
        console.error("sendOffer error:", err);
    }
}

// ---------------------------
// LISTEN FOR OFFER
// ---------------------------
let lastO = null;
let firstO = true;
function listenForOffer(roomId, callback) {
    if (!db) return () => {};
    const offerRef = doc(db, "rooms", roomId, "signaling", "offer");
    return onSnapshot(offerRef, (snap) => {
        try {
            if (firstO){
                firstO = false;
                return;
            }
            if (!snap.exists()) return;
            
            if (typeof peerConnection !== "undefined" && peerConnection.localDescription &&
                    JSON.stringify(snap.data()) == JSON.stringify(peerConnection.localDescription)) return;
            if (lastO && JSON.stringify(snap.data()) == JSON.stringify(lastO)) return;
            lastO = snap.data();
            callback(snap.data());
        } catch (err) {
            console.error("listenForOffer snapshot handler error:", err);
        }
    });
}

// ---------------------------
// SEND ANSWER
// ---------------------------
async function sendAnswer(roomId, answer) {
    try {
        if (!db) return;
        await setDoc(doc(db, "rooms", roomId, "signaling", "answer"), {
            type: answer.type,
            sdp: answer.sdp
        });
    } catch (err) {
        console.error("sendAnswer error:", err);
    }
}

// ---------------------------
// LISTEN FOR ANSWER
// ---------------------------
let lastA = null;
let firstA = true;
function listenForAnswer(roomId, callback) {
    if (!db) return () => {};
    const answerRef = doc(db, "rooms", roomId, "signaling", "answer");
    return onSnapshot(answerRef, (snap) => {
        try {
            if (firstA){
                firstA = false;
                return;
            }
            if (!snap.exists()) return;
            
            if (typeof peerConnection !== "undefined" && peerConnection.localDescription &&
                    JSON.stringify(snap.data()) == JSON.stringify(peerConnection.localDescription)) return;
            if (lastA && JSON.stringify(snap.data()) == JSON.stringify(lastA)) return;
            lastA = snap.data();
            callback(snap.data());
        } catch (err) {
            console.error("listenForAnswer snapshot handler error:", err);
        }
    });
}

let firstMessageO = true;
                        let sprite;

let version;
Feedback.load(()=> version = Feedback.version);
let connected = false;
let host = true;
let dc;
let peerConnection = new RTCPeerConnection()

Event.on("Frame", ()=>{
    try {
        if (!connected) return;
        dc?.send(JSON.stringify({type:"position",x: loader.physic.entyties[0].position.x, y: loader.physic.entyties[0].position.y,time:Date.now()}));
    } catch (err) {
        console.error("Frame event error:", err);
    }
})

Event.on("End", ()=>{
    try {
        if (!dc) return;
        dc.send(JSON.stringify({type:"level", name: loader.currentLevel}));
    } catch (err) {
        console.error("End event error:", err);
    }
});

let onlevel;


document.addEventListener("keydown", async (e)=>{
    try {
        if (e.code == "NumpadMultiply" && e.ctrlKey && e.shiftKey && e.metaKey){
            host = !host;
            try {
                await peerConnection.close();
            } catch (err) {
                console.error("peerConnection.close() error:", err);
            }
            connected = false;
            peerConnection = new RTCPeerConnection();
            if (!host) {
                console.log("Host mode:",host);

                peerConnection.onicecandidate = (event) => {
                    try {
                        if (event.candidate == null) {
                            sendOffer("test-room", peerConnection.localDescription);
                        }
                    } catch (err) {
                        console.error("onicecandidate error:", err);
                    }
                };
                
                dc = peerConnection.createDataChannel(`data${host}`);
                dc.onopen = () => {console.log("data channel opened");connected=true;};
                dc.onclose = () => {console.log("data channel closed");closeConnections();};

                peerConnection.ondatachannel = (event) => {
                    try {
                        console.log(event);
                        
                        
                        const dc = event.channel;
                        dc.onopen = () => {console.log("data channel opened");connected=true;};
                        dc.onclose = () => {console.log("data channel closed");closeConnections();};
                        dc.onmessage = (event) => {
                            try {
                                if(firstMessageO){
                                    firstMessageO = false;
                                    console.log(loader.defaultSettings.p);
                                    
                                    let element = loader.defaultSettings.p.settings
                                    element.x = 0;
                                    element.y = 0;
                                    element.type = "sprite";
                                    loader.addGame(element);
                                    sprite = new Sprite(element);
                                    loader.render.addSprite(sprite);
                                }
                                let data = JSON.parse(event.data);
                                if (data.type == "level"){
                                    level.name = data.name;
                                    Event.off(onlevel);
                                    
                                    onlevel =Event.on("LevelLoading", ()=>{
                                    if (!dc) return;
                                    firstMessageO = false;
                                    console.log(loader.defaultSettings.p);
                                    
                                    let element = loader.defaultSettings.p.settings
                                    element.x = 0;
                                    element.y = 0;
                                    element.type = "sprite";
                                    loader.addGame(element);
                                    sprite = new Sprite(element);
                                    loader.numOfElements++;
                                    loader.render.addSprite(sprite);})
                                    restart();
                                    return;

                                    
                                }
                                if (data.type == "position"){
                                    sprite.position = new Vector(data.x,data.y);
                                }
                                console.log("Received message:", Date.now()-data.time);
                            } catch (err) {
                                console.error("datachannel onmessage error:", err);
                            }
                        }
                    } catch (err) {
                        console.error("ondatachannel handler error:", err);
                    }
                };

                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                listenForAnswer("test-room", async (answer) => {
                    try {
                        console.log("Answer received:", answer);
                        await receiveAnswer(answer);
                    } catch (err) {
                        console.error("listenForAnswer callback error:", err);
                    }
                });
            } else {
                console.log("Host mode:",host);
                try {
                    peerConnection.close();
                } catch (err) {
                    console.error("peerConnection.close() error:", err);
                }
                peerConnection = new RTCPeerConnection();
                unsubscribeOffer = listenForOffer("test-room", async (offer) => {
                    try {
                        console.log("Offer received:", offer);
                        await makeAnswer(offer);
                    } catch (err) {
                        console.error("listenForOffer callback error:", err);
                    }
                });
            }
        }
    } catch (err) {
        console.error("keydown handler error:", err);
    }
})

async function makeAnswer(sdp){
    try {
        peerConnection.onicecandidate = (event) => {
            try {
                if (event.candidate == null) {
                    sendAnswer("test-room", peerConnection.localDescription);     
                }
            } catch (err) {
                console.error("onicecandidate error in makeAnswer:", err);
            }
        };

        dc = peerConnection.createDataChannel(`data${host}`);
        dc.onopen = () => {console.log("data channel opened");connected=true;};
        dc.onclose = () => {console.log("data channel closed");closeConnections();};

        peerConnection.ondatachannel = (event) => {
            try {
                const dc = event.channel;
                console.log(event);

                // let firstMessageA = true;
                dc.onopen = () => {console.log("data channel opened");connected=true;};
                dc.onclose = () => {console.log("data channel closed");closeConnections();};
                dc.onmessage = (event) => {
                            try {
                                if(firstMessageO){
                                    firstMessageO = false;
                                    console.log(loader.defaultSettings.p);
                                    
                                    let element = loader.defaultSettings.p.settings
                                    element.x = 0;
                                    element.y = 0;
                                    element.type = "sprite";
                                    loader.addGame(element);
                                    sprite = new Sprite(element);
                                    loader.render.addSprite(sprite);
                                }
                                let data = JSON.parse(event.data);
                                if (data.type == "level"){
                                    level.name = data.name;
                                    Event.off(onlevel);
                                    
                                    onlevel =Event.on("LevelLoading", ()=>{
                                    if (!dc) return;
                                    firstMessageO = false;
                                    console.log(loader.defaultSettings.p);
                                    
                                    let element = loader.defaultSettings.p.settings
                                    element.x = 0;
                                    element.y = 0;
                                    element.type = "sprite";
                                    loader.addGame(element);
                                    sprite = new Sprite(element);
                                    loader.numOfElements++;
                                    loader.render.addSprite(sprite);})
                                    restart();
                                    return;

                                    
                                }
                                if (data.type == "position"){
                                    sprite.position = new Vector(data.x,data.y);
                                }
                                console.log("Received message:", Date.now()-data.time);
                            } catch (err) {
                                console.error("datachannel onmessage error:", err);
                            }
                        }
            } catch (err) {
                console.error("ondatachannel handler error in makeAnswer:", err);
            }
        };
        await peerConnection.setRemoteDescription(sdp);
        let answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer);
    } catch (err) {
        console.error("makeAnswer error:", err);
    }
}

function closeConnections(){
    try {
        connected = false;
        hostMode()
        if (unsubscribeOffer) unsubscribeOffer();
        if (unsubscribeAnswer) unsubscribeAnswer();
        try {
            peerConnection.close();
        } catch (err) {
            console.error("peerConnection.close() error in closeConnections:", err);
        }
        peerConnection = new RTCPeerConnection();
    } catch (err) {
        console.error("closeConnections error:", err);
    }
}

async function receiveAnswer(sdp){
    try {
        await peerConnection.setRemoteDescription(sdp);
    } catch (err) {
        console.error("receiveAnswer error:", err);
    }
}
function hostMode(){
    try {
        host = true;
        Event.off(onlevel);
        console.log("Host mode:",host);
        try {
            peerConnection.close();
        } catch (err) {
            console.error("peerConnection.close() error in hostMode:", err);
        }
        peerConnection = new RTCPeerConnection();
        unsubscribeAnswer = listenForOffer("test-room", async (offer) => {
            try {
                console.log("Offer received:", offer);
                await makeAnswer(offer);
            } catch (err) {
                console.error("listenForOffer callback error in hostMode:", err);
            }
        });
    } catch (err) {
        console.error("hostMode error:", err);
    }
}

hostMode();

}catch(e){console.error(e);}