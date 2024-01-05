import { expect, test } from '@playwright/test';


// const deleteTenant = async (id: string) => {
//   await prisma.tenant.delete({
//     where: { id },
//   });
// };

// const deleteUser = async (id: string, tenantId: string) => {
//   await prisma.user.delete({
//     where: { id, tenantId },
//   });
// };



test('Can ask a question', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole("heading", {name: "Login"})).toBeVisible();
  await page.pause()
});

// test.afterAll(async () => {
//   await deleteUser(user.id, tenant.id);
//   await deleteTenant(tenant.id);
// });
