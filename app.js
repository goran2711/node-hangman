const express = require("express");
const State = require("./game/state");
const Room = require("./game/room");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

io.on("connection", onConnect);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}.`));

let room;
let started = false;
function onConnect(client) {
    if (room == undefined)
        room = new Room(io);

    if (!started) {
        room.addClient(client);
        if (room.clients.length === 2)
            room.start("pineapple");
    }

    client.on("disconnect", () => console.log(`${client.id} disconnected.`));
}