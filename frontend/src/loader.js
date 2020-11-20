export function loadComponent(path) {
  import(path);
}

function processNodes(input) {
  return Array.from(input).map((node) => {
    // need to clone scirpt elements for them to work
    if (node instanceof HTMLScriptElement) {
      const script = document.createElement('script');
      for (const attribute of Array.from(node.attributes)) {
        script.setAttribute(attribute.name, attribute.value);
      }
      return script;
    }
    return node;
  });
}

const contentMap = new Map();

export async function loadAndParseHtml(path) {
  if (contentMap.get(path)) return contentMap.get(path);

  const data = await (await fetch(path)).text();

  const parser = new DOMParser();
  const component = parser.parseFromString(data, 'text/html');
  const nodes = processNodes(component.head.childNodes);

  component.head.innerHTML = '';
  component.head.append(...nodes);

  contentMap.set(path, component);

  return component;
}

export async function getPageContent(path) {
  const r = await fetch(path);
  const data = await r.text();

  const parser = new DOMParser();
  const component = parser.parseFromString(data, 'text/html');
  const head = processNodes(component.head.childNodes);
  const body = processNodes(component.body.childNodes);

  return { head, body };
}
