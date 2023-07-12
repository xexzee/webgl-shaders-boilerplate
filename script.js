window.addEventListener('load', () => {

    // get the canvas element and its webgl graphics context
    const webglCanvas = document.querySelector('#webgl-canvas');
    const webgl = webglCanvas.getContext('webgl');

    // call the functions that create and compile and the webgl shaders/program
    const shaders = compileShaders('vertex-shader', 'fragment-shader');
    const program = initializeProgram(shaders.vertexShader, shaders.fragmentShader);

    webgl.useProgram(program);
    
    // vertices of a square
    let vertexData = new Float32Array([200, 200, 400, 200, 200, 400, 400, 200, 400, 400, 200, 400]);

    // buffer vertex data (webgl.STATIC_DRAW specifies that this buffer will only be set once)
    let vertexBuffer = bufferVertexData(vertexData, webgl.STATIC_DRAW);

    var canvasPosition = webgl.getAttribLocation(program, 'canvasPosition');
    webgl.vertexAttribPointer(canvasPosition, 2, webgl.FLOAT, false, 0, 0);
    webgl.enableVertexAttribArray(canvasPosition);

    // renders the image and requests the next animation frame
    function animate() {

        // set the gl viewport to match the canvas element size (important for if the canvas is resized)
        webgl.viewport(0, 0, webglCanvas.width, webglCanvas.height);

        // color to use when clearing color buffers
        webgl.clearColor(0, 0, 0, 1);

        // clears all color buffers
        webgl.clear(webgl.COLOR_BUFFER_BIT);

        let canvasDimensions = webgl.getUniformLocation(program, 'canvasDimensions');
        webgl.uniform2fv(canvasDimensions, [webglCanvas.width, webglCanvas.height]);

        webgl.drawArrays(webgl.TRIANGLES, 0, vertexData.length / 2);

        requestAnimationFrame(animate);
    }

    // begin the animation
    animate();

    // compiles the vertex and fragment shaders
    function compileShaders(vertexShaderId, fragmentShaderId) {
        let vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
        webgl.shaderSource(vertexShader, document.querySelector(`#${vertexShaderId}`).textContent);
        webgl.compileShader(vertexShader);

        if(!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS))
            console.log(webgl.getShaderInfoLog(vertexShader));

        let fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
        webgl.shaderSource(fragmentShader, document.querySelector(`#${fragmentShaderId}`).textContent);
        webgl.compileShader(fragmentShader);

        if(!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS))
            console.log(webgl.getShaderInfoLog(vertexShader));
        
        return {vertexShader: vertexShader, fragmentShader: fragmentShader};
    }

    // creates a new webgl program from the given shaders
    function initializeProgram(vertexShader, fragmentShader) {
        let program = webgl.createProgram();
        webgl.attachShader(program, vertexShader);
        webgl.attachShader(program, fragmentShader);
        webgl.linkProgram(program);

        if (!webgl.getProgramParameter(program, webgl.LINK_STATUS))
            console.log(webgl.getProgramInfoLog(program));

        return program;
    }

    // creates, binds, and loads data into a new vertex buffer
    function bufferVertexData(data, usage) {
        const vertexBuffer = webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
        webgl.bufferData(webgl.ARRAY_BUFFER, data, usage);
        return vertexBuffer;
    }
});

