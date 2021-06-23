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

async function LoadChart() {
    var data = await loadData();
    var hcKey = await loadHC();
    var listLabels = data.map((item) => getHcName(item["hc-key"], hcKey));
    var listTotal = data.map((item) => item["value"]);
    // Skip 18 provinces
    // for (var i = 0; i < 18; i++) {
    //     listLabels.shift();
    //     listTotal.shift();
    // }
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: listLabels,
            datasets: [{
                label: 'Tổng số ca',
                data: listTotal,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Run
loadTable();
LoadChart();