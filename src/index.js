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
    return arr;
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
      throw "That is an invalid guess.";
    }
    // this.setState({ pastGuesses: [...this.state.pastGuesses, num] });

    console.log(this.state);
    return this.checkGuess();
  }

  checkGuess() {
    console.log("checkguess diff", this.difference());
    let dif = this.difference();
    console.log("dif", dif);

    if (this.state.playersGuess === this.state.winningNumber) {
      return this.setState({ status: "You Win!" });
    }
    if (this.state.pastGuesses.includes(this.playersGuess)) {
      return this.setState({ status: "You have already guessed that number." });
    } else {
      this.setState({
        pastGuesses: [...this.state.pastGuesses, this.state.playersGuess],
      });
      if (this.state.pastGuesses.length > 4) {
        return this.setState({ status: "You Lose!" });
      }
    }

    if (this.difference() < 10) {
      return this.setState({ status: "You're burning up!" });
    }
    if (this.difference() < 25) {
      return this.setState({ status: "You're lukewarm." });
    }
    if (this.difference() < 50) {
      return this.setState({ status: "You're a bit chilly." });
    }
    if (this.difference() < 100) {
      return this.setState({ status: "You're ice cold!" });
    }
    console.log("state after check", this.state);
  }

  provideHint() {
    let hint = [];
    hint.push(this.winningNumber);
    while (hint.length < 3) {
      hint.push(generateWinningNumber());
    }
    return shuffle(hint);
  }
  render() {
    console.log("state", this.state);
    return (
      <div>
        <h1>My Guessing Game</h1>
        <h3>Previous Guesses</h3>
        <form onSubmit={this.playersGuessSubmission}>
          <input
            placeholder="input guess"
            onChange={(ev) =>
              this.setState({ playersGuess: parseInt(ev.target.value) })
            }
          />
          <button type="submit">Submit Guess</button>
          <button>Play Again</button>
          <button>Hint</button>
        </form>
        <div>{this.state.status}</div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
