class Link extends HTMLAnchorElement {
  connectedCallback() {
    console.log("connected");

    this.addEventListener("click", this.handleClick);
  }

  handleClick(event) {
    event.preventDefault();
    if (location.href !== this.href) {
      history.pushState(null, null, this.href);
      // Dispatching a popstate event to trigger router listener
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }
}

customElements.define("i-link", Link, { extends: "a" });
