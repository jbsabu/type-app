// import words from 'an-array-of-english-words'
// import { useMemo, useState } from 'react'
// const seqLength = 100


import words from 'an-array-of-english-words';
import { useState, useEffect, useRef } from 'react';

const seqLength = 100;

export default function Main() {
    let time = new Date()
    const [wordSequence, setWordSeq] = useState('');
    const [typedWords, setTypedWords] = useState([]);
    const [cTime,setCTime] = useState([time.getMilliseconds(),time.getSeconds(),time.getMinutes()])
    const [elapsedTime,setElapsedTime] = useState([0,0,0])
    const [timerTime, setTimerTime] = useState("0 : 0 : 0")
    const inputRef = useRef(null);

    let [ms,sec,min] = cTime

    
    const createWords = () => {
        let seq = '';

        for (let i = 0; i < seqLength; i++) {
        seq = `${seq} ${words[Math.floor(Math.random() * words.length)]}`;
        }
        setWordSeq(seq.trim());
    };

    useEffect(() => {
        createWords()
        const handleKeyPress = (e) => {
        inputRef.current.focus();
    };

    window.addEventListener('keypress', handleKeyPress); // auto focus input box when typing begins
        createWords();
    }, []);

    const setTimer = (state) => {
        switch (state) {
            
            case 'start':
            setCTime([time.getMilliseconds(),time.getSeconds(),time.getMinutes()])
            let [_,sec,min] = cTime
            setInterval(()=>{
                let time = new Date()
                let [msEl,secEl,minEl] = [time.getMilliseconds(),time.getSeconds(),time.getMinutes()] // el = elapsed
                setTimerTime( `${checkLeadingZero((minEl - min))} : ${checkLeadingZero(secEl - sec)} : ${checkLeadingZeroMS(msEl)}`)
                console.log(timerTime)
               // document.getElementById("timer").textContent = timerTime
            },null,1)
            break
        }
    }


    const checkLeadingZeroMS = (paramTime) => {
        return (paramTime < 100 && paramTime > 10) ? (paramTime = `0${paramTime}`) : ((paramTime < 10) ? `00${paramTime}` : paramTime );

      };
      
      
      const checkLeadingZero = (paramTime) => {
          return paramTime < 10 ? (paramTime = `0${paramTime}`)  : paramTime;
       
      };

    const handleInput = (e) => {
        if (!typedWords.length){
            setTimer("start")
        }
        const typedText = e.target.value.trim();
        setTypedWords(typedText.split(' '));
        
    };

    const getLetterColor = (typedLetter, letter) => {
        if (!typedLetter) {
        return '';
        }
        if (typedLetter === letter) {
        return 'green';
        }
        return 'red';
    };

    const countCorrectWords = () => {
        const typedWordsArray = typedWords.filter(word => word !== '');
        const wordsArray = wordSequence.split(' ');
        return typedWordsArray.reduce((count, word, index) => {
        if (word === wordsArray[index]) {
            return count + 1;
        }
        return count;
        }, 0);
    };

    const renderHighlightedWords = () => {
        console.log(countCorrectWords())
        const wordsArray = wordSequence.split(' ');
        return wordsArray.map((word, index) => {
        const typedWord = typedWords[index] || '';
        const letters = word.split('');
        
        return (
            <span key={index}>
            {letters.map((letter, letterIndex) => {
                const typedLetter = typedWord.charAt(letterIndex);
                const color = getLetterColor(typedLetter, letter);
                const textShadow = color === 'green' ? '1px 1px 8px #00cc00' : color === 'red' ? '1px 1px 8px #cc0000' : '1px 1px 8px hsl(32, 100%, 50%)'//, 3px 0px 0px rgba(128, 0, 0, 0.57),-3px 0px 0px rgba(3, 0, 128, 0.71)
               
                return <span className = {(color === ('green' || 'red'))? "typed" : "none"} style={{ color, textShadow }} key={letterIndex}>{letter}</span>
            })}
            {' '}
            </span>
        );
        });
    };

    const resetTest = () => {
        if (typedWords.length <= 0) {
        //  window.removeEventListener('keypress')
            // document.getElementsByClassName("typed").animate = (
            //     [   { transform: 'rotate(0) translate3D(-50%, -50%, 0)', color: '#000',"animation-fill-mode": "forwards" },
            //     { color: '#431236', offset: 0.3 },
            //     { transform: 'rotate(360deg) translate3D(-50%, -50%, 0)', color: '#000',"animation-fill-mode": "forwards" }]
            // )
            createWords()
        }
        setTypedWords([]);
        inputRef.current.value = '';

    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { // reset test on enter press
            resetTest()
        }
    };

    return (
        <>
        <h2 id = 'timer'>{timerTime}</h2>
        <p id ="wordSeq">{renderHighlightedWords()}</p>
        <input autoFocus id="typeBox" type="text" ref={inputRef} onKeyDown={handleKeyDown} spellCheck="false" onInput={handleInput} />
        </>
    );
}

//   {(!words) ? <button>test</button> : createWords() }






