import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUserInterests, getMe } from "../services/api"; // path to your api.js

const questions = [
  {
    id: 'education',
    question: "What is your current education level?",
    options: [
      "Under High School",
      "High School",
      "Undergraduate",
      "Graduate",
    ],
  },
  {
    id: 'interest',
    question: "What is your primary area of interest?",
    options: [
      "Technology & Software",
      "Business & Entrepreneurship",
      "Design & Creative Arts",
      "Sports & Fitness",
      "Science & Healthcare",
      "Media & Communications",
      "Education & Social Impact",
      "Engineering & Hardware",
    ],
  },
];




const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    education: '',
    interest: '',
  });

  const navigate = useNavigate();
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  //  Progress based on answered questions
  const answeredCount = Object.values(answers).filter(ans => ans !== '').length;
  const progress = (answeredCount / questions.length) * 100;

  const handleOptionSelect = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const educationMap = {
  "Under High School": "under_high_school",
  "High School": "high_school",
  "Undergraduate": "undergraduate",
  "Graduate": "graduate"
};


  const handleNext = async () => {
    if (isLastQuestion) {
      try {
        const backendEducation = educationMap[answers.education];

        await addUserInterests(
          [answers.interest],  // interests array
          backendEducation
        );

        alert("Quiz submitted successfully!");
        navigate("/dashboard"); // redirect after submit
      } catch (error) {
        console.error("Failed to submit quiz:", error);
        alert("Failed to submit quiz. Try again.");
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col justify-center items-center bg-gray-50 font-sans p-4 m-0">

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-6 shrink-0">
        <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-700">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-black h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm w-full max-w-2xl flex flex-col">

        {/* Question */}
        <div className="flex items-start mb-6">
          <div className="p-2 bg-black rounded-lg mr-4 flex items-center justify-center">
            <span className="text-white font-bold">
              {currentQuestionIndex + 1}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 flex-1">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`w-full flex items-center p-4 text-left border rounded-xl transition-all duration-200 group ${
                answers[currentQuestion.id] === option
                  ? 'border-black bg-gray-50 ring-1 ring-black'
                  : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border mr-4 flex items-center justify-center flex-shrink-0 ${
                  answers[currentQuestion.id] === option
                    ? 'border-black'
                    : 'border-gray-300 group-hover:border-gray-400'
                }`}
              >
                {answers[currentQuestion.id] === option && (
                  <div className="w-3 h-3 rounded-full bg-black"></div>
                )}
              </div>

              <span
                className={`text-lg font-medium ${
                  answers[currentQuestion.id] === option
                    ? 'text-black'
                    : 'text-gray-700'
                }`}
              >
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-2xl flex justify-between mt-6 shrink-0">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
            currentQuestionIndex === 0
              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
              : 'text-gray-700 hover:bg-gray-200 bg-white border border-gray-200 shadow-sm'
          }`}
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className={`flex items-center px-8 py-3 rounded-xl font-medium text-white transition-colors shadow-sm ${
            !answers[currentQuestion.id]
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-900'
          }`}
        >
          {isLastQuestion ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;