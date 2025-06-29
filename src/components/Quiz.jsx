import React, { useEffect, useState } from 'react';
import questions from '../data/questions';

const Quiz = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    let countdown;

    if (!showResult && !isAnswered) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setIsAnswered(true); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [current, showResult, isAnswered]);

  const handleAnswer = (selected) => {
    if (isAnswered) return;

    setSelectedAnswer(selected);
    setIsAnswered(true);

    if (selected === questions[current].answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelectedAnswer('');
      setIsAnswered(false);
      setTimer(15); 
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer('');
    setIsAnswered(false);
    setTimer(15);
  };

  const currentQuestion = questions[current];

  return (
    <div className="quiz-box">
      {!showResult ? (
        <>
          <div className="timer">Time Left: {timer}s</div>
          <h2>{currentQuestion.question}</h2>
          <div className="options">
            {currentQuestion.options.map((option, index) => {
              let className = '';
              if (isAnswered) {
                if (option === currentQuestion.answer) className = 'correct';
                else if (option === selectedAnswer && option !== currentQuestion.answer) className = 'wrong';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`option-button ${className}`}
                  disabled={isAnswered}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {isAnswered && (
            <button onClick={nextQuestion} className="next-btn">
              {current + 1 < questions.length ? 'Next' : 'Finish'}
            </button>
          )}
        </>
      ) : (
        <div className="result">
          <h3>Your Score: {score} / {questions.length}</h3>
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
