# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> homepage loads
- Location: tests/home.spec.ts:3:5

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /React/i
Received string:  "frontend"

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    11 × locator resolved to <html lang="en">…</html>
       - unexpected value "frontend"
  - Test ended.

```

```yaml
- main:
  - paragraph: Workspace
  - heading "Tasks" [level=1]
  - paragraph: A clear view of everything your team is working on.
  - region "Create a task":
    - paragraph: New item
    - heading "Create a task" [level=2]
    - text: Add to workspace Prefix
    - textbox "Prefix": TASK
    - text: Task name
    - textbox "Task name":
      - /placeholder: What needs to be done?
    - text: Status
    - combobox "Status":
      - option "To do" [selected]
      - option "In progress"
      - option "Done"
    - text: Description
    - emphasis: optional
    - textbox "Description optional":
      - /placeholder: Add a little more context
    - button "Create task"
  - region "All tasks":
    - heading "All tasks" [level=2]
    - paragraph: Sorted by creation order
    - text: 0 tasks
    - heading "No tasks yet" [level=3]
    - paragraph: Your task list is empty. New tasks will appear here.
```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 | 
  3 | test('homepage loads', async ({ page }) => {
  4 |   await page.goto('/');
> 5 |   await expect(page).toHaveTitle(/React/i);
    |                      ^ Error: expect(page).toHaveTitle(expected) failed
  6 | });
```