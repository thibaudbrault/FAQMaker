import { getIdSchemaFn } from '@/lib';
import { generatePassword } from '@/utils';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

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
      const getTenantIdSchema = getIdSchemaFn('tenantId');
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
  } else if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Form data not provided` });
      }
      const { firstName, lastName, email, role, tenantId } = req.body;
      const password = generatePassword();
      console.log('🚀 ~ file: index.ts:45 ~ password:', password);
      const hashPassword = async (password: string) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
      };
      await prisma.user.create({
        data: {
          firstName,
          lastName,
          password: await hashPassword(password),
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
}
