var $container;

$(document).ready(function(){
    $conatiner = $("#content");

    $.ajax({
        url: "https://opendata.cbs.nl/ODataApi/odata/71930ned/TypedDataSet",
        method: "GET",
        dataType: "JSON",
        success: function (data, textStatus, jqXHR) {
            showData(data, textStatus, jqXHR);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showError(jqXHR, textStatus, errorThrown);
        },
        timeout: 3000
    });
});

function showData(data, textStatus, jqXHR) {
    console.log("Data retrieval was successful!");
    console.log("Data:", data);
    console.log("Text Status:", textStatus);
    console.log("jqXHR:", jqXHR);

}

function showError(jqXHR, textStatus, errorThrown) {
    console.log("An error occurred.");
    console.log("jqXHR:", jqXHR);
    console.log("Text Status:", textStatus);
    console.log("Error Thrown:", errorThrown);
}
