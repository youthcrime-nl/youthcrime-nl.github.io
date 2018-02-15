var $button;
$(document).ready(function () {
    $button = $("button").first();
    $button.click(function () {
        $("#text").css("color", "pink");
        $button.text("Why would you do that to me?!");
        $button.first().text("Why would you do that to me?!");
    });
});

