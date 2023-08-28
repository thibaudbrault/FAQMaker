import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
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
              name: true,
            },
          },
          tags: {
            select: {
              label: true,
            },
          },
        },
      });
      if (!nodes) {
        return res
          .status(404)
          .json({ success: false, message: `No nodes found` });
      }
      return res.status(200).json({ success: true, nodes });
    } catch (error) {
      res.status(400).end();
    }
  } else if (req.method === "POST") {
    const { text, tenantId, userId } = req.body;
    console.log(req.body);
    const node = await prisma.node.create({
      data: {
        tenant: { connect: { id: tenantId } },
        question: { create: { text } },
        user: { connect: { id: userId } },
      },
    });
    return res.status(201).json(node);
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
