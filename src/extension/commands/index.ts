import path from 'node:path'

import { NotebookCell, Uri, window, env } from 'vscode'

import { CliProvider } from '../provider/cli'
import { getTerminalByCell } from '../utils'

export function openTerminal (cell: NotebookCell) {
  const terminal = getTerminalByCell(cell)
  if (!terminal) {
    return window.showWarningMessage('Couldn\'t find terminal! Was it already closed?')
  }
  return terminal.show()
}

export function copyCellToClipboard (cell: NotebookCell) {
  env.clipboard.writeText(cell.document.getText())
  return window.showInformationMessage('Copied cell to clipboard!')
}

export function stopBackgroundTask (cell: NotebookCell) {
  const terminal = getTerminalByCell(cell)
  terminal?.dispose()
  return window.showInformationMessage(`${terminal?.name} command terminated!`)
}

export async function runCLICommand (cell: NotebookCell) {
  if (!await CliProvider.isCliInstalled()) {
    return window.showInformationMessage(
      'Runme CLI is not installed. Do you want to download it?',
      'Download now'
    ).then((openBrowser) => openBrowser && env.openExternal(
      Uri.parse('https://github.com/stateful/runme/releases')
    ))
  }
  const cliName: string = (cell.metadata?.['cliName'] || '').trim()
  const term = window.createTerminal(`CLI: ${cliName}`)
  term.show(false)
  term.sendText(`runme run ${cliName} --chdir="${path.dirname(cell.document.uri.fsPath)}"`)
}
