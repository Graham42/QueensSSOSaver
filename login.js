chrome.storage.local.get(['j_username', 'j_password'], function(items) {
  if (items.j_username && items.j_password) {
    $('#q_shib_login')[0].j_username.value = items.j_username;
    $('#q_shib_login')[0].j_password.value = items.j_password;
    $('#q_shib_login').submit();
  } else {
    $('#q_shib_login').submit(function(event) {
      var j_username = event.currentTarget.j_username.value;
      var j_password = event.currentTarget.j_password.value;

      chrome.storage.local.set({ j_username: j_username, j_password: j_password });
    });
  }
});

