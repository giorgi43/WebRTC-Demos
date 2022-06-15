let signalingServer = new WebSocket('ws://192.168.1.16:8080');

let username = document.querySelector('#username');
let loginBtn = document.querySelector('#loginBtn');

// let offerOtherName = document.querySelector('#offerOtherName');
// let offerTextField = document.querySelector('#offerTextField');
// let sendOffer = document.querySelector('#sendOffer');

// let answerOtherName = document.querySelector('#answerOtherName');
// let answerTextField = document.querySelector('#answerTextField');
// let sendAnswer = document.querySelector('#sendAnswer');


let connectBtn = document.querySelector('#connectTo');
let otherName = document.querySelector('#otherName');

connectBtn.disabled = true;
otherName.disabled = true;

let pc;

// login
loginBtn.addEventListener('click', function(e) {
    sendMessage({
        type: 'login',
        name: username.value
    });
});

connectBtn.addEventListener('click', function(e) {
    startRtc();
});

// // offer
// sendOffer.addEventListener('click', function(e) {
//     sendMessage({
//         type: 'offer',
//         to: offerOtherName.value,
//         from: username.value,
//         offer: offerTextField.value
//     });
// });

// // answer
// sendAnswer.addEventListener('click', function(e) {
//     sendMessage({
//         type: 'answer',
//         to: answerOtherName.value,
//         from: username.value,
//         answer: answerTextField.value
//     });
// });

signalingServer.onmessage = function(message) {

    var data = JSON.parse(message.data);

    switch (data.type) {
        case 'login':
            onLogin(data.success);
            break;
        case 'offer':
            onOffer()
            break;
        case 'answer':
            onAnswer();
            break;
        case 'candidate':
            onCandidate();
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

    connectBtn.disabled = false;
    otherName.disabled = false;
    
}

function startRtc() {
    var configuration = { 
        "iceServers": [{ "url": "stun:stun.1.google.com:19302" }] 
    }; 

    console.log("Login was sucessful, starting WebRTC")

    pc = new RTCPeerConnection(configuration);

    // when browser finds ice send it to peer
    pc.onicecandidate = function (event) {
        if (event.candidate) {
            console.log("sending ice candidate");
            sendMessage({
                type: "candidate", 
                candidate: event.candidate,
                to: otherName.value
            });

        } 
    }; 
}

function sendMessage(message) {
    signalingServer.send(JSON.stringify(message))
}