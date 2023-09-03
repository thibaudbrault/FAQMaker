import { getTenantIdSchema } from '@/lib';
import prisma from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `Tenant not found` });
      }
      const result = getTenantIdSchema.safeParse(req.query);
      if (result.success === false) {
        const { errors } = result.error;
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid request', errors },
        });
      } else {
        const { tenantId } = result.data;
        const users = await prisma.user.findMany({
          where: { tenantId: tenantId as string },
        });
        return res.status(200).json(users);
      }
    } catch (error) {
      return res.status(404).json({ error: error.message });
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
}
