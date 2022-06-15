let signalingServer = new WebSocket('ws://localhost:8080');

let username = document.querySelector('#username');
let connectBtn = document.querySelector('#connectBtn');

connectBtn.addEventListener('click', function(e) {
    sendMessage({
        type: 'login',
        name: username.value
    });
});

signalingServer.onmessage = function(message) {
    console.log("Got message:", message.data);
}


function sendMessage(message) {
    signalingServer.send(JSON.stringify(message))
}