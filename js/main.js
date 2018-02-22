var API_URL = "https://opendata.cbs.nl/ODataApi/odata/71930ned/";
var TYPED_DATASET = "TypedDataSet";
var typedDataArray;
var entryDisplayCount = 100, currentID = 0;

$(function () {
    //var data;
    // Look at "http://api.jquery.com/jquery.getjson/#jqxhr-object" for more information about the return type
    var jqxhr = $.getJSON(API_URL + TYPED_DATASET, function (data) {
        typedDataArray = data.value;
        console.log(typedDataArray);
    });

    // Assign handlers
    jqxhr.done(function(data) {
            console.log("Finished getting items");
            displayData(currentID, entryDisplayCount);
        })
        .fail(function() {
            console.error("There was an error with the youth crime query!" );
        })
        .always(function() {
            console.log( "Youth crime api query completed." );
        });
});

function displayData(startItemID, itemCount) {
    var items = [];
    for (var i = currentID; i > typedDataArray.length && i > currentID + entryDisplayCount; i++) {
        var item = typedDataArray[i];
        var html = "<div id='" + item.ID + "'>" + "<h1>" + (parseInt(item.ID) + 1) + ". Entry" +
            "<small><i> ID: " + item.ID + "</i></small></h1>" +
            "<ul>";

        $.each(item, function (key, value) {
            /* TODO translateLanguage some of the values corresponding to their key
                Geslacht (Sex) -> https://opendata.cbs.nl/ODataApi/odata/71930ned/Geslacht
                Leeftijd (Age) -> https://opendata.cbs.nl/ODataApi/odata/71930ned/Leeftijd
                Herkomstgroeperingen (Origin) -> https://opendata.cbs.nl/ODataApi/odata/71930ned/Herkomstgroeperingen
                Perioden (Periods) -> https://opendata.cbs.nl/ODataApi/odata/71930ned/Perioden

                Descriptions for each property -> https://opendata.cbs.nl/ODataApi/odata/71930ned/DataProperties
                Information about the complete data set -> https://opendata.cbs.nl/ODataApi/odata/71930ned/TableInfos
             */
            html += "<li class='" + key + "'>" + translateLanguage(key) + ": " + value + "</li>";
        });

        html += "</ul></div>";
        items.push(html);
    }

    var $content = $("<section></section>", {
        "class": "all-crimes",
        html: items.join("<hr>")
    });

    $("body").append($content);
}

function translateLanguage(json_key) {

    switch(json_key) {
        case "ID": return "ID";
        case "Geslacht": return "Sex";
        case "Leeftijd": return "Age";
        case "Herkomstgroeperingen": return "Origin";
        case "Perioden": return "Periods";
        case "TotaalAantalHaltJongeren_1": return "Total nr. of convicted minors";
        case "TotaalMisdrijvenHalt_2": return "Total number of crimes (HALT)";
        case "GeweldsmisdrijvenHalt_3": return "Violent crimes";
        case "VernielingEnOpenbareOrdeHalt_4": return "Destruction of public property";
        case "VermogensmisdrijvenHalt_5": return "Property crimes";
        case "OverigeMisdrijvenHalt_6": return "Other crimes";
        case "TotaalOvertredingenHalt_7": return "Total nr. of crimes";
        case "BaldadigheidHalt_8": return "Wantonness crimes";
        case "OvertredingLeerplichtwet_9": return "Educational attendance law";
        case "VuurwerkovertredingenHalt_10": return "Firework violations";
        case "OverigeOvertredingenHalt_11": return "Other violations";
        case "OnbekendMisdrijfOfOvertreding_12": return "Unknown crime or offense";
        case "TotaalAantalHaltJongeren_13": return "Total number of youth affiliated with Halt";
        case "TotaalMisdrijvenHalt_14": return "Total number of crimes (HALT)";
        case "GeweldsmisdrijvenHalt_15": return "Violence crimes (HALT)";
        case "VernielingEnOpenbareOrdeHalt_16": return "Vandalism and public order disturbance (HALT)";
        case "VermogensmisdrijvenHalt_17": return "Capital crimes (HALT)";
        case "OverigeMisdrijvenHalt_18": return "Remaining crimes (HALT)";
        case "TotaalOvertredingenHalt_19": return "Total number of offenses (HALT)";
        case "BaldadigheidHalt_20": return "Pranks/Offense/Disgust? (HALT)";
        case "OvertredingLeerplichtwet_21": return "Offenses public education law";
        case "VuurwerkovertredingenHalt_22": return "Offenses related to fireworks (HALT)";
        case "OverigeOvertredingenHalt_23": return "Remaining offenses (HALT)";
        case "OnbekendMisdrijfOfOvertreding_24": return "Unknown crime or offense";
    }

    return json_key + " (untranslated)";
}

function getValue(originalKey, originalValue) {
    var url = "";
    switch (originalKey) {
        case "Geslacht": // sex
            url += "Geslacht";
            break;
        case "Leeftijd": // age
            url += "Leeftijd";
            break;
        case "Herkomstgroeperingen": // origin
            url += "Herkomstgroeperingen";
            break;
        case "Perioden": // periods
            url += "Perioden";
            break;

        default: // no available value translation
            return originalValue;
    }

    // Look at "http://api.jquery.com/jquery.getjson/#jqxhr-object" for more information about the return type
    var jqxhr = $.getJSON(API_URL + url, function (data) {
        $.each(data.value, function(i, item) {
            console.log(originalKey, originalValue === item.Key);
            if (item.Key === originalValue) {
                return item.Title;
            }
        });
        return "value translation not found";
    });
}