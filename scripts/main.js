// const gl = canvas.getContext("webgl");
const canvas = document.querySelector("#glCanvas");

// Set up the context for webgl.
const gl = canvas.getContext( "webgl", { antialias: true, preserveDrawingBuffer: true } );


// This is the initial function being called by the HTML document.
function main() {

    // Test to see if WebGL is supported.
    testWebGL(canvas, gl);

    // Set the color of the background to be white.
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Instantiate the universe in which holds the grid object.
    var universe = new Universe(canvas, gl, 50);
    universe.drawGrid();
}

/*
 * This function tests to see if the canvas is supported by the browser.
 */
function testWebGL(canvas, gl) {
    if (!gl) {
        alert("The brower was unable to initialize WebGL. WebGL may not be supported.");
    } else {
        console.log("GL is present, proceeding to initialize program.");
    }
}
