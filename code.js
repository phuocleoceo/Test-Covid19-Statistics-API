const province_api = 'https://api.apify.com/v2/key-value-stores/ZsOpZgeg7dFS1rgfM/records/LATEST';
const tenDays_api = 'https://api.apify.com/v2/key-value-stores/Tksmptn5O41eHrT4d/records/LATEST';

async function loadPerProvince() {
    const response = await fetch(province_api);
    const responseJSON = await response.json();
    return responseJSON;
}

async function loadTenDays() {
    const response = await fetch(tenDays_api);
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


function loadProvinceTable(data) {
    let temp = "";
    data.forEach((item) => {
        temp += "<tr>";
        temp += "<td>" + item.name + "</td>";
        temp += "<td>" + item.recovered + "</td>";
        temp += "<td>" + item.treating + "</td>";
        temp += "<td>" + item.death + "</td>";
        temp += "<td>" + item.casesToday + "</td></tr>";
    });
    document.getElementById('datatable').innerHTML = temp;
}

function loadTenDaysTable(data) {
    let temp = "";
    data.forEach((item) => {
        temp += "<tr>";
        temp += "<td>" + item.ngay + "</td>";
        temp += "<td>" + item.socanhiem + "</td>";
        temp += "<td>" + item.socakhoi + "</td>";
        temp += "<td>" + item.socatuvong + "</td></tr>";
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

function loadProvinceChart(data) {
    let listLabels = data.map((item) => item.name);
    let listTotal = data.map((item) => item.casesToday);
    // listLabels = listLabels.slice(start, end);
    // listTotal = listTotal.slice(start, end);
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: listLabels,
            datasets: [{
                label: 'Số ca hôm nay',
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
            label: 'Tỉ lệ phần trăm số ca',
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
        options: {
            responsive: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Tỉ lệ phần trăm số ca',
                }
            }
        }
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
    let tenDays = await loadTenDays();
    loadProvinceTable(detail);
    loadTotalTable(infected, treated, recovered, deceased);
    loadPercentTotalCase(infected, treated, recovered, deceased);
    loadTenDaysTable(tenDays);
    loadTenDaysInfectedChart(tenDays);
    loadTenDaysRecoveredChart(tenDays);
    loadTenDaysDeceasedChart(tenDays);
    loadProvinceChart(detail);
}

Render();