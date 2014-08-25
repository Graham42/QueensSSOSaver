(function loginIfNeeded() {
  'use strict';

  var NOT_LOGGED_IN_TEXT = 'not logged in',
      LOGIN_TEXT = 'login',
      loginInfoDiv = document.querySelector('.logininfo');

  if (loginInfoDiv && loginInfoDiv.innerHTML.toLowerCase().indexOf(NOT_LOGGED_IN_TEXT) !== -1) {

    var loginLink = loginInfoDiv.querySelector('a');

    // confirm that this is the Login link
    if (loginLink && loginLink.text.toLowerCase() === LOGIN_TEXT){
      window.location = loginLink.href || '#';
    }
  }
})();