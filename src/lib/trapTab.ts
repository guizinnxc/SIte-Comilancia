/* Mantém o Tab entre os elementos indicados. Se o foco estiver fora deles (depois de um clique no fundo), volta ao primeiro. */
export function trapTab(event: KeyboardEvent, focusable: HTMLElement[]) {
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.key !== "Tab" || !first || !last) return;

  const current = document.activeElement;
  if (!focusable.some((element) => element === current)) {
    event.preventDefault();
    first.focus();
  } else if (event.shiftKey && current === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && current === last) {
    event.preventDefault();
    first.focus();
  }
}
