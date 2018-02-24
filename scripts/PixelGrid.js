/*
 * Author: Logan Stanfield
 * Date: 02/18/18
 * Version: 0.2.0
 *
 * This class contains the simulated pixel grid object. It is used to simulate
 * a raster display on a monitor. Here you can draw a pixel to the grid which
 * is snapped to the correct place on the grid.
 */

class PixelGrid {
    constructor(canvas, gl, gridSize) {
        this._canvas = canvas;
        this._gl = gl;
        this._gridSize = gridSize;
        this._selectedPixels = [];
    }

    get gridSize() {
        return this._gridSize;
    }

    get selectedPixels() {
        return this._selectedPixels;
    }

    drawGrid() {

        // Make the color of the grid lines less bright.
        var lineColor = [0.5, 0.5, 0.5, 1.0];

        var x_value = -1.0;
        var y_value = 1.0;

        var vertices =
        [
            -1.0, y_value, 0.0,
            1.0, y_value, 0.0
        ]

        for (var i = 0; i <= this.gridSize; i ++) {
            vertices =
            [
                -1.0, y_value, 0.0,
                1.0, y_value, 0.0
            ]
            y_value = y_value - (1 / (this.gridSize / 2));

            // Draws the horizontal lines.
            Drawing.drawLine(canvas, gl, vertices, lineColor);

            vertices =
            [
                x_value, -1.0, 0.0,
                x_value, 1.0, 0.0
            ]
            x_value = x_value + (1 / (this.gridSize / 2));

            // console.log("X: " + x_value + " Y: " + y_value);

            // Draws the vertical lines.
            Drawing.drawLine(canvas, gl, vertices, lineColor);
        }

        // Draw the axis
        var vertices =
        [
            0.0, 1.0, 0.0,
            0.0, -1.0, 0.0
        ]

        var axisColor = [0.0, 0.0, 0.0, 1.0];
        // Y-AXIS drawing
        Drawing.drawLine(canvas, gl, vertices, axisColor);

        vertices =
        [
            -1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        ]
        Drawing.drawLine(canvas, gl, vertices, axisColor);
    }

    drawPixel(gridX, gridY) {

        gridX = Math.round(gridX);
        gridY = Math.round(gridY);

        var glCoordinates = this.convertGridToGLCoordinates(gridX, gridY);
        var glX = glCoordinates[0];
        var glY = glCoordinates[1];

        // Set the color of the drawn simulated pixel.
        var quadColor = [0.20, 0.20, 0.20, 1.0];

        // Convert pixel size to WebGL coordinates.
        var pixelSize = 2.0 / this._gridSize;

        var vertices =
        [
            glX, glY, 0.0,
            glX, glY - pixelSize, 0.0,
            glX + pixelSize, glY - pixelSize, 0.0,
            glX + pixelSize, glY, 0.0
        ];

        Drawing.drawQuad(canvas, gl, vertices, quadColor);
    }

    /*
     * point1 -> (x_1, y_1)
     * point2 -> (x_2), y_2)
     */
    drawLine(gridX, gridY) {
        console.log("Drawing line...");

        this._selectedPixels.push(gridX);
        this._selectedPixels.push(gridY);

        // If all x's and y's are not added to the array then return.
        if (this._selectedPixels.length < 4) {
            this.drawPixel(gridX, gridY);
            // return if only one pixel has been selected.
            return;
        }

        var x0 = this._selectedPixels[0];
        var y0 = this._selectedPixels[1];
        var x1 = this._selectedPixels[2];
        var y1 = this._selectedPixels[3];

        // Calculate dx and dy by the endpoints of the line.
        var dx = x1 - x0;
        var dy = y1 - y0;

        // calculate the number of steps required for generating pixels.
        var steps = 1;

        if (Math.abs(dx) > Math.abs(dy)) {
            steps = Math.abs(dx);
        } else {
            steps = Math.abs(dy);
        }

        // calculate the increment in x and y for each step.
        var incX = dx / steps;
        var incY = dy / steps;

        // console.log("dxY: " + dx + " " + dy);
        // console.log("steps: " + steps);
        // console.log("XINCY: " + incX + " " + incY);

        // Color a pixel for each step.
        var x = x0;
        var y = y0;

        this.drawPixel(x0, y0);
        for (var i = 0; i <= steps; i++) {
            console.log("XY: " + x + " " + y);
            this.drawPixel(x, y);
            x += incX;
            y += incY;
        }

        this._selectedPixels = [];
    }

    resetGrid() {
        this._selectedPixels = [];
    }

    drawCircle(gridX, gridY) {

        // Find the radius.
        var radius = Math.sqrt(Math.pow(gridX, 2) + Math.pow(gridY, 2));
        console.log("Drawing circle...");
        console.log("RADIUS: " + radius);

        var x = 0;
        var y = radius;
        var d = 5 / 4 - radius;

        this.drawPixel(x,y);
        this.drawPixel(-y,x);
        this.drawPixel(x,-y);
        this.drawPixel(y,-x);
        while (y > x) {
            if (d < 0) {
                d = d + 2 * x + 3;
                x = x + 1;
            } else {
                d = d + 2 * x - 2 * y + 5;
                x = x + 1;
                y = y - 1;
            }
            this.drawPixel(x,y);
            this.drawPixel(-x,y);
            this.drawPixel(-y,x);
            this.drawPixel(-y,-x);
            this.drawPixel(-x,-y);
            this.drawPixel(x,-y);
            this.drawPixel(y,-x);
            this.drawPixel(y,x);
        }
    }

    convertGLToGridCoordinates(glX, glY) {
        // =========== CONVERT TO GRID COORDINATES =============== //

        var pixelSize = canvas.width / this._gridSize;

        // m is the number of rows.
        var m = canvas.height / pixelSize;
        // n is the number of columns.
        var n = canvas.width / pixelSize;

        // Number of columns in a quadrant.
        var qX = m / 2.0;
        // Number of rows in a quadrant.
        var qY = m / 2.0;

        // Grid x coordinates:
        var gridX = glX * qX;
        // Grid y coordinates:
        var gridY = glY * qY;

        // Snap the x to the left via the floor function.
        gridX = Math.floor(gridX);
        // Snap the y to the top via the ceiling function.
        gridY = Math.ceil(gridY);

        var gridCoordinates = [gridX, gridY];

        return gridCoordinates;
    }

    convertGridToGLCoordinates(gridX, gridY) {
        var pixelSize = canvas.width / this._gridSize;

        // m is the number of rows.
        var m = canvas.height / pixelSize;
        // n is the number of columns.
        var n = canvas.width / pixelSize;

        // Number of columns in a quadrant.
        var qX = m / 2.0;
        // Number of rows in a quadrant.
        var qY = m / 2.0;

        // Convert to GL coordinates.
        var glX = gridX / qX;
        var glY = gridY / qY;

        var glCoordinates = [glX, glY];

        return glCoordinates;
    }
}
