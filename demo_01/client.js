let signalingServer = new WebSocket('ws://192.168.1.16:8080');

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

    var data = JSON.parse(message.data);

    console.log(data);
    // switch (message.data.type) {
    //     case 'login'
    // }
}

function sendMessage(message) {
    signalingServer.send(JSON.stringify(message))
}