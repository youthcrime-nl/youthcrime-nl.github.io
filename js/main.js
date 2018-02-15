$(function () {
    var API_URL = "https://opendata.cbs.nl/ODataApi/odata/71930ned/TypedDataSet";
    //var data;
    // Look at "http://api.jquery.com/jquery.getjson/#jqxhr-object" for more information about the return type
    var jqxhr = $.getJSON(API_URL, function (t) {
        console.log("success");
        //data = t;
    });
    // Assign handlers
    jqxhr.done(function(data) {
            var items = [];
            $.each(data.value, function (i, item) {
                items.push(
                    "<div id='" + item.id + "'>" +
                        "<h1>" + item.Perioden + "</h1>" +
                    "</div>"
                );
            });

            var $content = $("<section></section>", {
                "class": "all-crimes",
                html: items.join("<hr>")
            });

            $("body").append($content);

            console.log(data);
        })
        .fail(function() {
            console.log( "error" );
        })
        .always(function() {
            console.log( "complete" );
        });
});

