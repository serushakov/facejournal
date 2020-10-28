function loadComponent(path) {
  fetch(path)
    .then((r) => r.text())
    .then((data) => {
      const parser = new DOMParser();
      const component = parser.parseFromString(data, "text/html");

      const nodes = Array.from(component.head.childNodes).map((node) => {
        // need to clone scirpt elements for them to work
        if (node instanceof HTMLScriptElement) {
          const script = document.createElement("script");
          script.src = node.src;
          return script;
        }
        return node;
      });

      document.head.append(...nodes);
    });
}
