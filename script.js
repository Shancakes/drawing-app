const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');
const resetButton = document.getElementById('resetButton');
const undoButton = document.getElementById('undoButton');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
const drawnLines = [];

canvas.width = 800;
canvas.height = 600;
context.lineJoin = 'round';
context.lineCap = 'round';

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];
    hue = hue >= 360 ? 0 : hue + 1;
    context.strokeStyle = colorPicker.value;
    context.lineWidth = sizeSlider.value;
}

function draw(e) {
    if (!isDrawing) return;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();

    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        drawnLines.push([{ x: lastX, y: lastY }, { x: lastX, y: lastY }]);
    }
}

function undo() {
    if (drawnLines.length > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawnLines.pop();
        redrawLines();
    }
}

function redrawLines() {
    drawnLines.forEach(line => {
        context.beginPath();
        context.moveTo(line[0].x, line[0].y);
        context.lineTo(line[1].x, line[1].y);
        context.stroke();
    });
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

colorPicker.addEventListener('input', () => {
    context.strokeStyle = colorPicker.value;
});

sizeSlider.addEventListener('input', () => {
    context.lineWidth = sizeSlider.value;
});

resetButton.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawnLines.length = 0;
});

undoButton.addEventListener('click', undo);
