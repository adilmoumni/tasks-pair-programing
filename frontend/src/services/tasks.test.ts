import { afterEach, describe, expect, it, vi } from 'vitest'
import { getTasks } from './tasks'


describe('getTasks', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns tasks received from the API', async () => {
    const tasks = [
      {
        id: 1
      },
    ]
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(tasks), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(getTasks()).resolves.toEqual(tasks)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/tasks',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })
})
