import React, { useMemo } from "react";

export const List = () => {
  const nodes = useMemo(
    () => [
      {
        id: 1,
        question: {
          text: "Ceci est une question",
        },
        answer: {
          text: "Ceci est une réponse",
        },
        tags: [
          {
            label: "Marketing",
          },
          {
            label: "Nantes",
          },
        ],
        user: {
          name: "Test",
        },
      },
      {
        id: 2,
        question: {
          text: "Nouvelle question",
        },
        answer: {
          text: "Nouvelle réponse",
        },
        tags: [
          {
            label: "Payroll",
          },
          {
            label: "Paris",
          },
        ],
        user: {
          name: "UserTest",
        },
      },
    ],
    []
  );

  return (
    <section>
      <ul>
        {nodes.map((node) => (
          <li key={node.id}>
            <h3>{node.question.text}</h3>
            <p>{node.answer.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
