$(document).ready(function() {
  let caja = $(".door");

  caja.on("mouseover", function() {
      $(this).css("background-image", 'url("/images/puerta2.png")');
    }).on("mouseout", function() {
        $(this).css("background-image", 'url("/images/puerta.png")');
      })
   
});
