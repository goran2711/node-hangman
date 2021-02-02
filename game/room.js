const uuid = require("../utils/uuid");
const State = require("./state");

class Room {
    constructor(io) {
        this.io = io;
        this.name = uuid();
        this.clients = [];
        this.currentGuesser;
        this.state;
    }

    addClient(client) {
        this.clients.push(client);
    }

    start(solution) {
        console.log("started game");
        this.state = new State(solution);

        this.currentGuesser = 0;
        this.clients.forEach(client => {
            client.join(this.name);

            client.on("guess", letter => {
                if (this.clients.indexOf(client) !== this.currentGuesser)
                    return;
                
                this.guessHandler(letter);
            });

            this.emitGameUpdate();
        });

        this.emitGameUpdate();
        this.clients[this.currentGuesser].emit("yourTurn");
    }

    guessHandler(letter) {
        if (letter?.length !== 1 || this.state.remainingGuesses() <= 0)
            return;
    
        this.state.guess(letter);
        this.emitGameUpdate();
    
        // Game over
        if (this.state.remainingGuesses() === 0 || this.state.won()) {
            return this.io.to(this.name).emit("gameOver", {
                solution: this.state.solution,
                victory: this.state.won()
            });
        }

        this.currentGuesser = this.currentGuesser === (this.clients.length - 1) ? 0 : this.currentGuesser + 1;
        this.clients[this.currentGuesser].emit("yourTurn");
    }

    emitGameUpdate() {
        this.io.to(this.name).emit("gameUpdate", {
            progress: this.state.progress,
            guessed: this.state.guessed,
            remaining: this.state.remainingGuesses()
        });
    }
}

module.exports = Room;