import vscode from 'vscode'

export class CopyProvider implements vscode.NotebookCellStatusBarItemProvider {
  async provideCellStatusBarItems(): Promise<vscode.NotebookCellStatusBarItem | undefined> {
    const item = new vscode.NotebookCellStatusBarItem(
      '$(clippy) Copy',
      vscode.NotebookCellStatusBarAlignment.Right
    )
    item.command = 'runme.copyCellToClipboard'
    return item
  }
}
