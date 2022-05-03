import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      playersGuess: null,
      pastGuesses: [],
      winningNumber: null, //generateWinningNumber();
      status: "",
      hint: [],
    };
    this.checkGuess = this.checkGuess.bind(this);
    this.playersGuessSubmission = this.playersGuessSubmission.bind(this);
  }

  componentDidMount() {
    this.generateWinningNumber();
  }

  generateWinningNumber() {
    return this.setState({
      winningNumber: Math.floor(Math.random() * 100) + 1,
    });
  }

  shuffle(arr) {
    let m = arr.length, //4
      t,
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = arr[m]; //4
      arr[m] = arr[i];
      arr[i] = t;
    }
    return this.setState({ hint: arr });
  }

  difference() {
    let diff = this.state.playersGuess - this.state.winningNumber;
    // console.log("diff", Math.abs(diff));
    return Math.abs(diff);
  }

  isLower() {
    return this.state.playersGuess < this.state.winningNumber;
  }

  //add ternary so this only runs if playersGuess is not null
  playersGuessSubmission(ev) {
    ev.preventDefault();
    let num = this.state.playersGuess;
    console.log("num", num);
    console.log("typeof", typeof num);
    if (num < 1 || num > 100 || isNaN(num)) {
      this.setState({ status: "Must guess a number between 1-100" });
      throw "That is an invalid guess.";
    }
    // this.setState({ pastGuesses: [...this.state.pastGuesses, num] });

    console.log(this.state);
    return this.checkGuess();
  }

  checkStatus() {
    if (this.state.playersGuess === this.state.winningNumber) {
      return "You Win!";
    }
    if (this.difference() < 10) {
      return "You're burning up!";
    }
    if (this.difference() < 25) {
      return "You're lukewarm.";
    }
    if (this.difference() < 50) {
      return "You're a bit chilly.";
    }
    if (this.difference() < 100) {
      return "You're ice cold!";
    }
  }

  checkGuess() {
    const status = this.checkStatus();
    if (this.state.pastGuesses.includes(this.state.playersGuess)) {
      return this.setState({ status: "You have already guessed that number." });
    } else {
      const newState = [...this.state.pastGuesses, this.state.playersGuess];
      return this.setState({
        pastGuesses: newState,
        status:
          newState.length > 4 && !newState.includes(this.state.winningNumber)
            ? "You Lose!"
            : status,
      });
    }
  }

  provideHint() {
    let hint = [];
    hint.push(this.state.winningNumber);
    while (hint.length < 3) {
      const hintNum = Math.floor(Math.random() * 100) + 1;
      hint.push(hintNum);
    }
    console.log("hint", hint);

    return this.shuffle(hint);
  }

  newGame() {
    this.setState({
      playersGuess: null,
      pastGuesses: [],
      winningNumber: null,
      status: "",
      hint: [],
    });
    this.generateWinningNumber();
  }
  clear() {
    document.querySelector("input").value = "";
  }

  render() {
    console.log("state", this.state);
    const hintDiv = this.state.pastGuesses.includes(this.state.winningNumber)
      ? null
      : this.state.hint.map((hint) => {
          return <div key={hint}> {hint}</div>;
        });
    const prevGuesses = this.state.pastGuesses.map((guess) => {
      return (
        <div key={guess} className="guess">
          {guess}
        </div>
      );
    });
    const instructions = this.state.pastGuesses.length ? null : (
      <p>
        Guess a number between 1-100, <br></br> you only have 5 chances!{" "}
        <br></br> Good luck!
      </p>
    );
    const hintInstructions =
      this.state.pastGuesses.includes(this.state.winningNumber) ||
      this.state.pastGuesses.length < 3 ||
      this.state.pastGuesses.length > 4 ? null : (
        <p>You can ask for a hint!</p>
      );

    return (
      <div className="main">
        <h1>My Guessing Game</h1>
        <div className="hint">{hintDiv}</div>
        <h3>Previous Guesses: </h3>
        <div className="guess_div">{prevGuesses}</div>

        <form onSubmit={this.playersGuessSubmission} className="form">
          <input
            placeholder="input guess"
            onChange={(ev) =>
              this.setState({ playersGuess: parseInt(ev.target.value) })
            }
          />

          <button
            type="submit"
            disabled={
              this.state.pastGuesses.length > 4 ||
              this.state.pastGuesses.includes(this.state.winningNumber)
            }
            className="submit"
            value={this.state.playersGuess}
            onClick={() => this.clear()}
          >
            Submit Guess
          </button>
        </form>
        <div className="buttons">
          <button
            className={
              !this.state.pastGuesses.includes(this.state.winningNumber) &&
              this.state.pastGuesses.length < 5
                ? "disabled"
                : null
            }
            onClick={() => this.newGame()}
            disabled={
              !this.state.pastGuesses.includes(this.state.winningNumber) &&
              this.state.pastGuesses.length < 5
            }
          >
            Play Again
          </button>
          <button
            className={
              this.state.pastGuesses.length > 4 ||
              this.state.pastGuesses.includes(this.state.winningNumber) ||
              this.state.pastGuesses.length < 3
                ? "disabled"
                : null
            }
            disabled={
              this.state.pastGuesses.length > 4 ||
              this.state.pastGuesses.includes(this.state.winningNumber) ||
              this.state.pastGuesses.length < 3
            }
            onClick={() => this.provideHint()}
          >
            Hint
          </button>
          <div className="status">{this.state.status}</div>
        </div>
        <div className="instructions">{instructions}</div>
        <div className="hint_instructions">{hintInstructions}</div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
