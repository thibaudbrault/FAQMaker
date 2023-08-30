import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const userReq = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `Email not provided` });
      }
      const { email } = req.query;
      const user = await prisma.user.findUnique({
        where: { email: email as string },
      });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({ error: error.message });
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
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
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
