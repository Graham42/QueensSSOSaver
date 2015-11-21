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
  'use strict';
  try {
    return chrome.storage.local;
  } catch (e) {
    return {
      get: function get(keys, cb){
        var r = {};
        keys.forEach(function getValue(k){
          r[k] = localStorage.getItem(k);
        });
        cb(r);
      },
      set: function set(x){
        Object.keys(x).forEach(function setValue(k){
          localStorage.setItem(k, x[k]);
        });
      }
    };
  }
}

function getElement(pattern, parentElem){
  'use strict';
  var elem = ((parentElem) ? parentElem : document).querySelectorAll(pattern)[0];
  if (!elem){
    var errMsg = 'No elements found for "'+pattern+'"';
    console.error(errMsg);
    throw errMsg;
  }
  return elem;
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
    function getCb (items) {

      var loginForm = getElement(FORM_IDS);

      // If authentication failed message, clear saved password
      if (document.querySelectorAll(AUTH_FAILED_IDS).length > 0){
        console.log('Failed login, reseting items');
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
          function submitEvent (event) {
            var newItems = {};
            newItems[MY_HASH_KEY] = randomString(23);

            var userVal = getElement(USERNAME_INPUT_IDS, loginForm).value;
            var pVal = getElement(PASSWORD_INPUT_IDS, loginForm).value;
            if (!userVal || !pVal){
              throw 'Couldn\'t get username or pass values';
            }
            newItems[USERNAME_KEY] = sjcl.encrypt(newItems[MY_HASH_KEY], userVal);
            newItems[HASHED_WORD_KEY] = sjcl.encrypt(newItems[MY_HASH_KEY], pVal);

            _storage.set(newItems);
          },
          false);
      }

      // auto login if data saved
      if (items[USERNAME_KEY] && items[HASHED_WORD_KEY] && items[MY_HASH_KEY]) {
        // if can't decrypt, may need to get login info again
        var u, p;
        try {
          u = sjcl.decrypt(items[MY_HASH_KEY], items[USERNAME_KEY]);
          p = sjcl.decrypt(items[MY_HASH_KEY], items[HASHED_WORD_KEY]);
        } catch(err) {
          console.error('Couldn\'t decrypt');
          listenToSave();
        }
        if (u && p){
          getElement(USERNAME_INPUT_IDS, loginForm).value = u;
          getElement(PASSWORD_INPUT_IDS, loginForm).value = p;
          try {
            getElement(SUBMIT_BUTTON_IDS, loginForm).click();
          } catch (e) {
            loginForm.submit();
          }
        }
      }
      // else capture login info for next time
      else {
        listenToSave();
      }
    }
  );

})();
