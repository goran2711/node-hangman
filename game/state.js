class State {
    constructor(solution, numGuesses = 5) {
        this.solution = [...solution.toLowerCase()];
        this.guessed = [];
        this.numGuesses = numGuesses;
        this.progress = Array(this.solution.length).fill('_');
    }

    won() {
        return !this.progress.includes('_');
    }

    remainingGuesses() {
        return this.numGuesses;
    }

    guess(letter) {
        letter = letter.toLowerCase();
        if (this.guessed.includes(letter))
            return false;

        const positions = this.solution.reduce((found, val, i) => {
            if (val === letter)
                found.push(i);
            return found;
        }, []);

        if (positions.length === 0)
            this.numGuesses -= 1;

        positions.forEach(i => this.progress[i] = letter);

        this.guessed.push(letter);
        return positions.length > 0;
    }
}

module.exports = State;