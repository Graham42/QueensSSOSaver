var notLoggedInStr = "not logged in";
if ($(".logininfo").text().toLowerCase().indexOf(notLoggedInStr) >= 0) {

  var loginLink = "#"
  var loginChildren = $(".logininfo").find('a').each(function() {
    if ($(this).text().toLowerCase().indexOf("login") >= 0) {
      loginLink = $(this).attr("href");
      return false;
    }
  });

  // should follow something like "https://moodle.queensu.ca/2013-14/login/index.php"
  window.location = loginLink;
}
