const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');
const resetButton = document.getElementById('resetButton');
const undoButton = document.getElementById('undoButton');

let isDrawing = false;
let hue = 0;
const drawnLines = []; // Store the drawn lines here

canvas.width = 800;
canvas.height = 600;
context.lineJoin = 'round';
context.lineCap = 'round';

function startDrawing(e) {
    isDrawing = true;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    drawnLines.push([{ x, y }]); // Start a new line

    hue = hue >= 360 ? 0 : hue + 1;
    context.strokeStyle = colorPicker.value;
    context.lineWidth = sizeSlider.value;
    context.beginPath();
    context.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    context.lineTo(x, y);
    context.stroke();

    // Update the current line's ending point
    drawnLines[drawnLines.length - 1].push({ x, y });
}

function stopDrawing() {
    isDrawing = false;
}

function undo() {
    if (drawnLines.length > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawnLines.pop(); // Remove the last line
        redrawLines();
    }
}

function redrawLines() {
    drawnLines.forEach(line => {
        context.strokeStyle = colorPicker.value;
        context.lineWidth = sizeSlider.value;
        context.beginPath();
        context.moveTo(line[0].x, line[0].y);
        for (let i = 1; i < line.length; i++) {
            context.lineTo(line[i].x, line[i].y);
        }
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
