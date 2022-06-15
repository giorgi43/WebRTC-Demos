var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({port: 8080});

var users = {};

wss.on('connection', function(conn) {
    console.log("user connected");

    conn.send("hello from server");

    conn.on('message', function(msg) {
        var data;
        // accept only JSON messaged
        try {
            data = JSON.parse(msg)
        } catch (e) {
            console.log("invalid JSON");
            data = {};
        }

        switch (data.type) {
            case 'login':
                console.log("user connected with name: ", data.name);

                // if already exists, refuse login
                if (users[data.name]) {
                    sendTo(conn, {
                        type: 'login',
                        success: false
                    });
                } else {
                    // save user on server
                    users[data.name] = conn;
                    conn.name = data.name;

                    sendTo(conn, {
                        type: 'login',
                        success: true
                    });
                }
                break;
            default:
                sendTo(conn, {
                    type: 'error',
                    message: "command not found: " + data.type
                })
                break;
        }

    });

    conn.on('close', function() {
        if (conn.name) {
            console.log("user closed connection: ", conn.name);
            delete users[conn.name];
        }
    })
    
});


function sendTo(conn, msg) {
    conn.send(JSON.stringify(msg));
}