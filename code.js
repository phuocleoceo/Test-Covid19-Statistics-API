async function loadData() {
    const response = await fetch('https://api.apify.com/v2/key-value-stores/ZsOpZgeg7dFS1rgfM/records/LATEST');
    const responseJSON = await response.json();
    const data = responseJSON.detail;
    return data;
}

async function loadHC() {
    const response = await fetch('https://api.apify.com/v2/key-value-stores/p3nS2Q9TUn6kUOriJ/records/LATEST');
    const responseJSON = await response.json();
    const data = responseJSON.key;
    return data;
}

//Make first letter or a word Uppercase
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// aaa-bbb => Aaa Bbb
function formatName(name) {
    var a = name.split("-");
    var result = "";
    for (var i = 0; i < a.length; i++) {
        result += capitalizeFirstLetter(a[i]) + " ";
    }
    return result;
}
// Get name by hc-key
function getHcName(key, hcKey) {
    for (var i = 0; i < hcKey.length; i++) {
        if (hcKey[i]["hec-key"] === key) {
            return formatName(hcKey[i]["name"]);
        }
    }
}
async function loadTable() {
    var data = await loadData();
    var hcKey = await loadHC();

    var temp = "";
    data.forEach((itemData) => {
        temp += "<tr>";
        temp += "<td>" + getHcName(itemData["hc-key"], hcKey) + "</td>";
        temp += "<td>" + itemData.socakhoi + "</td>";
        temp += "<td>" + itemData.socadangdieutri + "</td>";
        temp += "<td>" + itemData.socatuvong + "</td>";
        temp += "<td>" + itemData.value + "</td></tr>";
    });
    document.getElementById('datatable').innerHTML = temp;
}
loadTable();