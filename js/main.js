const API_URL = "https://opendata.cbs.nl/ODataApi/odata/71930ned/";
const TYPED_DATASET = "TypedDataSet",
    GENDER_TRANSLATION = "Geslacht",
    AGE_TRANSLATION = "Leeftijd",
    ORIGIN_TRANSLATION = "Herkomstgroeperingen",
    PERIOD_TRANSLATION = "Perioden";
var typedDataArray, genderTranslations, ageTranslations, originTranslations, periodTranslations;

var $contentContainer;


/***************************************************
 *
 * Main Function Stuff
 * - Executed on document load
 *
 ***************************************************/
$(function () {
    loadAPIData();
});

/***************************************************
 *
 * Ajax Behaviour Stuff
 *
 ***************************************************/
$(document).ajaxStart(function() {
    toggleLoadingScreen();
});
$(document).ajaxStop(function() {
    toggleLoadingScreen();
});

/***************************************************
 *
 * Display Handling Stuff
 *
 ***************************************************/
function toggleLoadingScreen() {
    if (!isDataLoaded()) {
        $("#loading").fadeIn("fast");
    } else {
        $("#loading").fadeOut("slow");
    }
}

function updateStatDisplay(data) {
    if (isDataLoaded()) {
        var stats = convertToStats(data, ["Leeftijd", "Geslacht", "Perioden", "Herkomstgroeperingen"]);
        displayStats(stats);
    }
}

function displayStats(stats) {
    console.log("Displaying statistics");
    $contentContainer = $("#content")[0];
    $contentContainer.innerHTML = "";

    var $table = $("<table>");
    $table.append("<tr><th>Tag</th><th>Category</th><th>Count</th></tr>");

    $.each(stats, function(key, crimeCategoryObject) {
        $.each(crimeCategoryObject, function (categoryKey, array) {
            $table.append(
                "<tr>" +
                "<td>" + translateLanguage(key) + "</td>" +
                "<td>" + translateRawData(key, categoryKey) + "</td>" +
                "<td>" + array.length + "</td>" +
                "</tr>"
            );
        })
    });

    console.log($table);

    $table.appendTo($contentContainer);
}

/***************************************************
 *
 * Data and Conversion Stuff
 *
 ***************************************************/
// TODO turn filters into filter object
function convertToStats(data, filters) {
    var statistics = {};
    $.each(data, function(indexInArray, obj) {
        $.each(obj, function (key, value) {
            for (var i = 0; i < filters.length; i++) {
                // check if key for information of object matches a filter
                // if filter doesn't fit, look at next filters
                if (filters !== undefined && (key.toString() !== filters[i] || key.toString() === "ID")) continue;

                // initialize object
                if (statistics[key] === undefined) {
                    statistics[key] = {};
                }
                // initialize object value
                if (statistics[key][value] === undefined) {
                    statistics[key][value] = [];
                }
                statistics[key][value].push(obj);
            }
        });
    });
    console.log("Converted stats", statistics, "; Filters", filters);
    return statistics;
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

/***************************************************
 *
 * English Translation Stuff
 * - >:( Why do I even have to do this, can't we use an english data set next time?
 * - TODO could instead just use something like dictionaries like in c#?
 *
 ***************************************************/
function translateRawData (tag, categoryKey) {
    var translation;
    var translationObject;
    switch (tag) {
        case "Geslacht":
            translationObject = genderTranslations;
            break;
        case "Leeftijd":
            translationObject = ageTranslations;
            break;
        case "Herkomstgroeperingen":
            translationObject = originTranslations;
            break;
        case "Perioden":
            translationObject = periodTranslations;
            break;
        default: return categoryKey;
    }


    switch(translationObject[categoryKey].Title) {
        // Gender
        case "Totaal mannen en vrouwen": return"Total men and women";
        case "Mannen": return"Men";
        case "Vrouwen": return"Women";

        // Age
        case "Totaal Halt-jongeren": return"Total HALT-youth";
        case "Overig of onbekend": return"Other or unknown";

        // Origin
        case "Totaal herkomstgroepering": return"Total origin grouping";
        case "Allochtoon": return"Immigrant";
        case "Niet-westerse allochtoon": return"Non-western immigrant";
        case "Westerse allochtoon": return"Western immigrant";
        case "(Voormalige) Ned. Antillen en Aruba": return"(Former) Ned. Antilles and Aruba";
        case "Overig niet-westerse allochtoon": return"Other non-western immigrants";
        case "Autochtoon": return"Native";
        case "Turkije": return"Turkish";
        case "Onbekend": return"Unknown";

        default:
            // If by default no translation is needed/present, try to use the translation objects default value
            translation = translationObject[categoryKey].Title;

            // Age - replace (case insensitive) the untranslated "jaar" with "year"
            return translation.replace(/jaar/gi, "year");
    }
}

function translateLanguage(json_key) {

    switch(json_key) {
        case "ID": return "ID";
        case "Geslacht": return "Gender";
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

/***************************************************
 *
 * API Stuff
 * ----------
 * @function loadAPIData()
 * - resets the raw data variables to discern if loading has been finished
 *  and starts all need api calls (ajax calls with jquery method)
 *
 * ----------
 * @function loadTypedDataSet()
 * - tries to populate the variable 'typedDataSet' with JSON returned by request
 * - MAIN DATA NECESSARY FOR INFO GRAPHIC
 *
 * ----------
 * @function loadGenderTranslation(),
 * @function loadAgeTranslations(),
 * @function loadOriginTranslations(),
 * @function loadPeriodTranslations()
 * - try to populate the corresponding translation variables with JSON returned by requests
 * - data is used to try and make sense of some values used in the 'typedDataSet' variable
 *
 *
 * ----------
 * @async_functions
 * - after finishing their requests, they kick off 'updateStatDisplay(typedDataArray)'
 *  which checks if all data has been loaded and updates the displayed stats accordingly
 *
 ***************************************************/
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

function isDataLoaded() {
    return typedDataArray !== undefined
        && genderTranslations !== undefined
        && ageTranslations !== undefined
        && originTranslations !== undefined
        && periodTranslations !== undefined;

}

function loadTypedDataSet() {
    // Look at "http://api.jquery.com/jquery.getjson/#jqxhr-object" for more information about the return type
    var jqxhr = $.getJSON(API_URL + TYPED_DATASET, function (data) {
        typedDataArray = fixJSONKey(data.value, "ID");
        console.log("typedDataArray", typedDataArray);

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

function loadPeriodTranslations() {
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