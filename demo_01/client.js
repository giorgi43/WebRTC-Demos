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

let pc;

// login
loginBtn.addEventListener('click', function(e) {
    sendMessage({
        type: 'login',
        name: username.value
    });
});

connectBtn.addEventListener('click', function(e) {

    var peerName = otherName.value;

    // make offer
    pc.createOffer(function (offer) {
        console.log('create offer: ', offer);
        sendMessage({
            type: 'offer',
            to: peerName,
            from: username.value,
            offer: offer
        });

        pc.setLocalDescription(offer);
    }, function (error) {
        console.log("createOffer error:", error);
    });


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
            onOffer(data.offer, data.from);
            break;
        case 'answer':
            onAnswer(data.answer);
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

function onOffer(offer, username) {
    pc.setRemoteDescription(new RTCSessionDescription(offer));

    pc.createAnswer(function(ans) {
        sendMessage({
            to: username,
            type: 'answer',
            answer: ans
        })
    }, function(error) {
        alert('error');
    });
}

function onAnswer(answer) { 
    pc.setRemoteDescription(new RTCSessionDescription(answer)); 
 } 
  
 function onCandidate(candidate) { 
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