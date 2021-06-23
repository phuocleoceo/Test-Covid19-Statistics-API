async function loadData() {
    const response = await fetch('https://api.apify.com/v2/key-value-stores/ZsOpZgeg7dFS1rgfM/records/LATEST');
    const responseJSON = await response.json();
    return responseJSON;
}

async function loadHC() {
    const response = await fetch('https://api.apify.com/v2/key-value-stores/p3nS2Q9TUn6kUOriJ/records/LATEST');
    const responseJSON = await response.json();
    const data = responseJSON.key;
    return data;
}

async function loadTenDays() {
    const response = await fetch('https://api.apify.com/v2/key-value-stores/Tksmptn5O41eHrT4d/records/LATEST');
    const responseJSON = await response.json();
    const { canhiem, catuvong } = responseJSON;
    let tenDays = [];
    for (let i = 0; i < canhiem.length; i++) {
        tenDays.unshift({
            ngay: canhiem[i].day,
            socanhiem: canhiem[i].quantity,
            socatuvong: catuvong[i].quantity
        });
    }
    return tenDays;
}

//Make first letter or a word Uppercase
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// aaa-bbb => Aaa Bbb
function formatName(name) {
    let a = name.split("-");
    let result = "";
    for (let i = 0; i < a.length; i++) {
        result += capitalizeFirstLetter(a[i]) + " ";
    }
    return result;
}
// Get name by hc-key
function getHcName(key, hcKey) {
    for (let i = 0; i < hcKey.length; i++) {
        if (hcKey[i]["hec-key"] === key) {
            return formatName(hcKey[i]["name"]);
        }
    }
}

function loadTable(data, hcKey) {
    let temp = "";
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

function loadTenDaysTable(data) {
    let temp = "";
    data.forEach((itemData) => {
        temp += "<tr>";
        temp += "<td>" + itemData.ngay + "</td>";
        temp += "<td>" + itemData.socanhiem + "</td>";
        temp += "<td>" + itemData.socatuvong + "</td></tr>";
    });
    document.getElementById('tenDays').innerHTML = temp;
}

function loadTotal(infected, treated, recovered, deceased) {
    let temp = "";
    temp += "<tr>";
    temp += "<td>" + recovered + "</td>";
    temp += "<td>" + treated + "</td>";
    temp += "<td>" + deceased + "</td>";
    temp += "<td>" + infected + "</td></tr>";
    document.getElementById('total').innerHTML = temp;
}

function LoadChart(data, hcKey) {
    let listLabels = data.map((item) => getHcName(item["hc-key"], hcKey));
    let listTotal = data.map((item) => item["value"]);
    // listLabels = listLabels.slice(start, end);
    // listTotal = listTotal.slice(start, end);
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
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

async function Render() {
    let { detail, infected, treated, recovered, deceased } = await loadData();
    let hcKey = await loadHC();
    let tenDays = await loadTenDays();
    loadTable(detail, hcKey);
    loadTotal(infected, treated, recovered, deceased);
    LoadChart(detail, hcKey);
    loadTenDaysTable(tenDays);
}

Render();