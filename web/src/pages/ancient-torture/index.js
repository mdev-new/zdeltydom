import React, { Component } from "react";
import "./styles.css";

// lore
// pruvodce - globglobgabgalab
// globglobgabgalab ma rad knihy a zamkne te ve sklepe
// dokud neopises vsechno co ti naserviruje (budes low budget mnich)

// za 100% spravne cviceni - bonus body, gify na oslavu, atd

class Writing extends Component {
  state = {
    text: "",
    inputValue: "",
    lastLetter: "",
    words: [],
    completedWords: [],
    wordStates: [],
    completed: false,
    startTime: undefined,
    timeElapsed: 0,
    started: false,
    progress: 0,
    mistakes: 0
  };

  startLesson = () => {
    this.setState({
      completedWords: [],
      started: true,
      completed: false,
      progress: 0,
      mistakes: 0,
      wordStates: []
    });

    this.props.functions.httpsCallable('getLesson')().then(text => {
        const t_obj = text?.data
        const txt = t_obj?.text

        this.setState({
          text: txt || null,
          words: txt?.split(" "),
        });
    });
  };

  handleChange = async e => {
    const { words, completedWords, wordStates, progress } = this.state;
    const inputValue = e.target.value;
    const lastLetter = inputValue[inputValue.length - 1];

    // first letter of the lesson just typed, start the timer.
    if(inputValue.length == 1 && progress == 0) {
      this.setState({
        startTime: Date.now(),
        timeElapsed: 0
      });
    }

    const currentWord = words[0];

    // if space or '.', check the word
    if (lastLetter === " " || lastLetter === ".") {

      const newWords = [...words.slice(1)];
      const newCompletedWords = [...completedWords, currentWord];
      const newWordStates = [...wordStates, inputValue.trim() === currentWord];

      const newMistakes = newWordStates.filter(f => f === false).length

      // Get the total progress by checking how much words are left
      const newProgress = (newCompletedWords.length / (newWords.length + newCompletedWords.length)) * 100;

      this.setState({
        words: newWords,
        completedWords: newCompletedWords,
        inputValue: "",
        completed: newWords.length === 0,
        progress: newProgress,
        wordStates: newWordStates,
        mistakes: newMistakes
      });

      if(newProgress === 100 && newWords.length === 0) {
        await this.props.functions.httpsCallable('setNextLesson')();
      }

    } else {
      this.setState({
        inputValue: inputValue,
        lastLetter: lastLetter
      });
    }
  };

  render() {
    const {
      text,
      inputValue,
      completedWords,
      timeElapsed,
      started,
      completed,
      progress,
      wordStates,
      mistakes
    } = this.state;

    if (!started) {
      return (
        <div className="container">
          <button className="start-btn" onClick={this.startLesson}>
            Začít psát
          </button>
        </div>
      );
    }

    if (!text) return <div className="container"><p className="p">Načítám...<br />Pokud to trvá dlouho, asi se někde stala chyba :(</p></div>;

    if (completed) {
      return (
        <div className="container">
          { mistakes !== 0 ? <>
            <h2 className="h2">
              Počet chyb: <strong>{mistakes} ({(mistakes / completedWords.length * 100).toFixed(1)}%)</strong>
            </h2>
            </>
            : <>
            <h2 className="h2">
              Bez chyby! Za odměnu tě pustím dál!
            </h2>
            </>
          }
          <button className="start-btn" onClick={this.startLesson}>
            Další cvičení
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="container">
          <h4>Opiš.</h4>
          <progress value={progress} max="100" />
          <p className="text">
            {text.split(" ").map((word, w_idx) => {
              let highlight = "";
              let currentWord = false;

              if (completedWords.length === w_idx) {
                currentWord = true;
              } else if (completedWords.length > w_idx) {
                highlight = wordStates[w_idx] ? "green" : "red";
              }

              return (
                <span
                  className={`word ${highlight} ${currentWord && "underline"}`}
                  key={w_idx}
                >
                  {word.split("").map((letter, l_idx) => {
                    const isCurrentWord = w_idx === completedWords.length;
                    const isWronglyTyped = letter !== inputValue[l_idx];
                    const shouldBeHighlighted = l_idx < inputValue.length;

                    return (
                      <span
                        className={`letter ${
                          isCurrentWord && shouldBeHighlighted
                            ? isWronglyTyped
                              ? "red"
                              : "green"
                            : ""
                        }`}
                        key={l_idx}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </p>
          <input
            type="text"
            onChange={this.handleChange}
            onKeyDown={(event) => {
              if (event.which == 8 || event.which == 46) { 
                event.preventDefault();
              }
            }}
            onPaste={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            autocomplete="off"
            value={inputValue}
            autoFocus={true}
          />
        </div>
      </div>
    );
  }
}

export default Writing;
