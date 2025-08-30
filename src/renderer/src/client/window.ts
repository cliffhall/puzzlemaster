export async function getIsMaximized(): Promise<boolean | undefined> {
  return window.puzzlemaster.window.isMaximized();
}
