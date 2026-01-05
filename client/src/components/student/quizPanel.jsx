// import React, { useState } from "react";

// const QuizPanel = ({ topic }) => {
//   const [numQuestions, setNumQuestions] = useState(5);
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [score, setScore] = useState(null);

//   const generateQuiz = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/quiz/generate-quiz", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ topic, count: numQuestions }),
//       });

//       const data = await res.json();

//       if (!Array.isArray(data)) {
//         throw new Error("Invalid data format from server");
//       }

//       setQuestions(data);
//       setQuizStarted(true);
//       setScore(null);
//       setAnswers({});
//     } catch (err) {
//       console.error("Error generating quiz:", err);
//     }
//   };

//   const handleOptionChange = (qId, option) => {
//     setAnswers({ ...answers, [qId]: option });
//   };

//   const submitQuiz = () => {
//     let score = 0;
//     questions.forEach((q) => {
//       if (answers[q.id] === q.answer) score += 1;
//     });
//     setScore(score);
//   };

//   const resetQuiz = () => {
//     setQuizStarted(false);
//     setNumQuestions(5);
//     setQuestions([]);
//     setAnswers({});
//     setScore(null);
//   };

//   return (
//     <div className="mt-10 bg-gray-100 p-6 rounded-xl shadow-md">
//       {!quizStarted ? (
//         <>
//           <h2 className="text-xl font-semibold mb-4">Quiz on "{topic}"</h2>

//           <label className="block mb-4">
//             <span className="block font-medium text-sm mb-1">Number of Questions</span>
//             <input
//               type="number"
//               min="1"
//               max="20"
//               className="border p-2 rounded w-full"
//               value={numQuestions}
//               onChange={(e) => setNumQuestions(e.target.value)}
//             />
//           </label>

//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             onClick={generateQuiz}
//           >
//             Start Quiz
//           </button>
//         </>
//       ) : (
//         <>
//           <h3 className="text-lg font-bold mb-4">Quiz: {topic}</h3>
//           {questions.map((q) => (
//             <div key={q.id} className="mb-4">
//               <p className="font-medium mb-2">{q.id}. {q.question}</p>
//               {q.options.map((opt) => (
//                 <label key={opt} className="block mb-1">
//                   <input
//                     type="radio"
//                     name={`question-${q.id}`}
//                     value={opt}
//                     checked={answers[q.id] === opt}
//                     onChange={() => handleOptionChange(q.id, opt)}
//                     className="mr-2"
//                   />
//                   {opt}
//                 </label>
//               ))}
//             </div>
//           ))}

//           {score === null ? (
//             <button
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//               onClick={submitQuiz}
//             >
//               Submit Quiz
//             </button>
//           ) : (
//             <div className="mt-4">
//               <p className="text-lg font-semibold">
//                 ✅ Your Score: {score} / {questions.length}
//               </p>
//               <button
//                 className="mt-3 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
//                 onClick={resetQuiz}
//               >
//                 Restart
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default QuizPanel;



import React, { useState } from "react";

const QuizPanel = ({ topic }) => {
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false); // track if submitted

  const generateQuiz = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/quiz/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count: numQuestions }),
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format from server");
      }

      setQuestions(data);
      setQuizStarted(true);
      setScore(null);
      setAnswers({});
      setSubmitted(false); // reset submitted state
    } catch (err) {
      console.error("Error generating quiz:", err);
    }
  };

  const handleOptionChange = (qId, option) => {
    if (submitted) return; // prevent changes after submission
    setAnswers({ ...answers, [qId]: option });
  };

  const submitQuiz = () => {
    let scoreCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) scoreCount += 1;
    });
    setScore(scoreCount);
    setSubmitted(true); // mark as submitted
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setNumQuestions(5);
    setQuestions([]);
    setAnswers({});
    setScore(null);
    setSubmitted(false);
  };

  return (
    <div className="mt-10 bg-gray-100 p-6 rounded-xl shadow-md">
      {!quizStarted ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Quiz on "{topic}"</h2>

          <label className="block mb-4">
            <span className="block font-medium text-sm mb-1">Number of Questions</span>
            <input
              type="number"
              min="1"
              max="20"
              className="border p-2 rounded w-full"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
            />
          </label>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={generateQuiz}
          >
            Start Quiz
          </button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-bold mb-4">Quiz: {topic}</h3>
          {questions.map((q) => {
            const isCorrect = answers[q.id] === q.answer;
            const isAnswered = q.id in answers;

            // Determine question border color after submission
            const questionBorder = submitted
              ? isCorrect
                ? "border-green-500 bg-green-100"
                : "border-red-500 bg-red-100"
              : "border-gray-300";

            return (
              <div
                key={q.id}
                className={`mb-4 p-4 rounded border ${questionBorder}`}
              >
                <p className="font-medium mb-2">
                  {q.id}. {q.question}
                </p>
                {q.options.map((opt) => {
                  // Determine option styles after submission
                  let optionClass = "cursor-pointer";

                  if (submitted) {
                    if (opt === q.answer) {
                      optionClass += " font-bold text-green-700"; // correct answer green
                    }
                    if (answers[q.id] === opt && opt !== q.answer) {
                      optionClass += " text-red-700"; // selected wrong answer red
                    }
                  }

                  return (
                    <label key={opt} className={`block mb-1 ${optionClass}`}>
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleOptionChange(q.id, opt)}
                        disabled={submitted} // disable after submit
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            );
          })}

          {score === null ? (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={submitQuiz}
              disabled={Object.keys(answers).length < questions.length} // disable if not all answered
            >
              Submit Quiz
            </button>
          ) : (
            <div className="mt-4">
              <p className="text-lg font-semibold">
                ✅ Your Score: {score} / {questions.length}
              </p>
              <button
                className="mt-3 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={resetQuiz}
              >
                Restart
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizPanel;
