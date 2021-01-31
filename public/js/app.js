const socket = io();

const $guess = document.querySelector("#guess");
const $remaining = document.querySelector("#remaining");

socket.on("gameUpdate", (state) => {
    $guess.innerHTML = state.progress.join(" ");
    $remaining.innerHTML = state.remaining;
});

socket.on("gameOver", (result) => {
    $guess.innerHTML = result.solution.join(" ");
    $remaining.innerHTML = `You ${result.victory ? "win" : "lose"}!`;
});

function guess(id) {
    const button = document.querySelector('#' + id);
    button.setAttribute("disabled", "disabled");
    socket.emit("guess", id);
}