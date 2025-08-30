export async function isMaximized(): Promise<boolean | undefined> {
  return window.puzzlemaster.window.isMaximized();
}
