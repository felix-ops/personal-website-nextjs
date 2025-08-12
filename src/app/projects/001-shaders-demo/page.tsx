"use client";

import { useEffect, useRef } from "react";
import { shaderFrag } from "./shader";

export default function ShadersPage() {
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
			void main() {
				gl_Position = a_position;
			}
		`;

		// Fragment shader source (from shader.ts)
		const fragmentShaderSource = shaderFrag;

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

		// Create a full-screen quad
		const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

		// Get attribute location
		const positionLocation = gl.getAttribLocation(program, "a_position");

		// Function to resize canvas to match window size
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
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

			// Set up vertex attributes
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

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
		};
	}, []);

	return (
		<div className="w-screen h-screen overflow-hidden">
			<canvas ref={canvasRef} className="block w-full h-full" style={{ display: "block" }} />
		</div>
	);
}
