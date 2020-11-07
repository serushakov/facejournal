function loadComponent(path) {
  fetch(path)
    .then((r) => r.text())
    .then((data) => {
      const parser = new DOMParser();
      const component = parser.parseFromString(data, "text/html");

      const nodes = processNodes(component.head.childNodes);

      document.head.append(...nodes);
    });
}

async function getPageContent(path) {
  const r = await fetch(path);
  const data = await r.text();

  const parser = new DOMParser();
  const component = parser.parseFromString(data, "text/html");
  const head = processNodes(component.head.childNodes);
  const body = processNodes(component.body.childNodes);

  return { head, body };
}

function processNodes(input) {
  return Array.from(input).map((node) => {
    // need to clone scirpt elements for them to work
    if (node instanceof HTMLScriptElement) {
      const script = document.createElement("script");
      for (const attribute of Array.from(node.attributes)) {
        script.setAttribute(attribute.name, attribute.value);
      }
      return script;
    }
    return node;
  });
}

async function loadStyles(link) {
  const styles = await fetch(link).then((r) => r.text());
  const style = document.createElement("style");
  style.innerText = styles;

  return style;
}
