/*
 * Author: Logan Stanfield
 * Date: 02/18/18
 * Version: 0.2.0
 *
 * This class contains the universe object contents such as the grid and the
 * event listeners. Other button functions and drawing will also occur here.
 */

class Universe {
    constructor(canvas, gl, gridSize) {
        this.canvas = canvas;
        this.gl = gl;
        this.grid = new PixelGrid(canvas, gl, gridSize);
        this.drawingMode = "NONE";
        // Radio buttons.
        this.rbPixel;
        this.rbLine;
        this.rbCircle;
        Universe.initListeners(this);
    }

    static initListeners(universe){
        window.onload = function() {
            // Instantiate the radio buttons.
            this.rbPixel = document.getElementById("draw_pixel_button");
            this.rbPixel.checked = true;
            this.rbLine = document.getElementById("draw_line_button");
            this.rbCircle = document.getElementById("draw_circle_button");
            var button = document.getElementById("clear_button");
            // Set the clear button to the clearButtonPressed function.
            button.onclick = function(event) {
                universe.clearButtonPressed();
            }
        }

        window.onclick = function(event){
            universe.onMouseClick(event);
        }

        window.onmousemove = function(event) {
            universe.onMouseMove(event);
        }
    }

    drawGrid() {
        this.grid.drawGrid();
    }

    onMouseClick(event) {
        event = event || window.event;

        if (rbPixel.checked == true) {
            this.drawingMode = "PIXEL";
        } else if (rbLine.checked == true) {
            this.drawingMode = "LINE";
        } else if (rbCircle.checked == true) {
            this.drawingMode = "CIRCLE";
        } else {
            console.log("No radio button was checked.");
        }

        // Take in the pixel coordinates from the document and convert to WebGL coordinates.
        var rectBound = gl.canvas.getBoundingClientRect();
        var glX = (event.clientX - rectBound.left) / canvas.width *  2 - 1;
        var glY = (event.clientY - rectBound.top) / canvas.height * -2 + 1;

        // Get the grid coordinates from the WebGL coordinates.
        var gridCoordinates = this.grid.convertGLToGridCoordinates(glX, glY);

        // Get the WebGL coordinates.
        var glCoordinates = this.grid.convertGridToGLCoordinates(gridCoordinates[0], gridCoordinates[1]);
        gridCoordinates = this.grid.convertGLToGridCoordinates(glCoordinates[0], glCoordinates[1]);

        var gridX = gridCoordinates[0];
        var gridY = gridCoordinates[1];

        // Get pixel coordinates for boundry requirements.
        var pageX = event.clientX - rectBound.left;
        var pageY = event.clientY - rectBound.top;

        if (pageX > canvas.width
            || pageY > canvas.height
            || pageX < rectBound.left
            || pageY < rectBound.top
        ) {
            console.log("Cursor outside of canvas.")
        } else {
            switch (this.drawingMode) {
                case "PIXEL":
                    // Draw pixel.
                    console.log("PIXEL");
                    this.grid.drawPixel(gridX, gridY);
                    break;
                case "LINE":
                    // Draw line:
                    this.grid.drawLine(gridX, gridY);
                    break;
                case "CIRCLE":
                    // Draw circle:
                    this.grid.drawCircle(gridX, gridY);
                    break;
                default:
                    console.log("Somehting needs to be checked.");
            }
        }
    }

    onMouseMove(event) {
        var pageX, pageY;

        event = event || window.event;
        pageX = event.clientX - 8;
        pageY = event.clientY - 8;

        var rectBound = gl.canvas.getBoundingClientRect();

        if (pageX > canvas.width
            || pageY > canvas.height
            || pageX < rectBound.left
            || pageY < rectBound.top
        ) {
            console.log("Cursor is outside of the canvas.");
        } else {
            // Convert to WebGL coordinates.
            pageX = pageX / gl.canvas.width * 2 - 1;
            pageY = pageY / gl.canvas.width * -2 + 1;
            // console.log("X: " + pageX + " Y: " + pageY);
        }
    }

    clearButtonPressed(event) {
        this.gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        this.drawGrid();
        this.grid.resetGrid();
    }
}
