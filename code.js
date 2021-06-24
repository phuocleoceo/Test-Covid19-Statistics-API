async function loadPerProvince() {
    const response = await fetch('https://api.apify.com/v2/key-value-stores/ZsOpZgeg7dFS1rgfM/records/LATEST');
    const responseJSON = await response.json();
    return responseJSON;
}

async function loadHcKey() {
    const response = await fetch('https://api.apify.com/v2/key-value-stores/p3nS2Q9TUn6kUOriJ/records/LATEST');
    const responseJSON = await response.json();
    const data = responseJSON.key;
    return data;
}

async function loadTenDays() {
    const response = await fetch('https://api.apify.com/v2/key-value-stores/Tksmptn5O41eHrT4d/records/LATEST');
    const responseJSON = await response.json();
    const { canhiem, cakhoi, catuvong } = responseJSON;
    let tenDays = [];
    for (let i = 0; i < canhiem.length; i++) {
        tenDays.unshift({
            ngay: canhiem[i].day,
            socanhiem: canhiem[i].quantity,
            socakhoi: cakhoi[i].quantity,
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

function loadProvinceTable(data, hcKey) {
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
        temp += "<td>" + itemData.socakhoi + "</td>";
        temp += "<td>" + itemData.socatuvong + "</td></tr>";
    });
    document.getElementById('tenDays').innerHTML = temp;
}

function loadTotalTable(infected, treated, recovered, deceased) {
    let temp = "";
    temp += "<tr>";
    temp += "<td>" + recovered + "</td>";
    temp += "<td>" + treated + "</td>";
    temp += "<td>" + deceased + "</td>";
    temp += "<td>" + infected + "</td></tr>";
    document.getElementById('total').innerHTML = temp;
}

function loadProvinceChart(data, hcKey) {
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

function loadPercentTotalCase(infected, treated, recovered, deceased) {
    let ctx = document.getElementById('percentTotalCase').getContext('2d');
    let percent = [];
    percent.push(treated / infected * 100);
    percent.push(recovered / infected * 100);
    percent.push(deceased / infected * 100);
    let data = {
        labels: [
            'Ca nhiễm',
            'Ca khỏi',
            'Ca tử vong'
        ],
        datasets: [{
            label: 'Tỉ lệ số ca',
            data: percent,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    };
    let pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: { responsive: false, }
    });
}

function loadTenDaysInfectedChart(tenDays) {
    let ctx = document.getElementById('tenDaysInfectedChart').getContext('2d');
    let labels = tenDays.map((item) => item.ngay).reverse();
    let infected = tenDays.map((item) => item.socanhiem).reverse();
    let data = {
        labels: labels,
        datasets: [{
            label: 'Số ca nhiễm mới',
            data: infected,
            fill: false,
            borderColor: 'rgb(255, 0, 0)',
            tension: 0.1
        }]
    };
    let stackedLine = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    stacked: true
                }
            }
        }
    });
}

function loadTenDaysRecoveredChart(tenDays) {
    let ctx = document.getElementById('tenDaysRecoveredChart').getContext('2d');
    let labels = tenDays.map((item) => item.ngay).reverse();
    let infected = tenDays.map((item) => item.socakhoi).reverse();
    let data = {
        labels: labels,
        datasets: [{
            label: 'Số ca khỏi mới',
            data: infected,
            fill: false,
            borderColor: 'rgb(0, 204, 0)',
            tension: 0.1
        }]
    };
    let stackedLine = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    stacked: true
                }
            }
        }
    });
}

function loadTenDaysDeceasedChart(tenDays) {
    let ctx = document.getElementById('tenDaysDeceasedChart').getContext('2d');
    let labels = tenDays.map((item) => item.ngay).reverse();
    let infected = tenDays.map((item) => item.socatuvong).reverse();
    let data = {
        labels: labels,
        datasets: [{
            label: 'Số ca tử vong mới',
            data: infected,
            fill: false,
            borderColor: 'rgb(102, 153, 153)',
            tension: 0.1
        }]
    };
    let stackedLine = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    stacked: true
                }
            }
        }
    });
}

async function Render() {
    let { detail, infected, treated, recovered, deceased } = await loadPerProvince();
    let hcKey = await loadHcKey();
    let tenDays = await loadTenDays();
    loadProvinceTable(detail, hcKey);
    loadTotalTable(infected, treated, recovered, deceased);
    loadPercentTotalCase(infected, treated, recovered, deceased);
    loadTenDaysTable(tenDays);
    loadTenDaysInfectedChart(tenDays);
    loadTenDaysRecoveredChart(tenDays);
    loadTenDaysDeceasedChart(tenDays);
    loadProvinceChart(detail, hcKey);
}

Render();