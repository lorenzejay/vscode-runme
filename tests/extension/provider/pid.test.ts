import { vi, test, expect, beforeEach } from 'vitest'

import { getExecutionProperty, getTerminalByCell } from '../../../src/extension/utils'
import { PidStatusProvider } from '../../../src/extension/provider/pid'

vi.mock('vscode', () => ({
  default: {
    NotebookCellStatusBarItem: class {
      constructor (public label: string, public position: number) {}
    },
    NotebookCellStatusBarAlignment: {
      Right: 'right'
    }
  }
}))

vi.mock('../../../src/extension/utils', () => ({
  getExecutionProperty: vi.fn(),
  getTerminalByCell: vi.fn()
}))

beforeEach(() => {
  vi.mocked(getExecutionProperty).mockClear()
  vi.mocked(getTerminalByCell).mockClear()
})

test('dont show pid if cell is non interactive', async () => {
  vi.mocked(getExecutionProperty).mockReturnValueOnce(false)
  const p = new PidStatusProvider()
  expect(await p.provideCellStatusBarItems('cell' as any)).toBe(undefined)
  expect(getExecutionProperty).toBeCalledTimes(1)
  expect(getTerminalByCell).toBeCalledTimes(0)
  expect(getExecutionProperty).toBeCalledWith('interactive', 'cell')
})

test('dont show pid if terminal could not be found', async () => {
  vi.mocked(getExecutionProperty).mockReturnValueOnce(true)
  vi.mocked(getTerminalByCell).mockReturnValueOnce(undefined)
  const p = new PidStatusProvider()
  expect(await p.provideCellStatusBarItems('cell' as any)).toBe(undefined)
  expect(getTerminalByCell).toBeCalledTimes(1)
  expect(getTerminalByCell).toBeCalledWith('cell')
})

test('don\'t show if terminal has no pid', async () => {
  vi.mocked(getExecutionProperty).mockReturnValueOnce(true)
  vi.mocked(getTerminalByCell).mockReturnValueOnce({} as any)
  const p = new PidStatusProvider()
  expect(await p.provideCellStatusBarItems('cell' as any)).toBe(undefined)
})

test('return status item with pid ', async () => {
  vi.mocked(getExecutionProperty).mockReturnValueOnce(true)
  vi.mocked(getTerminalByCell).mockReturnValueOnce({ processId: Promise.resolve(123) } as any)
  const p = new PidStatusProvider()
  const item = await p.provideCellStatusBarItems('cell' as any)
  expect(item).toEqual({ label: 'PID: 123', position: 'right' })
})
