var notLoggedInStr = "You are not logged";
if ( $(".logininfo").text().substring(0, notLoggedInStr.length) == notLoggedInStr ){
  window.location = "https://moodle.queensu.ca/2013-14/login/index.php";
}

