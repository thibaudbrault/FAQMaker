import prisma, { excludeFromUser } from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //   if (req.method === 'GET') {
  //     try {
  //       if (!req.query) {
  //         return res
  //           .status(404)
  //           .json({ success: false, message: `Email not provided` });
  //       }
  //       const { id } = req.query;
  //       const user = await prisma.user.findUnique({
  //         where: { id: id as string },
  //       });
  //       const userWithoutPassword = excludeFromUser(user);
  //       return res.status(200).json(userWithoutPassword);
  //     } catch (error) {
  //       return res.status(404).json({ error: error.message });
  //     }
  //   } else if (req.method === 'POST') {
  //     try {
  //       if (!req.body) {
  //         return res
  //           .status(404)
  //           .json({ success: false, message: `Form data not provided` });
  //       }
  //       const { firstName, lastName, email, role, tenantId } = req.body;
  //       await prisma.user.create({
  //         data: {
  //           firstName,
  //           lastName,
  //           email,
  //           role,
  //           tenantId,
  //         },
  //       });
  //       return res.status(201).json({ message: 'User created successfully' });
  //     } catch (error) {
  //       return res.status(500).json({ error: error.message });
  //     }
  //   } else if (req.method === 'PUT') {
  //     try {
  //       const id = req.query.todoId as string;
  //       const data = req.body;
  //       await prisma.user.update({
  //         where: { id },
  //         data,
  //       });

  //       return res.status(201).json({ message: 'User updated successfully' });
  //     } catch (error) {
  //       return res.status(500).json({ error: error.message });
  //     }
  if (req.method === 'DELETE') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `Tag not found` });
      }
      const id = req.query.id as string;
      const tenantId = req.body as string;
      await prisma.tag.delete({
        where: { id, tenantId },
      });
      return res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
