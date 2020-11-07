function nav(event) {
  event.preventDefault();
  const href = event.target.href;

  if (location.href !== href) {
    history.pushState(null, null, href);
    // Dispatching a popstate event to trigger router listener
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}
