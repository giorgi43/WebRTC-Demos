let signalingServer = new WebSocket('ws://192.168.1.16:8080');

let username = document.querySelector('#username');
let connectBtn = document.querySelector('#connectBtn');

let offerOtherName = document.querySelector('#offerOtherName');
let offerTextField = document.querySelector('#offerTextField');
let sendOffer = document.querySelector('#sendOffer');

let answerOtherName = document.querySelector('#answerOtherName');
let answerTextField = document.querySelector('#answerTextField');
let sendAnswer = document.querySelector('#sendAnswer');


// login
connectBtn.addEventListener('click', function(e) {
    sendMessage({
        type: 'login',
        name: username.value
    });
});

// offer
sendOffer.addEventListener('click', function(e) {
    sendMessage({
        type: 'offer',
        to: offerOtherName.value,
        from: username.value,
        offer: offerTextField.value
    });
});

// answer
sendAnswer.addEventListener('click', function(e) {
    sendMessage({
        type: 'answer',
        to: answerOtherName.value,
        from: username.value,
        offer: answerTextField.value
    });
});

signalingServer.onmessage = function(message) {
    console.log("Got message:", message.data);

    var data = JSON.parse(message.data);

    switch (data.type) {
        case 'login':
            console.log("user login status:", data);
            break;
        case 'offer':
            console.log("received offer:", data);
            break;
        case 'answer':
            console.log("received answer:", data);
            break;
    }
}

function sendMessage(message) {
    signalingServer.send(JSON.stringify(message))
}