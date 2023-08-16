// Get references to HTML elements
const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');
const resetButton = document.getElementById('resetButton');
const undoButton = document.getElementById('undoButton');

// Variables to track drawing state and color hue
let isDrawing = false;
let hue = 0;

// Array to store drawn lines
const drawnLines = [];

// Set initial canvas properties
canvas.width = 800;
canvas.height = 600;
context.lineJoin = 'round';
context.lineCap = 'round';

// Function to start drawing
function startDrawing(e) {
    isDrawing = true;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    // Start a new line with the current color, line width, and starting point
    drawnLines.push({
        color: colorPicker.value,
        lineWidth: sizeSlider.value,
        points: [{ x, y }]
    });

    // Update hue and drawing style
    hue = hue >= 360 ? 0 : hue + 1;
    context.strokeStyle = colorPicker.value;
    context.lineWidth = sizeSlider.value;
    context.beginPath();
    context.moveTo(x, y);
}

// Function to draw as the mouse moves
function draw(e) {
    if (!isDrawing) return;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    // Draw line segment
    context.lineTo(x, y);
    context.stroke();

    // Update the current line's points
    drawnLines[drawnLines.length - 1].points.push({ x, y });
}

// Function to stop drawing
function stopDrawing() {
    isDrawing = false;
}

// Function to undo the last drawn line
function undo() {
    if (drawnLines.length > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawnLines.pop(); // Remove the last line
        redrawLines();
    }
}

// Function to redraw all lines stored in drawnLines
function redrawLines() {
    drawnLines.forEach(line => {
        context.strokeStyle = line.color;
        context.lineWidth = line.lineWidth; // Set line width
        context.beginPath();
        context.moveTo(line.points[0].x, line.points[0].y);
        for (let i = 1; i < line.points.length; i++) {
            context.lineTo(line.points[i].x, line.points[i].y);
        }
        context.stroke();
    });
}

// Event listeners for drawing and controls

// Start drawing when mouse is pressed
canvas.addEventListener('mousedown', startDrawing);
// Draw as mouse moves
canvas.addEventListener('mousemove', draw);
// Stop drawing when mouse is released
canvas.addEventListener('mouseup', stopDrawing);
// Stop drawing when mouse leaves canvas
canvas.addEventListener('mouseout', stopDrawing);

// Change drawing color based on color picker value
colorPicker.addEventListener('input', () => {
    context.strokeStyle = colorPicker.value;
});

// Change drawing size based on size slider value
sizeSlider.addEventListener('input', () => {
    context.lineWidth = sizeSlider.value;
});

// Clear canvas and reset drawnLines array
resetButton.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawnLines.length = 0;
});

// Undo the last drawn line
undoButton.addEventListener('click', undo);
