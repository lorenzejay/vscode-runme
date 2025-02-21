import vscode from 'vscode'

import { getExecutionProperty, getTerminalByCell } from '../utils'

export class PidStatusProvider implements vscode.NotebookCellStatusBarItemProvider {
  async provideCellStatusBarItems(cell: vscode.NotebookCell): Promise<vscode.NotebookCellStatusBarItem | undefined> {
    /**
     * don't show pid if we run it in non-interactive mode where we have no
     * access to the process id
     */
    if (!getExecutionProperty('interactive', cell)) {
      return
    }

    const terminal = getTerminalByCell(cell)
    if (!terminal) {
      return
    }

    const pid = await terminal.processId
    if (!pid) {
      return
    }

    const item = new vscode.NotebookCellStatusBarItem(
      `PID: ${pid}`,
      vscode.NotebookCellStatusBarAlignment.Right
    )
    return item
  }
}
