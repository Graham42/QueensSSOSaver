chrome.storage.local.get(['queensUserName', 'queensHashedWord'], function(items) {

  if (items.queensUserName && items.queensHashedWord) {
    $('#q_shib_login')[0].queensUserName.value = items.queensUserName;
    $('#q_shib_login')[0].queensHashedWord.value = items.queensHashedWord;
    $('#q_shib_login').submit();

  } else {
    $('#q_shib_login').submit(function(event) {
      var queensUserName = event.currentTarget.queensUserName.value;
      var queensHashedWord = event.currentTarget.queensHashedWord.value;

      chrome.storage.local.set({
        queensUserName: queensUserName,
        queensHashedWord: queensHashedWord
      });
    });
  }
});
