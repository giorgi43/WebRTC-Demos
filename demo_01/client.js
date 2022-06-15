let signalingServer = new WebSocket('ws://192.168.1.16:8080');

let username = document.querySelector('#username');
let loginBtn = document.querySelector('#loginBtn');

let connectBtn = document.querySelector('#connectTo');
let otherName = document.querySelector('#otherName');

var pc;

// login
loginBtn.addEventListener('click', function(e) {
    sendMessage({
        type: 'login',
        name: username.value
    });
});

connectBtn.addEventListener('click', async function(e) {

    var peerName = otherName.value;

    // make offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    sendMessage({
        type: 'offer',
        offer: offer,
        from: username.value,
        to: peerName
    });

});

signalingServer.onmessage = async function(message) {

    var data = JSON.parse(message.data);

    switch (data.type) {
        case 'login':
            onLogin(data.success);
            break;
        case 'offer':
            await onOffer(data.offer, data.from);
            break;
        case 'answer':
            await onAnswer(data.answer);
            break;
        case 'candidate':
            onCandidate(data.candidate);
            break;
    }
}

signalingServer.onclose = function() {
    console.log("Signaling server closed");
}

signalingServer.onopen = function() {
    console.log("Connected to signaling server");
}

signalingServer.onerror = function(err) {
    console.log("Signaling server error", err);
}

function onLogin(success) {

    if (!success) {
        alert("Login failed");
    }

    console.log('login was successful');
    
    startRtc();
    // when browser finds ice candidate send it to peer
    pc.onicecandidate = function (event) {
        if (event.candidate) {
            console.log("sending ice candidate");
            sendMessage({
                type: "candidate", 
                candidate: event.candidate,
                to: otherName.value,
                from: username.value 
            });
        } 
    };

    pc.icegatheringstatechange = function (event) {
        let c = e.target;
        switch (c.iceGatheringState) {
            case "gathering":
                console.log("ice gathering state");
                break;
            case "complete":
                console.log("ice complete state");
                break;
            case "new":
                console.log("ice new state");
                break;
        }
    };

    pc.onconnectionstatechange = function (event) {
        switch(pc.connectionState) {
            case "new":
            case "checking":
              console.log("Connecting...");
              break;
            case "connected":
              console.log("Online");
              break;
            case "disconnected":
              console.log("Disconnecting...");
              break;
            case "closed":
              console.log("Offline");
              break;
            case "failed":
              console.log("Error");
              break;
            default:
              console.log("Unknown");
              break;
        }
    };
}

async function onOffer(offer, sender) {
    console.log('got offer');
    pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    sendMessage({
        type: 'answer',
        answer: answer,
        from: username.value,
        to: sender
    });
}

async function onAnswer(answer) { 
    console.log("got answer");
    await pc.setRemoteDescription(new RTCSessionDescription(answer)); 
 } 
  
 function onCandidate(candidate) { 
    console.log('got candidate');
    pc.addIceCandidate(new RTCIceCandidate(candidate)); 
 }	

function startRtc() {
    var configuration = { 
        "iceServers": [{ "url": "stun:stun.1.google.com:19302" }] 
    }; 

    console.log("starting WebRTC")

    pc = new RTCPeerConnection(configuration);

}

function sendMessage(message) {
    signalingServer.send(JSON.stringify(message))
}