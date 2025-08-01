"use client";

import { useEffect, useRef } from "react";

interface ShaderImageProps {
	src: string;
	className?: string;
	width?: number;
	height?: number;
	customFragmentShader?: string;
}

export default function ShaderImage({ src, className = "", width, height, customFragmentShader }: ShaderImageProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const gl = canvas.getContext("webgl2");
		if (!gl) {
			console.error("WebGL 2.0 not supported");
			return;
		}

		// Vertex shader source
		const vertexShaderSource = /*glsl*/ `#version 300 es
			in vec4 a_position;
			in vec2 a_texCoord;
			out vec2 v_texCoord;
			void main() {
				gl_Position = a_position;
				v_texCoord = a_texCoord;
			}`;

		// Default fragment shader source
		const defaultFragmentShader = /*glsl*/ `#version 300 es
			precision highp float;

			uniform float u_time;
			uniform vec2 u_resolution;
			uniform vec2 u_imageSize;
			uniform sampler2D u_texture;

			in vec2 v_texCoord;
			out vec4 fragColor;

			void main() {
				vec2 uv = v_texCoord;
				
				// Calculate aspect ratio correction using actual image dimensions
				float canvasAspect = u_resolution.x / u_resolution.y;
				float imageAspect = u_imageSize.x / u_imageSize.y;
				
				vec2 correctedUV = uv;
				
				if (canvasAspect > imageAspect) {
					// Canvas is wider than image aspect ratio
					float scale = imageAspect / canvasAspect;
					correctedUV.y = (uv.y - 0.5) * scale + 0.5;
				} else {
					// Canvas is taller than image aspect ratio
					float scale = canvasAspect / imageAspect;
					correctedUV.x = (uv.x - 0.5) * scale + 0.5;
				}
				
				// Sample the texture with corrected UV coordinates
				vec4 texColor = texture(u_texture, correctedUV);
				
				fragColor = vec4(texColor);
			}`;

		// Use custom fragment shader if provided, otherwise use default
		const fragmentShaderSource = customFragmentShader || defaultFragmentShader;

		// Create and compile vertex shader
		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
		if (!vertexShader) {
			console.error("Failed to create vertex shader");
			return;
		}
		gl.shaderSource(vertexShader, vertexShaderSource);
		gl.compileShader(vertexShader);

		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
			console.error("Vertex shader compilation error:", gl.getShaderInfoLog(vertexShader));
			gl.deleteShader(vertexShader);
			return;
		}

		// Create and compile fragment shader
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		if (!fragmentShader) {
			console.error("Failed to create fragment shader");
			gl.deleteShader(vertexShader);
			return;
		}
		gl.shaderSource(fragmentShader, fragmentShaderSource);
		gl.compileShader(fragmentShader);

		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
			console.error("Fragment shader compilation error:", gl.getShaderInfoLog(fragmentShader));
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
			return;
		}

		// Create shader program
		const program = gl.createProgram();
		if (!program) {
			console.error("Failed to create shader program");
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
			return;
		}

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error("Program linking error:", gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
			return;
		}

		// Get uniform locations
		const timeLocation = gl.getUniformLocation(program, "u_time");
		const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
		const imageSizeLocation = gl.getUniformLocation(program, "u_imageSize");
		const textureLocation = gl.getUniformLocation(program, "u_texture");

		// Create a full-screen quad with texture coordinates
		const positions = new Float32Array([
			// positions    // texture coords
			-1,
			-1,
			0,
			1, // bottom left (flipped Y)
			1,
			-1,
			1,
			1, // bottom right (flipped Y)
			-1,
			1,
			0,
			0, // top left (flipped Y)
			1,
			1,
			1,
			0, // top right (flipped Y)
		]);

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

		// Get attribute locations
		const positionLocation = gl.getAttribLocation(program, "a_position");
		const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

		// Create and load texture
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Set texture parameters
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		// Load the image
		let imageWidth = 1;
		let imageHeight = 1;
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			imageWidth = img.naturalWidth;
			imageHeight = img.naturalHeight;
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		};
		img.src = src;

		// Function to resize canvas
		const resizeCanvas = () => {
			if (width && height) {
				canvas.width = width;
				canvas.height = height;
			} else {
				canvas.width = canvas.clientWidth;
				canvas.height = canvas.clientHeight;
			}
			gl.viewport(0, 0, canvas.width, canvas.height);
		};

		// Initial resize
		resizeCanvas();

		// Handle window resize
		const handleResize = () => {
			resizeCanvas();
		};

		window.addEventListener("resize", handleResize);

		// Animation variables
		const startTime = Date.now();

		// Render function
		const render = () => {
			const currentTime = (Date.now() - startTime) * 0.001; // Convert to seconds

			// Use the shader program
			gl.useProgram(program);

			// Set uniforms
			gl.uniform1f(timeLocation, currentTime);
			gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
			gl.uniform2f(imageSizeLocation, imageWidth, imageHeight);
			gl.uniform1i(textureLocation, 0); // Bind texture to texture unit 0

			// Bind texture
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture);

			// Set up vertex attributes
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

			// Position attribute
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0); // 16 bytes stride

			// Texture coordinate attribute
			gl.enableVertexAttribArray(texCoordLocation);
			gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8); // 8 bytes offset

			// Draw the full-screen quad
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

			// Request next frame
			requestAnimationFrame(render);
		};

		// Start the animation loop
		render();

		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
			gl.deleteProgram(program);
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
			gl.deleteBuffer(positionBuffer);
			gl.deleteTexture(texture);
		};
	}, [src, width, height, customFragmentShader]);

	return (
		<canvas
			ref={canvasRef}
			className={className}
			style={{
				display: "block",
				width: width ? `${width}px` : "100%",
				height: height ? `${height}px` : "100%",
			}}
		/>
	);
}
