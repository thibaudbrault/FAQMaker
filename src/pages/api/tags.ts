import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const tagsReq = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `Tenant not found` });
      }
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
          .json({ success: false, message: `Label not provided` });
      }
      const { label, tenantId } = req.body;
      await prisma.tag.create({
        data: {
          label,
          tenantId,
        },
      });
      return res.status(201).end();
    } catch (error) {
      res.status(500).end();
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
  } else if (req.method === 'DELETE') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `Tag not found` });
      }
      const { id } = req.query;
      await prisma.tag.delete({ where: { id: id as string } });
      return res.status(200).end();
    } catch (error) {
      res.status(500).end();
    }
  }
};

export default tagsReq;
