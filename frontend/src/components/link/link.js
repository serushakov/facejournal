class Link extends HTMLAnchorElement {
  connectedCallback() {
    console.log("connected");

    this.addEventListener("click", this.handleClick);
  }

  handleClick(event) {
    event.preventDefault();
    if (location.href !== this.href) {
      history.pushState(null, null, this.href);
    }
  }
}

customElements.define("i-link", Link, { extends: "a" });
