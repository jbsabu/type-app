import words from "an-array-of-english-words";
import { useState, useEffect, useRef } from "react";
// import ReactApexChart from ApexCharts
// import ApexCharts from 'react-apexcharts';

const seqLength = 100;
//const wordLength = 4;

export default function Main() {
  let time = new Date();
  const [wordSequence, setWordSeq] = useState("");
  const [typedWords, setTypedWords] = useState([]);
  const [cTime, setCTime] = useState([
    time.getMilliseconds(),
    time.getSeconds(),
    time.getMinutes(),
  ]);
  const [timerTime, setTimerTime] = useState("0 : 0 : 0");
  const [accuracyData, setAccuracyData] = useState({});
  const inputRef = useRef(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [typedCorrect, setTypedCorrect] = useState(0);
  const [wordLength, setWordLength] = useState(5);
  const [timeSetting, setTimeSetting] = useState(15);
  const [testCompleted, setTestCompleted] = useState(false);

  let [ms, sec, min] = cTime;

  const handleInput = (e) => {
    // handle input
    if (!typedWords.length && e.key !== "enter") {
      setTimer("start");
    } else if (e.key === "enter") {
      setTimer("reset");
    }
    if (testCompleted) {
      return;
    }

    setTypedCorrect(countCorrectWords());
    const typedText = e.target.value.trim();
    setTypedWords(typedText.split(" "));
    const accuracyAtSecond = (60 / secondsElapsed) * typedCorrect;
    const accData = structuredClone(accuracyData);
    accData[secondsElapsed] = accuracyAtSecond;
    setAccuracyData(accData);

  };

  const createWords = () => {
    let seq = "";

    for (let i = 0; i < seqLength; i++) {
      for (
        let j = Math.floor(Math.random() * words.length);
        j < words.length;
        j++
      ) {
        if (words[j].length <= wordLength) {
          seq = `${seq} ${words[j]}`;
          break;
        } else continue;
      }
    }
    setWordSeq(seq.trim());
  };

  useEffect(() => {
    createWords();
    const handleKeyPress = (e) => {
      if (!testCompleted) {
        inputRef.current.focus(); // handle input focus
      }
    };

    window.addEventListener("keypress", handleKeyPress); // auto focus input box when typing begins
    createWords();
  }, []);
     const [intervalId, setIntervalId] = useState(null);


    const readSetState = (state, arg) => {
    setSecondsElapsed(arg);

  };

  const setTimer = (state) => {
    // timer

    switch (state) {
      case "start":
        if (!intervalId) {
          const startTime = new Date();
          const id = setInterval(() => {
            const elapsedTime = new Date() - startTime;
            const minutes = Math.floor(elapsedTime / 60000);
            const seconds = Math.floor((elapsedTime % 60000) / 1000);
            const milliseconds = elapsedTime % 1000;

            readSetState("setSecondsElapsed", seconds + minutes * 60);
            setTimerTime(
              `${checkLeadingZero(minutes)} : ${checkLeadingZero(
                seconds
              )} : ${checkLeadingZeroMS(milliseconds)}`
            );
            if (seconds + minutes * 60 >= timeSetting) {
              setTimer("reset");
              setTestCompleted(true);
            }
          }, 100);
          setIntervalId(id);
        }
        break;
      case "reset":
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
        setTimerTime("00 : 00 : 000");
        break;
    }
  }; // timer

  const checkLeadingZeroMS = (paramTime) => {
    // n/a
    return paramTime < 100 && paramTime > 10
      ? (paramTime = `0${paramTime}`)
      : paramTime < 10
      ? `00${paramTime}`
      : paramTime;
  };

  const checkLeadingZero = (paramTime) => {
    // n/a
    return paramTime < 10 ? (paramTime = `0${paramTime}`) : paramTime;
  };

  const getLetterColor = (typedLetter, letter) => {
    // letter color

    if (!typedLetter) {
      return "";
    }
    if (typedLetter === letter) {
      return "green";
    }
    return "red";
  };

  const countCorrectWords = () => {
    // word counter
    const typedWordsArray = typedWords.filter((word) => word !== "");
    const wordsArray = wordSequence.split(" ");
    return typedWordsArray.reduce((count, word, index) => {
      if (word === wordsArray[index]) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const renderHighlightedWords = () => {
    // correct word identifier
    console.log(typedWords);
    const wordsArray = wordSequence.split(" ");
    return wordsArray.map((word, index) => {
      const typedWord = typedWords[index] || "";
      const letters = word.split("");
      return (
        <span key={index}>
          {letters.map((letter, letterIndex) => {
            const typedLetter = typedWord.charAt(letterIndex);
            const color = getLetterColor(typedLetter, letter);
            const textShadow =
              color === "green"
                ? "1px 1px 8px #00cc00"
                : color === "red"
                ? "1px 1px 8px #cc0000"
                : "1px 1px 8px hsl(32, 100%, 50%)"; //, 3px 0px 0px rgba(128, 0, 0, 0.57),-3px 0px 0px rgba(3, 0, 128, 0.71)
            return (
              <span
                className={color === ("green" || "red") ? "typed" : "none"}
                style={{ color, textShadow }}
                key={letterIndex}
              >
                {letter}
              </span>
            );
          })}{" "}
        </span>
      );
    });
  };

  const resetTest = (reset) => {
    let wordsCreated = false
    if (typedWords.length <= 0) {
      document.getElementsByClassName("typed").animate = [
        { transform: "rotate(0) translate3D(-50%, -50%, 0)", color: "#000" },
        { color: "#431236", offset: 0.3 },
        {
          transform: "rotate(360deg) translate3D(-50%, -50%, 0)",
          color: "#000",
        },
      ];
      createWords();
      wordsCreated = true
    }
    if (reset && !wordsCreated) {
        createWords()
    }
    setTypedWords([]);
    setTypedCorrect(0);
    setTimer("reset");

    setTestCompleted(false);
    setAccuracyData({});
    inputRef.current.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // reset test on enter press
      resetTest();
    }
  };

  const setTimeControl = (e) => {
    const time = Number(e.target.innerHTML);
    const buttons = document.getElementsByClassName("timerButton");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].id = "none";
    }
    for (let i = 1; i <= time; time < i ? i-- : i++) {
      setTimeout(() => {
        setTimeSetting(i);
      }, 10);
    }
    e.target.id = "activeTimeControl";
  };

  const setLengthControl = (e) => {
    const len = Number(e.target.innerHTML);
    const buttons = document.getElementsByClassName("lengthButton");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].id = "none";
    }
    e.target.id = "activeLenControl";
    setWordLength(len);
    setTypedWords()
    resetTest(true)
  };

  function renderWordLengthButtons() {
    const components = [];
    for (let i = 1; i < 21; i++) {
      components[i] = (
        <button
          className="lengthButton"
          onClick={(e) => setLengthControl(e)}
          id="none"
        >
          {i}
        </button>
      );
    }
    return components;
  }

  const renderCompletionScreen = () => {
    return (
      <p id="completionScreen">{`${Math.ceil(
        (60 / timeSetting) * typedCorrect +
          (typedWords.length - typedCorrect) * 0.5
      )} WPM, ${Math.ceil(
        (60 / timeSetting) * typedCorrect + (typedWords.length - typedCorrect)
      )} raw; typed ${typedCorrect} words correctly, & ${
        typedWords.length - typedCorrect
      } incorrectly in ${timeSetting} seconds`}</p>
    );
  };

  return (
    <>
     <section className = "controls">
        <figure>
      <h3 id="lengthSettingHeader">
        word length setting : {wordLength} characters
      </h3>
     
      <div id="lengthControl">{renderWordLengthButtons()}</div>
      </figure>
      <div></div>
      <figure>
      <h3 id="timeSettingHeader">time setting : {timeSetting} seconds</h3>
      <div id="timerControl">
        <button
          className="timerButton"
          onClick={(e) => setTimeControl(e)}
          id="none"
        >
          15
        </button>
        <button
          className="timerButton"
          onClick={(e) => setTimeControl(e)}
          id="none"
        >
          30
        </button>
        <button
          className="timerButton"
          onClick={(e) => setTimeControl(e)}
          id="none"
        >
          45
        </button>
        <button
          className="timerButton"
          onClick={(e) => setTimeControl(e)}
          id="none"
        >
          60
        </button>
      </div>
      </figure>
      </section>
      <div>
        <h2 id="timer">{timerTime}</h2>
      </div>
      {!testCompleted ? (
        <p id="wordSeq">{renderHighlightedWords()}</p>
      ) : (
        renderCompletionScreen()
      )}
      <input
        autoFocus
        id="typeBox"
        type="text"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        spellCheck="false"
        onInput={handleInput}
      />
    </>
  );
}
