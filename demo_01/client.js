let signalingServer = new WebSocket('ws://192.168.1.16:8080');

let username = document.querySelector('#username');
let connectBtn = document.querySelector('#connectBtn');

let otherName = document.querySelector('#otherName');
let textField = document.querySelector('#textField');
let sendMsg = document.querySelector('#sendMsg');

connectBtn.addEventListener('click', function(e) {
    sendMessage({
        type: 'login',
        name: username.value
    });
});

sendMsg.addEventListener('click', function(e) {
    sendMessage({
        type: 'offer',
        name: otherName.value,
        offer: textField.value
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