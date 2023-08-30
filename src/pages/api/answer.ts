import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const answerReq = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { nodeId } = req.query;
      const answer = await prisma.answer.findUnique({
        where: { nodeId: nodeId as string },
        select: {
          text: true,
        },
      });
      //   if (!answer) {
      //     return res
      //       .status(404)
      //       .json({ success: false, message: `No nodes found` });
      //   }
      return res.status(200).json(answer);
    } catch (error) {
      res.status(400).end();
    }
  } else if (req.method === 'POST') {
    const { text, nodeId } = req.body;
    const answer = await prisma.answer.create({
      data: {
        text,
        node: { connect: { id: nodeId } },
      },
    });
    return res.status(201).json(answer);
  }
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

export default answerReq;
