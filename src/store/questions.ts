import { create } from "zustand";
import { type Question } from "../types";
import confetti from "canvas-confetti";
import { persist, devtools } from "zustand/middleware";

interface State {
  questions: Question[];
  currentQuestion: number;
  fetchQuestion: (limit: number) => Promise<void>;
  selectAnswer: (questionId: number, answerIndex: number) => void;
  goNextQuestion: () => void;
  goPreviousQuestion: () => void;
  reset: () => void;
}

let API_URL;
if (window.location.hostname === "cesar-js-quizz.surge.sh") {
  API_URL = "http://cesar-js-quizz.surge.sh/";
} else {
  API_URL = "http://localhost:5173/";
}

export const useQuestionsStore = create<State>()(
  devtools(
    persist(
      (set, get) => {
        return {
          questions: [],
          currentQuestion: 0,
          fetchQuestion: async (limit: number) => {
            const res = await fetch(`${API_URL}data.json`);
            const json = await res.json();
            const questions = json
              .sort(() => Math.random() - 0.5)
              .slice(0, limit);
            set({ questions }, false, "FETCH_QUESTIONS");
          },
          selectAnswer: (questionId: number, answerIndex: number) => {
            const { questions } = get();
            //stuctureCLone
            const newQuestions = structuredClone(questions);
            //encontramos el indice de la pregunta
            const questionIndex = newQuestions.findIndex(
              (q) => q.id === questionId
            );
            //obtenemos info de la pregunta
            const questionInfo = newQuestions[questionIndex];
            //verificamos que sea respuesta correcta
            const isCorrectUserAnswer =
              questionInfo.correctAnswer === answerIndex;
            if (isCorrectUserAnswer) {
              confetti();
            }
            //cambiar esta informacion en la copia de la pregunta
            newQuestions[questionIndex] = {
              ...questionInfo,
              isCorrectUserAnswer,
              userSelectedAnswer: answerIndex,
            };

            //actualizar el estado:
            set({ questions: newQuestions }, false, "SELECT_ANSWER");
          },
          goNextQuestion: () => {
            const { currentQuestion, questions } = get();
            const nexQuestion = currentQuestion + 1;
            if (nexQuestion < questions.length) {
              set({ currentQuestion: nexQuestion }, false, "GO_NEXT_QUESTION");
            }
          },
          goPreviousQuestion: () => {
            const { currentQuestion } = get();
            const previousQuestion = currentQuestion - 1;
            if (previousQuestion >= 0) {
              set(
                { currentQuestion: previousQuestion },
                false,
                "GO_PREVIOUS_QUESTION"
              );
            }
          },
          reset: () => {
            set({ currentQuestion: 0, questions: [] }, false, "RESET_GAME");
          },
        };
      },
      {
        name: "questions",
      }
    )
  )
);
