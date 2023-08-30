import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const usersReq = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { tenantId } = req.query;
      const users = await prisma.user.findMany({
        where: { tenantId: tenantId as string },
      });
      if (!users) {
        return res
          .status(404)
          .json({ success: false, message: `No users found` });
      }
      return res.status(200).json(users);
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

export default usersReq;
