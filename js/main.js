$(function () {
    var API_URL = "https://opendata.cbs.nl/ODataApi/odata/71930ned/TypedDataSet";
    //var data;
    // Look at "http://api.jquery.com/jquery.getjson/#jqxhr-object" for more information about the return type
    var jqxhr = $.getJSON(API_URL, function () {
        console.log("success");
        //data = t;
    });
    // Assign handlers
    jqxhr.done(function(data) {
            var items = [];
            $.each(data.value, function (i, item) {
                var html = "<div id='" + item.ID + "'>" + "<h1>" + (parseInt(item.ID) + 1) + ". Entry" +
                    "<small><i> ID: " + item.ID + "</i></small></h1>" +
                    "<ul>";

                $.each(item, function (key, value) {
                    html += "<li class='" + key + "'>" + translate(key) + ": " + value + "</li>";
                });

                html += "</ul></div>";
                items.push(html);
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

function translate(json_key) {

    switch(json_key) {
        case "ID": return "ID";
        case "Geslacht": return "Sex";
        case "Leeftijd": return "Age";
        case "Herkomstgroeperingen": return "Origin";
        case "Perioden": return "Periods";
        case "TotaalAantalHaltJongeren_1": return "Total nr. of convicted minors";
        case "TotaalMisdrijvenHalt_2": return "TotaalMisdrijvenHalt_2 (untranslated)";
        case "GeweldsmisdrijvenHalt_3": return "Violent crimes";
        case "VernielingEnOpenbareOrdeHalt_4": return "Destruction of public property";
        case "VermogensmisdrijvenHalt_5": return "Property crimes";
        case "OverigeMisdrijvenHalt_6": return "Other crimes";
        case "TotaalOvertredingenHalt_7": return "Total nr. of crimes";
        case "BaldadigheidHalt_8": return "Wantonness crimes";
        case "OvertredingLeerplichtwet_9": return "Educational attendance law";
        case "VuurwerkovertredingenHalt_10": return "Firework violations";
        case "OverigeOvertredingenHalt_11": return "Other violations";
        case "OnbekendMisdrijfOfOvertreding_12": return "OnbekendMisdrijfOfOvertreding_12 (untranslated)";
        case "TotaalAantalHaltJongeren_13": return "TotaalAantalHaltJongeren_13 (untranslated)";
        case "TotaalMisdrijvenHalt_14": return "TotaalMisdrijvenHalt_14 (untranslated)";
        case "GeweldsmisdrijvenHalt_15": return "GeweldsmisdrijvenHalt_15 (untranslated)";
        case "VernielingEnOpenbareOrdeHalt_16": return "VernielingEnOpenbareOrdeHalt_16 (untranslated)";
        case "VermogensmisdrijvenHalt_17": return "VermogensmisdrijvenHalt_17 (untranslated)";
        case "OverigeMisdrijvenHalt_18": return "OverigeMisdrijvenHalt_18 (untranslated)";
        case "TotaalOvertredingenHalt_19": return "TotaalOvertredingenHalt_19 (untranslated)";
        case "BaldadigheidHalt_20": return "BaldadigheidHalt_20 (untranslated)";
        case "OvertredingLeerplichtwet_21": return "OvertredingLeerplichtwet_21 (untranslated)";
        case "VuurwerkovertredingenHalt_22": return "VuurwerkovertredingenHalt_22 (untranslated)";
        case "OverigeOvertredingenHalt_23": return "OverigeOvertredingenHalt_23 (untranslated)";
        case "OnbekendMisdrijfOfOvertreding_24": return "OnbekendMisdrijfOfOvertreding_24 (untranslated)";

    }

    return null;
}