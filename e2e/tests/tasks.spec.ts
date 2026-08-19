import { expect, test } from '@playwright/test'


test('a user can create a task and change its status', async ({ page }) => {
  const uniqueName = `E2E task ${Date.now()}`

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()

  await page.getByLabel('Prefix').fill('E2E')
  await page.getByLabel('Task name').fill(uniqueName)
  await page.getByLabel('Description optional').fill('Created by Playwright')
  await page.getByRole('button', { name: 'Create task' }).click()

  const taskRow = page.getByRole('article').filter({ hasText: uniqueName })
  await expect(taskRow).toBeVisible()
  await expect(taskRow.getByText('To do')).toBeVisible()

  await taskRow.getByRole('button', { name: 'Start' }).click()
  await expect(taskRow.getByText('In progress')).toBeVisible()
  await expect(taskRow.getByRole('button', { name: 'Complete' })).toBeVisible()

  page.once('dialog', (dialog) => dialog.accept())
  await taskRow.getByRole('button', { name: `Delete ${uniqueName}` }).click()
  await expect(taskRow).toHaveCount(0)
})
