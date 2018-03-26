const API_URL = "https://opendata.cbs.nl/ODataApi/odata/71930ned/";
const TYPED_DATASET = "TypedDataSet",
    GENDER_TRANSLATION = "Geslacht",
    AGE_TRANSLATION = "Leeftijd",
    ORIGIN_TRANSLATION = "Herkomstgroeperingen",
    PERIOD_TRANSLATION = "Perioden";
var typedDataArray, genderTranslations, ageTranslations, originTranslations, periodTranslations;

var statistics = {},
    filteredStats = {};

var $contentContainer;

$(function () {
    loadAPIData();
});

$(document).ajaxStart(function() {
    toggleLoadingScreen();
});
$(document).ajaxStop(function() {
    toggleLoadingScreen();
});

function toggleLoadingScreen() {
    if (!isDataLoaded()) {
        $("#loading").fadeIn("fast");
    } else {
        $("#loading").fadeOut("slow");
    }
}

function loadAPIData() {

    typedDataArray = undefined;
    genderTranslations = undefined;
    ageTranslations = undefined;
    originTranslations = undefined;
    periodTranslations = undefined;

    loadTypedDataSet();
    loadPeriodTranslations();
    loadOriginTranslations();
    loadAgeTranslations();
    loadGenderTranslations();
}

function updateStatDisplay(data) {
    if (isDataLoaded()) {
        convertToStats(data);
        displayStats(statistics);
    }
}


function displayStats(stats) {
    console.log("Displaying statistics");
    $contentContainer = $("#content")[0];

    var $table = $("<table>");
    $table.append("<tr><th>Tag</th><th>Category</th><th>Subcategory</th></tr>");

    $.each(stats, function(keyForObject, crimeCategoryObject) {
        $.each(crimeCategoryObject, function (key, array) {
            $table.append(
                "<tr>" +
                "<td>" + keyForObject.toString() + "</td>" +
                "<td>" + key + "</td>" +
                "<td>" + array.length + "</td>" +
                "</tr>");
        })
    });

    console.log($table);

    $contentContainer.append($table);
}

function isDataLoaded() {
    return typedDataArray !== undefined
        && genderTranslations !== undefined
        && ageTranslations !== undefined
        && originTranslations !== undefined
        && periodTranslations !== undefined;

}

function convertToStats(data) {
    statistics = {};
    $.each(data, function(indexInArray, obj) {
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

function loadTypedDataSet() {
    // Look at "http://api.jquery.com/jquery.getjson/#jqxhr-object" for more information about the return type
    var jqxhr = $.getJSON(API_URL + TYPED_DATASET, function (data) {

        typedDataArray = fixJSONKey(data.value, "ID");
        console.log(typedDataArray);

        updateStatDisplay(typedDataArray);
    });

    // Assign handlers
    jqxhr.fail(function() {
            console.error("There was an error with the youth crime query!" );
        });

}

function loadGenderTranslations() {
    var jqxhr = $.getJSON(API_URL + GENDER_TRANSLATION, function (data) {
        genderTranslations = fixJSONKey(data.value);
        console.log(genderTranslations);

        updateStatDisplay(typedDataArray);
    });

    // Assign handlers
    jqxhr.fail(function() {
            console.error("There was an error with the youth crime query!");
        });

}

function loadAgeTranslations() {
    var jqxhr = $.getJSON(API_URL + AGE_TRANSLATION, function (data) {
        ageTranslations = fixJSONKey(data.value);
        console.log(ageTranslations);

        updateStatDisplay(typedDataArray);
    });

    // Assign handlers
    jqxhr.fail(function() {
            console.error("There was an error with the youth crime query!" );
        });
}

function loadOriginTranslations() {
    var jqxhr = $.getJSON(API_URL + ORIGIN_TRANSLATION, function (data) {
        originTranslations = fixJSONKey(data.value);
        console.log(originTranslations);
        updateStatDisplay(typedDataArray);
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
        updateStatDisplay(typedDataArray);
    });

    // Assign handlers
    jqxhr.fail(function() {
            console.error("There was an error with the youth crime query!" );
        });
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