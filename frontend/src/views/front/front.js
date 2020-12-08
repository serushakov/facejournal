import store from '../../state/index.js';
import {
  selectUser,
  selectIsUserInitialized,
} from '../../state/auth/selectors.js';
import Router from '../../router/Router.js';

class FrontPage extends HTMLElement {
  connectedCallback() {
    store.subscribeWithSelectors(
      this.listener,
      selectUser,
      selectIsUserInitialized
    );
  }

  listener = ([user], [isInitialized]) => {
    if (!isInitialized) return;

    if (user) {
      Router.navigate('/feed', { replace: true });
    } else {
      Router.navigate('/login', { replace: true });
    }
  };
}

customElements.define('front-page', FrontPage);
