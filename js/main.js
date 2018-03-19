const API_URL = "https://opendata.cbs.nl/ODataApi/odata/71930ned/";
const TYPED_DATASET = "TypedDataSet",
    SEX_TRANSLATION = "Geslacht",
    AGE_TRANSLATION = "Leeftijd",
    ORIGIN_TRANSLATION = "Herkomstgroeperingen",
    PERIOD_TRANSLATION = "Perioden";
var typedDataArray, sexTranslations, ageTranslations, originTranslations, periodTranslations;
var entryDisplayCount = 10,
    currentID = 0;

var loading = true;

$(function () {
    loadAPIData(function() {
        displayData(currentID, entryDisplayCount)
    });
});

$(document).ajaxStart(function() {
    if (!loading) {
        toggleLoadingScreen();
    }
});
$(document).ajaxStop(function() {
    toggleLoadingScreen();
});

function toggleLoadingScreen() {
    if (!loading) {
        $("#loading").fadeIn("fast");
    } else {
        $("#loading").fadeOut("slow");
    }

    loading = !loading;
}

function loadAPIData(callback) {
    loadPeriodTranslations(
        loadOriginTranslations(
            loadAgeTranslations(
                loadSexTranslations(
                    loadTypedDataSet()
                )
            )
        )
    );
}

function loadTypedDataSet(callback) {
    // Look at "http://api.jquery.com/jquery.getjson/#jqxhr-object" for more information about the return type
    var jqxhr = $.getJSON(API_URL + TYPED_DATASET, function (data) {
        typedDataArray = data.value;
        console.log(typedDataArray);
    });

    // Assign handlers
    jqxhr.done(function(data) {
        console.log("Finished loading typed data set");
        if (callback != null) callback();
    })
        .fail(function() {
            console.error("There was an error with the youth crime query!" );
        });
}

function loadSexTranslations(callback) {
    var jqxhr = $.getJSON(API_URL + SEX_TRANSLATION, function (data) {
        sexTranslations = data.value;
        console.log(sexTranslations);
    });

    // Assign handlers
    jqxhr.done(function(data) {
        console.log("Finished loading sex translations");
        if (callback != null) callback();
    })
        .fail(function() {
            console.error("There was an error with the youth crime query!" );
        });
}

function loadAgeTranslations(callback) {
    var jqxhr = $.getJSON(API_URL + AGE_TRANSLATION, function (data) {
        ageTranslations = data.value;
        console.log(ageTranslations);
    });

    // Assign handlers
    jqxhr.done(function(data) {
        console.log("Finished loading age translations");
        if (callback != null) callback();
    })
        .fail(function() {
            console.error("There was an error with the youth crime query!" );
        });
}

function loadOriginTranslations(callback) {
    var jqxhr = $.getJSON(API_URL + ORIGIN_TRANSLATION, function (data) {
        originTranslations = data.value;
        console.log(originTranslations);
    });

    // Assign handlers
    jqxhr.done(function(data) {
        console.log("Finished loading origin translations");
        if (callback != null) callback();
    })
        .fail(function() {
            console.error("There was an error with the youth crime query!" );
        });
}

function loadPeriodTranslations(callback) {
    var jqxhr = $.getJSON(API_URL + PERIOD_TRANSLATION, function (data) {
        periodTranslations = data.value;
        console.log(periodTranslations);
    });

    // Assign handlers
    jqxhr.done(function(data) {
        console.log("Finished loading period translation");
        if (callback != null) callback();
    })
        .fail(function() {
            console.error("There was an error with the youth crime query!" );
        });
}

function displayData(startItemID, itemCount) {
    var items = [];
    for (var i = currentID; i < typedDataArray.length && i > currentID + entryDisplayCount; i++) {
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
    console.warn("No translation value was found for'", json_key, "'");
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