import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const userReq = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { tenantId } = req.query;
      const tags = await prisma.tag.findMany({
        where: { tenantId: tenantId as string },
      });
      return res.status(200).json(tags);
    } catch (error) {
      res.status(400).end();
    }
  } else if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Form data not provided` });
      }
      const { firstName, lastName, email, role, tenantId } = req.body;
      await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          role,
          tenantId,
        },
      });
      return res.status(201).end();
    } catch (error) {
      res.status(500).end();
    }
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

export default userReq;
