let switchLabel: HTMLLabelElement | undefined;

function createSwitchLabel(doc: Document): HTMLLabelElement {
  const label = doc.createElement("label");
  label.setAttribute("aria-hidden", "true");
  label.style.cssText = "position:fixed;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
  const input = doc.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  input.tabIndex = -1;
  label.appendChild(input);
  doc.body.appendChild(label);
  return label;
}

// A tick while scrolling. Android takes navigator.vibrate after the first tap.
// iOS Safari has no vibrate, and toggles a switch from script instead, which
// vibrates on iOS 17.4 to 26.4 and is reported to do nothing from iOS 26.5.
export function tickHaptic(nav: Navigator, doc: Document): void {
  if (typeof nav.vibrate === "function") {
    nav.vibrate(8);
    return;
  }
  switchLabel ??= createSwitchLabel(doc);
  switchLabel.click();
}
