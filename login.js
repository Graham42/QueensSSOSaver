function randomString(length) {
  'use strict';
  var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  var result = '';
  for (var i = length; i > 0; --i) {
    result += CHARS[Math.round(Math.random() * (CHARS.length - 1))];
  }
  return result;
}

(function autoLogin () {
  'use strict';

  var FORM_ID = '#q_shib_login',
      USERNAME_INPUT_ID = '#username',
      PASSWORD_INPUT_ID = '#password',
      AUTH_FAILED_CLASS = '.fail-message',
      USERNAME_KEY = 'queensUserName',
      HASHED_WORD_KEY = 'queensHashedWord',
      MY_HASH_KEY = 'myQHashKey';

  chrome.storage.local.get(
    [USERNAME_KEY, HASHED_WORD_KEY, MY_HASH_KEY],
    function (items) {

      var loginForm = document.querySelector(FORM_ID);
      if (!loginForm){
        console.error('Login form not found');
        return;
      }

      // If authentication failed message, clear saved password
      if (document.querySelector(AUTH_FAILED_CLASS)){
        items = {};
        chrome.storage.local.set({
          USERNAME_KEY: '',
          HASHED_WORD_KEY: '',
          MY_HASH_KEY : ''
        });
      }

      // auto login if data saved
      if (items[USERNAME_KEY] && items[HASHED_WORD_KEY] && items[MY_HASH_KEY]) {
        loginForm.querySelector(USERNAME_INPUT_ID).value = items[USERNAME_KEY];
        loginForm.querySelector(PASSWORD_INPUT_ID).value = $.rc4DecryptStr(items[HASHED_WORD_KEY], items[MY_HASH_KEY]);
        loginForm.submit();

      }
      // else capture login info for next time
      else {
        loginForm.addEventListener(
          'submit',
          function(event) {
            var newItems = {};
            newItems[USERNAME_KEY] = event.currentTarget.j_username.value;
            newItems[MY_HASH_KEY] = randomString(23);
            newItems[HASHED_WORD_KEY] = $.rc4EncryptStr(event.currentTarget.j_password.value, newItems[MY_HASH_KEY]);

            chrome.storage.local.set(newItems);
          },
          false);
      }
    }
  );

})();
