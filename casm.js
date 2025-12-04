import Feedback from "./feedback.js"
import {LevelLoader,Sprite} from "https://unpkg.com/type3games-engine/engine.js"
import {Event} from "https://unpkg.com/type3games-engine/coretools.js"
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
    import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
    import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

    // --- Firebase init ---
let app, db, auth;
try {
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
} catch (err) {
    console.error("Firebase init error:", err);
    // continue without firebase
}

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
        try {
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
                } catch (inner) {
                    console.error("listenForOffer callback error:", inner);
                }
            });
        } catch (err) {
            console.error("listenForOffer error:", err);
            return () => {};
        }
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
        try {
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
                } catch (inner) {
                    console.error("listenForAnswer callback error:", inner);
                }
            });
        } catch (err) {
            console.error("listenForAnswer error:", err);
            return () => {};
        }
    }
    

let version;
try { Feedback.load(()=> version = Feedback.version); } catch (err) { console.error("Feedback.load error:", err); }
let connected = false;
let host = true;
let dc;
let peerConnection = new RTCPeerConnection()

Event.on("Frame", ()=>{
        try {
            if (!connected) return;
            try {
                dc.send(JSON.stringify({type:"ping",time:Date.now()}));
            } catch (err) {
                console.error("DataChannel send error:", err);
            }
        } catch (err) {
            console.error("Frame handler error:", err);
        }
})

document.addEventListener("keydown", async (e)=>{
        try {
            if (e.code == "NumpadMultiply" && e.ctrlKey && e.shiftKey && e.metaKey){
                    host = !host;
                    try { await peerConnection.close(); } catch(e){/*ignore*/} 
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
                    
                    try {
                        dc = peerConnection.createDataChannel("casm-dc");
                        dc.onopen = () => {console.log("data channel opened");connected=true;};
                        dc.onclose = () => console.log("data channel closed");
                    } catch (err) {
                        console.error("createDataChannel error:", err);
                    }

                    try {
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
                    } catch (err) {
                        console.error("createOffer/setLocalDescription error:", err);
                    }
            } else {
                    console.log("Host mode:",host);
                    try { peerConnection.close(); } catch(e){/*ignore*/} 
                    peerConnection = new RTCPeerConnection();
                    try {
                        listenForOffer("test-room", async (offer) => {
                                try {
                                    console.log("Offer received:", offer);
                                    await makeAnswer(offer);
                                } catch (err) {
                                    console.error("listenForOffer callback error:", err);
                                }
                        });
                    } catch (err) {
                        console.error("listenForOffer setup error:", err);
                    }
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
                        console.error("onicecandidate (answer) error:", err);
                    }
                };
                peerConnection.ondatachannel = (event) => {
                    try {
                        const dc = event.channel;
                        dc.onopen = () => console.log("data channel opened");
                        dc.onclose = () => console.log("data channel closed");
                        dc.onmessage = (event) => {
                                try {
                                    console.log("Received message:", Date.now()-JSON.parse(event.data).time);
                                } catch (err) {
                                    console.error("datachannel onmessage error:", err);
                                }
                        }
                    } catch (err) {
                        console.error("ondatachannel handler error:", err);
                    }
                };
                await peerConnection.setRemoteDescription(sdp);
                let answer = await peerConnection.createAnswer()
                await peerConnection.setLocalDescription(answer);
        } catch (err) {
            console.error("makeAnswer error:", err);
        }
}

async function receiveAnswer(sdp){
        try {
            await peerConnection.setRemoteDescription(sdp);
        } catch (err) {
            console.error("receiveAnswer error:", err);
        }
}

try {
    console.log("Host mode:",host);
    try { peerConnection.close(); } catch(e){/*ignore*/} 
    peerConnection = new RTCPeerConnection();
    listenForOffer("test-room", async (offer) => {
            try {
                console.log("Offer received:", offer);
                await makeAnswer(offer);
            } catch (err) {
                console.error("listenForOffer initial callback error:", err);
            }
    });
} catch (err) {
    console.error("initial setup error:", err);
}