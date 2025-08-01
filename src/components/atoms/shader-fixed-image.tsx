"use client";

import { useEffect, useRef } from "react";

// Interfaces remain the same
interface GLObjects {
	program?: WebGLProgram;
	uniforms?: {
		viewportResolution: WebGLUniformLocation | null;
		imageResolution: WebGLUniformLocation | null;
		canvasGeom: WebGLUniformLocation | null;
		texture: WebGLUniformLocation | null;
	};
	positionBuffer?: WebGLBuffer;
	positionLocation?: number;
}

interface ShaderImageProps {
	src: string;
	className?: string;
	customFragmentShader?: string;
}

export default function ShaderFixedImage({ src, className = "", customFragmentShader }: ShaderImageProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const glObjects = useRef<GLObjects>({});
	const animationFrameId = useRef<number | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const gl = canvas.getContext("webgl2");
		if (!gl) {
			console.error("WebGL 2.0 not supported");
			return;
		}

		// --- FIX: Restore newlines to shader strings ---
		const vertexShaderSource = /*glsl*/ `#version 300 es
			in vec4 a_position; 
			void main() { 
				gl_Position = a_position; 
			}`;

		const defaultFragmentShader = /*glsl*/ `#version 300 es
			precision highp float;
			uniform vec2 u_viewportResolution; 
			uniform vec2 u_imageResolution; 
			uniform vec2 u_canvasGeom; 
			uniform sampler2D u_texture;
			out vec4 fragColor;

			void main() {
				float frag_abs_y = u_canvasGeom.y - gl_FragCoord.y; 
				float frag_abs_x = u_canvasGeom.x + gl_FragCoord.x;
				vec2 screenCoord = vec2(frag_abs_x, frag_abs_y); 
				vec2 uv = screenCoord / u_viewportResolution;
				float viewportAspect = u_viewportResolution.x / u_viewportResolution.y; 
				float imageAspect = u_imageResolution.x / u_imageResolution.y;
				vec2 scaledUv = uv;
				if (viewportAspect > imageAspect) {
					float scale = imageAspect / viewportAspect; 
					scaledUv.y = (uv.y - 0.5) * scale + 0.5;
				} else {
					float scale = viewportAspect / imageAspect; 
					scaledUv.x = (uv.x - 0.5) * scale + 0.5;
				}
				fragColor = texture(u_texture, scaledUv);
			}`;

		const fragmentShaderSource = customFragmentShader || defaultFragmentShader;

		// --- WebGL Setup ---
		if (!glObjects.current.program) {
			const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
			const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
			if (!vertexShader || !fragmentShader) return;
			const program = createProgram(gl, vertexShader, fragmentShader);
			if (!program) return;
			glObjects.current.program = program;
			glObjects.current.uniforms = {
				viewportResolution: gl.getUniformLocation(program, "u_viewportResolution"),
				imageResolution: gl.getUniformLocation(program, "u_imageResolution"),
				canvasGeom: gl.getUniformLocation(program, "u_canvasGeom"),
				texture: gl.getUniformLocation(program, "u_texture"),
			};
			glObjects.current.positionBuffer = createBuffer(gl, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));
			glObjects.current.positionLocation = gl.getAttribLocation(program, "a_position");
		}

		const { program, uniforms, positionBuffer, positionLocation } = glObjects.current;
		if (!program || !uniforms || typeof positionLocation === "undefined" || !positionBuffer) return;

		const texture = createTexture(gl, src, (img) => {
			if (program && uniforms?.imageResolution) {
				gl.useProgram(program);
				gl.uniform2f(uniforms.imageResolution, img.naturalWidth, img.naturalHeight);
			}
		});

		// --- Logic to handle updates and rendering ---
		const handleScrollOrResize = () => {
			if (!canvas || !program || !uniforms?.canvasGeom) return;
			const rect = canvas.getBoundingClientRect();
			gl.useProgram(program);
			gl.uniform2f(uniforms.canvasGeom, rect.left, rect.bottom);
		};

		const render = () => {
			if (!canvas || !program || !uniforms || !texture) {
				animationFrameId.current = requestAnimationFrame(render);
				return;
			}
			if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
				canvas.width = canvas.clientWidth;
				canvas.height = canvas.clientHeight;
				gl.viewport(0, 0, canvas.width, canvas.height);
				gl.uniform2f(uniforms.viewportResolution, window.innerWidth, window.innerHeight);
			}
			gl.useProgram(program);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.uniform1i(uniforms.texture, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			animationFrameId.current = requestAnimationFrame(render);
		};

		// --- Initial Setup and Event Listeners ---
		handleScrollOrResize();
		gl.uniform2f(uniforms.viewportResolution, window.innerWidth, window.innerHeight);
		render();

		window.addEventListener("scroll", handleScrollOrResize);
		window.addEventListener("resize", handleScrollOrResize);

		// --- Cleanup ---
		return () => {
			window.removeEventListener("scroll", handleScrollOrResize);
			window.removeEventListener("resize", handleScrollOrResize);
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [src, customFragmentShader]);

	return <canvas ref={canvasRef} className={className} />;
}

// --- WebGL Helper Functions (Unchanged) ---
function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
	console.error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
	gl.deleteShader(shader);
	return null;
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
	const program = gl.createProgram();
	if (!program) return null;
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
	console.error(`Error linking program: ${gl.getProgramInfoLog(program)}`);
	gl.deleteProgram(program);
	return null;
}

function createBuffer(gl: WebGL2RenderingContext, data: Float32Array) {
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	return buffer;
}

function createTexture(gl: WebGL2RenderingContext, src: string, onLoad: (img: HTMLImageElement) => void) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

	const img = new Image();
	img.crossOrigin = "anonymous";
	img.src = src;
	img.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		onLoad(img);
	};
	return texture;
}
