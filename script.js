
// on page load...
window.addEventListener('load', () => {

    // get canvas element and the webgl graphics context
    const webglCanvas = document.querySelector('#webgl-canvas');
    const webgl = webglCanvas.getContext('webgl');

    // compile the vertex and fragment shaders
    let vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
    webgl.shaderSource(vertexShader, document.querySelector(`#vertex-shader`).textContent);
    webgl.compileShader(vertexShader);
    if(!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS))
        console.log(webgl.getShaderInfoLog(vertexShader));
    let fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
    webgl.shaderSource(fragmentShader, document.querySelector(`#fragment-shader`).textContent);
    webgl.compileShader(fragmentShader);
    if(!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS))
        console.log(webgl.getShaderInfoLog(vertexShader));

    // create new webgl program and attach shaders
    let program = webgl.createProgram();
    webgl.attachShader(program, vertexShader);
    webgl.attachShader(program, fragmentShader);
    webgl.linkProgram(program);
    if (!webgl.getProgramParameter(program, webgl.LINK_STATUS))
        console.log(webgl.getProgramInfoLog(program));
    webgl.useProgram(program);

    // create a new buffer for vertex data and load vertices into it
    let vertices = [250, 200, 300, 250, 200, 250, 250, 300, 300, 250, 200, 250];
    const vertexBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);

    // bind the vertex buffer to the 'canvasPosition' attribute
    var canvasPosition = webgl.getAttribLocation(program, 'canvasPosition');
    webgl.vertexAttribPointer(canvasPosition, 2, webgl.FLOAT, false, 0, 0);
    webgl.enableVertexAttribArray(canvasPosition);

    // start the animation
    animate();

    // run for every frame
    function animate() {

        // set viewport dimensions
        webgl.viewport(0, 0, webglCanvas.width, webglCanvas.height);

        // set clear color and clear buffers
        webgl.clearColor(0, 0, 0, 1);
        webgl.clear(webgl.COLOR_BUFFER_BIT);

        // bind the canvas width and height to the 'canvasDimensions' uniform
        let canvasDimensions = webgl.getUniformLocation(program, 'canvasDimensions');
        webgl.uniform2fv(canvasDimensions, [webglCanvas.width, webglCanvas.height]);

        // bind a color to the 'color' uniform
        let color = webgl.getUniformLocation(program, 'color');
        webgl.uniform4fv(color, [0.0, 1.0, 1.0, 1.0]);

        // draw triangles using the vertices in the vertex buffer
        webgl.drawArrays(webgl.TRIANGLES, 0, vertices.length / 2);

        // request the next frame
        requestAnimationFrame(animate);

    }
});