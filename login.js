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
      USERNAME_KEY = md5('queensUserName'),
      HASHED_WORD_KEY = md5('queensHashedWord'),
      MY_HASH_KEY = md5('myQHashKey');

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
        var newItems = {};
        newItems[USERNAME_KEY] = '';
        newItems[HASHED_WORD_KEY] =  '';
        newItems[MY_HASH_KEY] = '';
        chrome.storage.local.set(newItems);
      }

      // define this as a function that can be called
      function listenToSave(){
        loginForm.addEventListener(
          'submit',
          function(event) {
            var newItems = {};
            newItems[MY_HASH_KEY] = randomString(23);
            newItems[USERNAME_KEY] = sjcl.encrypt(newItems[MY_HASH_KEY], event.currentTarget.j_username.value);
            newItems[HASHED_WORD_KEY] = sjcl.encrypt(newItems[MY_HASH_KEY], event.currentTarget.j_password.value);

            chrome.storage.local.set(newItems);
          },
          false);
      }

      // auto login if data saved
      if (items[USERNAME_KEY] && items[HASHED_WORD_KEY] && items[MY_HASH_KEY]) {
        // if can't decrypt, may need to get login info again
        try {
          loginForm.querySelector(USERNAME_INPUT_ID).value = sjcl.decrypt(items[MY_HASH_KEY], items[USERNAME_KEY]);
          loginForm.querySelector(PASSWORD_INPUT_ID).value = sjcl.decrypt(items[MY_HASH_KEY], items[HASHED_WORD_KEY]);
          loginForm.submit();
        } catch(err) {
          listenToSave();
        }
      }
      // else capture login info for next time
      else {
        listenToSave();
      }
    }
  );

})();
