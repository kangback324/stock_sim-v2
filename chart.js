const container = document.getElementById("chartContainer");
const canvas = document.getElementById("candleChart");
const ctx = canvas.getContext("2d");

let apiUrl = "http://localhost:3000/stock/futures-pricelog/1";
// let apiUrl = "http://localhost:3000/stock/stock-pricelog/1";

let chartData = [];
let candleWidth = 10;
let candleSpacing = 5;
const padding = 60;

// 줌 및 드래그 관련 변수
let scale = 1; // 기본 확대/축소 비율
let offsetX = 0; // 드래그에 따른 x축 오프셋
let isDragging = false; // 드래그 상태
let startDragX = 0;

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
            
            document.getElementById('create_before').innerText = (((result.data[result.data.length - 1].close - result.data[0].open) / result.data[0].open) * 100).toFixed(1);
            document.getElementById('bong_before').innerText = (((result.data[result.data.length - 1].close - result.data[result.data.length - 2].close) / result.data[result.data.length - 2].close) * 100).toFixed(1);
            document.getElementById('price').innerText = result.data[result.data.length - 1].close;

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
    const canvasWidth = totalCandles * (candleWidth + candleSpacing) * scale + padding * 2;

    canvas.width = canvasWidth; // 캔버스 너비 동적 설정
    canvas.height = container.offsetHeight; // 높이는 container 크기에 맞춤
}

// 단위 계산 함수
function calculateUnit(range) {
    if (range > 100000) return 10000;
    if (range > 10000) return 1000;
    if (range > 1000) return 100;
    if (range > 100) return 10;
    return 1;
}

// 캔들차트 그리기
function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    const maxPrice = Math.max(...chartData.flatMap(d => [d.high])) * 1.1;
    const minPrice = Math.min(...chartData.flatMap(d => [d.low])) * 0.9;

    const range = maxPrice - minPrice;
    const scaleY = value => chartHeight * (1 - (value - minPrice) / range) + padding;

    // Y축 그리기
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();

    const steps = 10;
    const unit = range / steps;

    for (let i = 0; i <= steps; i++) {
        const price = minPrice + unit * i;
        const y = scaleY(price);

        ctx.fillStyle = "black";
        ctx.textAlign = "right";
        ctx.fillText(`${Math.round(price).toLocaleString()}원`, padding - 10, y + 5);

        ctx.beginPath();
        ctx.strokeStyle = "#e0e0e0";
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }

    // 최고가와 최저가 계산
    const highestPoint = chartData.reduce((max, data) => (data.high > max.high ? data : max), chartData[0]);
    const lowestPoint = chartData.reduce((min, data) => (data.low < min.low ? data : min), chartData[0]);

    ctx.save();
    ctx.translate(offsetX, 0); // 드래그에 따른 X축 이동

    chartData.forEach((data, index) => {
        const x = padding + index * (candleWidth + candleSpacing) * scale + candleWidth / 2;
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
            x - (candleWidth / 2) * scale,
            Math.min(yOpen, yClose),
            candleWidth * scale,
            bodyHeight
        );

        // 신고가 표시
        if (data === highestPoint) {
            ctx.fillStyle = "green";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(
                `🔺 ${Math.round(data.high).toLocaleString()}원 (${data.minute})`,
                x,
                yHigh - 10
            );
        }

        // 신저가 표시
        if (data === lowestPoint) {
            ctx.fillStyle = "blue";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(
                `🔻 ${Math.round(data.low).toLocaleString()}원 (${data.minute})`,
                x,
                yLow + 20
            );
        }
    });

    ctx.restore();
}

// 줌 이벤트 처리
canvas.addEventListener("wheel", event => {
    event.preventDefault();
    const zoomFactor = 1.1;

    if (event.deltaY < 0) {
        scale *= zoomFactor; // 확대
    } else {
        scale /= zoomFactor; // 축소
    }
    scale = Math.max(0.5, Math.min(scale, 10)); // 스케일 범위 제한

    updateCanvasSize();
    drawChart();
});

// 드래그 이벤트 처리
canvas.addEventListener("mousedown", event => {
    isDragging = true;
    startDragX = event.clientX - offsetX;
});

canvas.addEventListener("mousemove", event => {
    if (isDragging) {
        offsetX = event.clientX - startDragX;
        drawChart();
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
    isDragging = false;
});

// 1초마다 데이터 업데이트
setInterval(fetchData, 100);

// 초기 데이터 로드
fetchData();
