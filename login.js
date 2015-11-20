function randomString(length) {
  'use strict';
  var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  var result = '';
  for (var i = length; i > 0; --i) {
    result += CHARS[Math.round(Math.random() * (CHARS.length - 1))];
  }
  return result;
}

function storageProxy(){
  try {
    return chrome.storage.local;
  } catch (e) {
    return {
      get: function(keys, cb){
        var r = {};
        keys.forEach(function(k){
          r[k] = localStorage.getItem(k);
        });
        cb(r);
      },
      set: function(x){
        Object.keys(x).forEach(function(k){
          localStorage.setItem(k, x[k]);
        });
      }
    };
  }
}

(function autoLogin () {
  'use strict';

  var _storage = storageProxy();

  var FORM_IDS = '#q_shib_login, #aspnetForm',
      USERNAME_INPUT_IDS = '#username, [id*=UsernameTextBox]',
      PASSWORD_INPUT_IDS = '#password, [id*=PasswordTextBox]',
      AUTH_FAILED_IDS = '.fail-message, [id*=ErrorTextLabel]',
      SUBMIT_BUTTON_IDS = '[id*=SubmitButton]',
      USERNAME_KEY = md5('queensUserName'),
      HASHED_WORD_KEY = md5('queensHashedWord'),
      MY_HASH_KEY = md5('myQHashKey');

  _storage.get(
    [USERNAME_KEY, HASHED_WORD_KEY, MY_HASH_KEY],
    function (items) {

      var loginForm = document.querySelectorAll(FORM_IDS)[0];
      if (!loginForm){
        console.error('Login form not found');
        return;
      }

      // If authentication failed message, clear saved password
      if (document.querySelectorAll(AUTH_FAILED_IDS).length > 0){
        var newItems = {};
        newItems[USERNAME_KEY] = '';
        newItems[HASHED_WORD_KEY] =  '';
        newItems[MY_HASH_KEY] = '';
        _storage.set(newItems);
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

            _storage.set(newItems);
          },
          false);
      }

      // auto login if data saved
      if (items[USERNAME_KEY] && items[HASHED_WORD_KEY] && items[MY_HASH_KEY]) {
        // if can't decrypt, may need to get login info again
        try {
          loginForm.querySelectorAll(USERNAME_INPUT_IDS)[0].value = sjcl.decrypt(items[MY_HASH_KEY], items[USERNAME_KEY]);
          loginForm.querySelectorAll(PASSWORD_INPUT_IDS)[0].value = sjcl.decrypt(items[MY_HASH_KEY], items[HASHED_WORD_KEY]);
          var submitBtn = loginForm.querySelectorAll(SUBMIT_BUTTON_IDS)[0];
          if (submitBtn){
            submitBtn.click();
          } else {
            loginForm.submit();
          }
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
