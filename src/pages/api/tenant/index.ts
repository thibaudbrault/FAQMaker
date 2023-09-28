import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function hadndler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Information not provided` });
      }
      const { company, companyEmail, name, email } = req.body;
      const tenantExists = await prisma.tenant.findUnique({
        where: { email: companyEmail },
      });
      if (tenantExists) {
        return res
          .status(409)
          .json({
            success: false,
            message: 'An account with the same company email already exists',
          });
      }
      const tenant = await prisma.tenant.create({
        data: {
          company,
          email: companyEmail,
        },
      });
      if (!tenant) {
        return res.status(500).json({
          success: false,
          message: 'There was a problem when creating the account',
        });
      }
      const user = await prisma.user.create({
        data: {
          name,
          email,
          role: 'tenant',
          tenant: { connect: { id: tenant.id } },
        },
      });
      if (!user) {
        return res
          .status(500)
          .json({ message: 'There was a problem when creating the user' });
      }
      return res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
      res.status(500).end();
    }
  }
}
