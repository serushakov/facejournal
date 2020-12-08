export default function nav(event) {
  event.preventDefault();
  const { href } = event.currentTarget;

  if (window.location.href !== href) {
    window.history.pushState(null, null, href);
    // Dispatching a popstate event to trigger router listener
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}
