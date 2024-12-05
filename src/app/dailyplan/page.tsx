"use client";
import Box from "~/_components/Box";
import Container from "~/_components/Container";
import { Text } from "~/_components/Text";
import * as RadioGroup from "@radix-ui/react-radio-group";
import Image from "next/image";
import { useState } from "react";

const DailyPlan = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>("mathematics");

  const plans = [
    {
      value: "mathematics",
      label: "Mathematics",
      score: 9,
      grade: "A+",
      Questions: [
        {
          question: "What is 2 + 2?",
          id: 1,
          choices: [
            { id: 1, number: "A)", text: "3", isRightAnswer: false },
            { id: 2, number: "B)", text: "4", isRightAnswer: true },
            { id: 3, number: "C)", text: "5", isRightAnswer: false },
            { id: 4, number: "D)", text: "6", isRightAnswer: false },
          ],
        },
        {
          question: "What is 9 x 3?",
          id: 2,
          choices: [
            { id: 1, number: "A)", text: "27", isRightAnswer: true },
            { id: 2, number: "B)", text: "18", isRightAnswer: false },
            { id: 3, number: "C)", text: "36", isRightAnswer: false },
            { id: 4, number: "D)", text: "21", isRightAnswer: false },
          ],
        },
        {
          question: "What is the square root of 81?",
          id: 3,
          choices: [
            { id: 1, number: "A)", text: "8", isRightAnswer: false },
            { id: 2, number: "B)", text: "9", isRightAnswer: true },
            { id: 3, number: "C)", text: "7", isRightAnswer: false },
            { id: 4, number: "D)", text: "10", isRightAnswer: false },
          ],
        },
      ],
    },
    {
      value: "english",
      label: "English",
      score: 9,
      grade: "A+",
      Questions: [
        {
          question: "What is the synonym of 'Happy'?",
          id: 1,
          choices: [
            { id: 1, number: "A)", text: "Sad", isRightAnswer: false },
            { id: 2, number: "A)", text: "Elated", isRightAnswer: true },
            { id: 3, number: "A)", text: "Angry", isRightAnswer: false },
            { id: 4, number: "A)", text: "Bored", isRightAnswer: false },
          ],
        },
        {
          question: "What is the past tense of 'Run'?",
          id: 2,
          choices: [
            { id: 1, number: "A)", text: "Running", isRightAnswer: false },
            { id: 2, number: "A)", text: "Ran", isRightAnswer: true },
            { id: 3, number: "A)", text: "Runs", isRightAnswer: false },
            { id: 4, number: "A)", text: "Runed", isRightAnswer: false },
          ],
        },
      ],
    },
    {
      value: "history",
      label: "History",
      score: 7.8,
      grade: "A+",
      Questions: [
        {
          question: "Who discovered America?",
          id: 1,
          choices: [
            {
              id: 1,
              number: "A)",
              text: "Christopher Columbus",
              isRightAnswer: true,
            },
            {
              id: 2,
              number: "A)",
              text: "Albert Einstein",
              isRightAnswer: false,
            },
            { id: 3, number: "A)", text: "Isaac Newton", isRightAnswer: false },
            { id: 4, number: "A)", text: "Napoleon", isRightAnswer: false },
          ],
        },
        {
          question: "In which year did World War II end?",
          id: 2,
          choices: [
            { id: 1, number: "A)", text: "1940", isRightAnswer: false },
            { id: 2, number: "A)", text: "1945", isRightAnswer: true },
            { id: 3, number: "A)", text: "1950", isRightAnswer: false },
            { id: 4, number: "A)", text: "1939", isRightAnswer: false },
          ],
        },
      ],
    },
    {
      value: "french",
      label: "French",
      score: 9.1,
      grade: "A+",
      Questions: [
        {
          question: "What is the French word for 'Apple'?",
          id: 1,
          choices: [
            { id: 1, number: "A)", text: "Pomme", isRightAnswer: true },
            { id: 2, number: "A)", text: "Banane", isRightAnswer: false },
            { id: 3, number: "A)", text: "Orange", isRightAnswer: false },
            { id: 4, number: "A)", text: "Fraise", isRightAnswer: false },
          ],
        },
        {
          question: "How do you say 'Good Morning' in French?",
          id: 2,
          choices: [
            { id: 1, number: "A)", text: "Bonsoir", isRightAnswer: false },
            { id: 2, number: "A)", text: "Bonjour", isRightAnswer: true },
            { id: 3, number: "A)", text: "Salut", isRightAnswer: false },
            { id: 4, number: "A)", text: "Merci", isRightAnswer: false },
          ],
        },
      ],
    },
  ];

  const handleGradeChange = (gradeValue: string) => {
    setSelectedGrade(gradeValue);
  };

  // Get the selected subject data
  const selectedSubject = plans.find((plan) => plan.value === selectedGrade);

  return (
    <Container>
      <Box>
        <Text font={"bold"} size={"2xl"}>
          Daily Plan
        </Text>
        <div className="flex w-full justify-start gap-8 rounded-xl bg-bgPrimary p-8">
          <div className="w-1/5">
            <RadioGroup.Root
              className="gap-4"
              value={selectedGrade}
              onValueChange={handleGradeChange}
              aria-label="Grade Selection"
            >
              {plans.map(({ value, label, score, grade }) => (
                <RadioGroup.Item
                  key={value}
                  value={value}
                  className="group mt-1 flex h-20 w-full flex-col justify-center rounded-l-2xl bg-lightGray px-4 text-center text-textPrimary transition hover:border-primary hover:text-primary focus-visible:ring focus-visible:ring-blue-200 focus-visible:ring-opacity-75 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                  aria-labelledby={`${value}-label`}
                >
                  <div className="flex justify-between w-full">
                  <span
                    id={`${value}-label`}
                    className="text-xl font-semibold group-data-[state=checked]:text-white"
                  >
                    {label}
                  </span>
                  <div className="">
                    <p className="font-bold text-textPrimary group-data-[state=checked]:text-white">{grade}</p>
                    <p className="font-bold text-success group-data-[state=checked]:text-white">{score} of 10</p>
                  </div>
                  </div>
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
          </div>

          <div className="w-4/5">
            {/* Display the selected subject's assignments */}
            {selectedSubject && (
              <>
                {selectedSubject.Questions.map((question, index) => (
                  <div key={index} className="mb-6 ml-10">
                    <Text font={"semiBold"} size={"2xl"} className="mb-4">
                      Question {index + 1}
                    </Text>
                    <Text font={"semiBold"} size={"lg"} className="mb-2">
                      {question.question}
                    </Text>
                    <ul className="list-disc pl-4">
                      {question.choices.map((choice) => (
                        <li
                          key={choice.id}
                          className={`-ml-3 list-none ${
                            choice.isRightAnswer
                              ? "text-success"
                              : "text-textPrimary"
                          }`}
                        >
                          {choice.number} {choice.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </Box>
    </Container>
  );
};

export default DailyPlan;
