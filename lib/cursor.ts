export type CursorMode = "default" | "hover" | "view"

const HIT = "a[href], button:not(:disabled), [role='button'], [data-cursor]"

export function cursorModeFrom(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "default"
  if (target.closest("[data-cursor='view']")) return "view"
  if (target.closest(HIT)) return "hover"
  return "default"
}

export function setCursorOverride(mode: CursorMode | null) {
  if (mode && mode !== "default") {
    document.documentElement.dataset.cursorOverride = mode
  } else {
    delete document.documentElement.dataset.cursorOverride
  }

  const cursor = document.querySelector<HTMLElement>(".site-cursor")
  if (!cursor) return

  if (mode && mode !== "default") {
    cursor.dataset.mode = mode
    return
  }

  const active = document.activeElement
  const hovered = document.querySelector(":hover")
  cursor.dataset.mode = resolveCursorMode(hovered ?? active)
}

export function resolveCursorMode(target: EventTarget | null): CursorMode {
  const override = document.documentElement.dataset.cursorOverride as
    | CursorMode
    | undefined
  if (override === "view" || override === "hover") return override
  return cursorModeFrom(target)
}
