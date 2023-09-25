import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { loginUser } from '@/lib';

export default async function hadndler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //   if (req.method === 'GET') {
  //     try {
  //       if (!req.query) {
  //         return res
  //           .status(404)
  //           .json({ success: false, message: `Tenant not found` });
  //       }
  //       const { tenantId } = req.query;
  //       const tags = await prisma.tag.findMany({
  //         where: { tenantId: tenantId as string },
  //       });
  //       return res.status(200).json(tags);
  //     } catch (error) {
  //       res.status(400).end();
  //     }
  if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Information not provided` });
      }
      const { company, companyEmail, firstName, lastName, email, password } =
        req.body;
      const tenant = await prisma.tenant.create({
        data: {
          company,
          email: companyEmail,
        },
      });
      if (!tenant) {
        return res
          .status(500)
          .json({ message: 'There was a problem when creating the account' });
      }
      const hashPassword = async (password: string) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
      };
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: await hashPassword(password),
          role: 'tenant',
          tenant: { connect: { id: tenant.id } },
        },
      });
      if (!user) {
        return res
          .status(500)
          .json({ message: 'There was a problem when creating the user' });
      }
      await loginUser(user);
      return res.status(201).json({ message: 'Account created successfully' });
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
    //   } else if (req.method === 'DELETE') {
    //     try {
    //       if (!req.query) {
    //         return res
    //           .status(404)
    //           .json({ success: false, message: `Tag not found` });
    //       }
    //       const { id } = req.query;
    //       await prisma.tag.delete({ where: { id: id as string } });
    //       return res.status(200).end();
    //     } catch (error) {
    //       res.status(500).end();
    //     }
    //   }
  }
}
