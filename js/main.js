const API_URL = "https://opendata.cbs.nl/ODataApi/odata/71930ned/";
const TYPED_DATASET = "TypedDataSet",
    GENDER_TRANSLATION = "Geslacht",
    AGE_TRANSLATION = "Leeftijd",
    ORIGIN_TRANSLATION = "Herkomstgroeperingen",
    PERIOD_TRANSLATION = "Perioden";
var typedDataArray, genderTranslations, ageTranslations, originTranslations, periodTranslations;

var statistics = {},
    filteredStats = {};

var loading = true;

$(function () {
    loadAPIData();

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

function loadAPIData() {

    loadPeriodTranslations(
        loadOriginTranslations(
            loadAgeTranslations(
                loadGenderTranslations(
                    loadTypedDataSet()
                )
            )
        )
    );
}

function convertToStats(callback) {
    if (callback != null) callback();
    statistics = {};
    $.each(typedDataArray, function(indexInArray, obj) {
        $.each(obj, function (key, value) {
            if (key.toString() !== "ID") {
                if (statistics[key] === undefined) {
                    statistics[key] = {};
                }
                if (statistics[key][value] === undefined) {
                    statistics[key][value] = [];
                }
                statistics[key][value].push(obj);
            }
        });
    });
    console.log("All stats", statistics);
}

function fixJSONKey(data, key) {
    if (key === undefined)
        key = "Key";

    var fixedJSON = {};
    $.each(data, function (i, item){
        fixedJSON[item[key]] = item;
    });
    return fixedJSON;
}

function loadTypedDataSet(callback) {
    // Look at "http://api.jquery.com/jquery.getjson/#jqxhr-object" for more information about the return type
    var jqxhr = $.getJSON(API_URL + TYPED_DATASET, function (data) {

        typedDataArray = fixJSONKey(data.value, "ID");
        console.log(typedDataArray);
        if (callback != null) callback();
    });

    // Assign handlers
    jqxhr.fail(function() {
            console.error("There was an error with the youth crime query!" );
        });
}

function loadGenderTranslations(callback) {
    var jqxhr = $.getJSON(API_URL + GENDER_TRANSLATION, function (data) {
        genderTranslations = fixJSONKey(data.value);
        console.log(genderTranslations);
        if (callback != null) callback();
    });

    // Assign handlers
    jqxhr.fail(function() {
            console.error("There was an error with the youth crime query!");
        });
}

function loadAgeTranslations(callback) {
    var jqxhr = $.getJSON(API_URL + AGE_TRANSLATION, function (data) {
        ageTranslations = fixJSONKey(data.value);
        console.log(ageTranslations);
        if (callback != null) callback();
    });

    // Assign handlers
    jqxhr.fail(function() {
            console.error("There was an error with the youth crime query!" );
        });
}

function loadOriginTranslations(callback) {
    var jqxhr = $.getJSON(API_URL + ORIGIN_TRANSLATION, function (data) {
        originTranslations = fixJSONKey(data.value);
        console.log(originTranslations);
        if (callback != null) callback();
    });

    // Assign handlers
    jqxhr.fail(function() {
            console.error("There was an error with the youth crime query!" );
        });
}

function loadPeriodTranslations(callback) {
    var jqxhr = $.getJSON(API_URL + PERIOD_TRANSLATION, function (data) {
        periodTranslations = fixJSONKey(data.value);
        console.log(periodTranslations);
        if (callback != null) callback();
        convertToStats();
    });

    // Assign handlers
    jqxhr.fail(function() {
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