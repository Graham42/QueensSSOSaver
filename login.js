function randomString(length) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\'
  var result = '';
  for (var i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return result;
}

chrome.storage.local.get(['queensUserName', 'queensHashedWord', 'myQHashKey'], function(items) {

  if (items.queensUserName && items.queensHashedWord && items.myQHashKey) {
    $('#q_shib_login')[0].j_username.value = items.queensUserName;
    $('#q_shib_login')[0].j_password.value = $.rc4DecryptStr(items.queensHashedWord, items.myQHashKey);
    $('#q_shib_login').submit();

  } else {
    $('#q_shib_login').submit(function(event) {
      var queensUserName = event.currentTarget.j_username.value;
      var hashkey = randomString(23);
      var queensHashedWord = $.rc4EncryptStr(event.currentTarget.j_password.value, hashkey);

      chrome.storage.local.set({
        queensUserName: queensUserName,
        queensHashedWord: queensHashedWord,
        myQHashKey : hashkey
      });
    });
  }
});
