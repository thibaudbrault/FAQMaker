import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const nodesReq = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `Tenant not found` });
      }
      const { tenant } = req.query;
      const nodes = await prisma.node.findMany({
        where: { tenantId: tenant as string },
        include: {
          question: {
            select: {
              text: true,
            },
          },
          answer: {
            select: {
              text: true,
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          tags: {
            select: {
              label: true,
            },
          },
        },
      });
      return res.status(200).json(nodes);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Data not provided` });
      }
      const { text, tenantId, userId } = req.body;
      await prisma.node.create({
        data: {
          tenant: { connect: { id: tenantId } },
          question: { create: { text } },
          user: { connect: { id: userId } },
        },
      });
      return res.status(201).json({ message: 'Question created successfully' });
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

export default nodesReq;
