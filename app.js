const express = require("express");
const State = require("./game/state");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

io.on("connection", onConnect);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}.`));

let state;
function emitGameUpdate(client) {
    client.emit("gameUpdate", {
        progress: state.progress,
        guessed: state.guessed,
        remaining: state.remainingGuesses()
    });
}

function onConnect(client) {
    state = new State("pineapple");
    emitGameUpdate(client);

    client.on("guess", (letter) => {
        if (letter?.length !== 1 || state.remainingGuesses() <= 0)
            return;

        state.guess(letter);
        emitGameUpdate(client);

        // Game over
        if (state.remainingGuesses() === 0 || state.won()) {
            client.emit("gameOver", {
                solution: state.solution,
                victory: state.won()
            });
        }
    });

    client.on("disconnect", () => console.log(`${client.id} disconnected.`));
}