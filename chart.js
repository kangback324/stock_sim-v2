const container = document.getElementById("chartContainer");
const canvas = document.getElementById("candleChart");
const ctx = canvas.getContext("2d");

const apiUrl = "http://localhost:3000/stock/stock-pricelog/2";

let chartData = [];
let candleWidth = 10; // 초기 캔들 바디 너비
let candleSpacing = 5; // 초기 캔들 간 간격
const padding = 60; // 차트의 상하좌우 여백

// 서버에서 데이터 가져오기
async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (response.ok) {
            chartData = result.data.map(item => ({
                minute: item.minute,
                low: item.low,
                high: item.high,
                open: parseInt(item.open),
                close: parseInt(item.close)
            }));
            updateCanvasSize();
            drawChart();
        } else {
            console.error("Failed to fetch data:", result);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// 캔버스 크기 업데이트
function updateCanvasSize() {
    const totalCandles = chartData.length;
    const canvasWidth = totalCandles * (candleWidth + candleSpacing) + padding * 2;

    canvas.width = canvasWidth; // 캔버스 너비 동적 설정
    canvas.height = container.offsetHeight; // 높이는 container 크기에 맞춤
}

// 캔들차트 그리기
function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    const maxPrice = Math.max(...chartData.flatMap(d => [d.high]));
    const minPrice = Math.min(...chartData.flatMap(d => [d.low]));

    // Y축 스케일링 함수
    const scaleY = value => chartHeight * (1 - (value - minPrice) / (maxPrice - minPrice)) + padding;

    // Y축 그리기
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();

    // Y축 가격 라벨 추가
    const priceStep = (maxPrice - minPrice) / 5;
    for (let i = 0; i <= 5; i++) {
        const price = minPrice + priceStep * i;
        const y = scaleY(price);
        ctx.fillStyle = "black";
        ctx.textAlign = "right";
        ctx.fillText(price.toFixed(0), padding - 10, y + 5);

        // 보조선
        ctx.beginPath();
        ctx.strokeStyle = "#e0e0e0";
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }

    // 신고가와 신저가 추출
    const highestPoint = chartData.find(data => data.high === maxPrice);
    const lowestPoint = chartData.find(data => data.low === minPrice);

    // 데이터 그리기
    chartData.forEach((data, index) => {
        const x = padding + index * (candleWidth + candleSpacing) + candleWidth / 2;
        const yHigh = scaleY(data.high);
        const yLow = scaleY(data.low);
        const yOpen = scaleY(data.open);
        const yClose = scaleY(data.close);

        // 고가와 저가 라인
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 캔들 바디
        const bodyHeight = Math.abs(yOpen - yClose);
        const isUp = data.close > data.open;
        ctx.fillStyle = isUp ? "red" : "blue";
        ctx.fillRect(
            x - candleWidth / 2,
            Math.min(yOpen, yClose),
            candleWidth,
            bodyHeight
        );
    });

    // 신고가와 신저가 라벨 추가
    if (highestPoint) {
        const x = padding + chartData.indexOf(highestPoint) * (candleWidth + candleSpacing) + candleWidth / 2;
        const yHigh = scaleY(highestPoint.high);
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`High: ${highestPoint.minute}`, x, yHigh - 10);
    }

    if (lowestPoint) {
        const x = padding + chartData.indexOf(lowestPoint) * (candleWidth + candleSpacing) + candleWidth / 2;
        const yLow = scaleY(lowestPoint.low);
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Low: ${lowestPoint.minute}`, x, yLow + 20);
    }
}

// 캔들 크기 조절
function adjustCandleSize(size) {
    candleWidth = size;
    candleSpacing = Math.max(size / 2, 5); // 간격은 너비의 절반 이상 유지
    updateCanvasSize();
    drawChart();
}

// 1초마다 데이터 업데이트
setInterval(fetchData, 500);

// 초기 데이터 로드
fetchData();
