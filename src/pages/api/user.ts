import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: "1" },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(400).end();
    }
  }
  //   } else if (req.method === "POST") {
  //     // create todo
  //     const text = JSON.parse(req.body).text;
  //     const todo = await prisma.todo.create({
  //       data: { text, completed: false },
  //     });

  //     res.json(todo);
  //   } else if (req.method === "PUT") {
  //     // update todo
  //     const id = req.query.todoId as string;
  //     const data = JSON.parse(req.body);
  //     const todo = await prisma.todo.update({
  //       where: { id },
  //       data,
  //     });

  //     res.json(todo);
  //   } else if (req.method === "DELETE") {
  //     // delete todo
  //     const id = req.query.todoId as string;
  //     await prisma.todo.delete({ where: { id } });

  //     res.json({ status: "ok" });
  //   }
};
