$(document).ready(function () {
  function checkStatus() {
    $.get("http://0.0.0.0:5001/api/v1/status/", function (data) {
      if (data.status === "OK") {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  }

  // Check API status on page load
  checkStatus();

  // Optionally, set an interval to periodically check the status
  // setInterval(checkStatus, 5000); // Check every 5 seconds
});
