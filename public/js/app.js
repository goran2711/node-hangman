const socket = io();

const $guess = document.querySelector("#guess");
const $remaining = document.querySelector("#remaining");
const $buttons = document.getElementsByName("all");

const guessed = new Set();

disableAllButtons();

socket.on("gameUpdate", (state) => {
    $guess.innerHTML = state.progress.join(" ");
    $remaining.innerHTML = state.remaining;
    state.guessed.forEach(guess => guessed.add(guess));
    console.log("Got update, guessed:");
    console.log(guessed);
});

socket.on("yourTurn", () => {
    console.log("My turn! Enabling available, guessed:");
    console.log(guessed);
    enableAvailableButtons();
});

socket.on("gameOver", (result) => {
    $guess.innerHTML = result.solution.join(" ");
    $remaining.innerHTML = `You ${result.victory ? "win" : "lose"}!`;
    disableAllButtons();
});

function guess(id) {
    guessed.add(id);
    disableAllButtons();
    socket.emit("guess", id);
}

function disableAllButtons() {
    $buttons.forEach(button => button.setAttribute("disabled", "disabled"));
}

function enableAvailableButtons() {
    for (const button of $buttons) {
        if (!guessed.has(button.id)) {
            console.log(`'${button.id}' has NOT been guessed`);
            button.removeAttribute("disabled");
        }
        else console.log(`'${button.id}' has been guessed`);
    }
}