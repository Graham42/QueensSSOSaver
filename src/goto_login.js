(function loginIfNeeded() {
  'use strict';

  var NOT_LOGGED_IN_TEXT = 'not logged in',
      LOGIN_RE = /log\s*in/,
      loginInfoDiv = document.querySelector('.logininfo');

  if (loginInfoDiv && loginInfoDiv.innerHTML.toLowerCase().indexOf(NOT_LOGGED_IN_TEXT) !== -1) {

    var loginLink = loginInfoDiv.querySelector('a');

    // confirm that this is the Login link
    if (loginLink && LOGIN_RE.test(loginLink.text.toLowerCase())){
      window.location = loginLink.href || '#';
    }
  }
})();