"use client";

import ShaderImage from "@/components/atoms/shader-image";

export default function ShadersPage() {
	// Custom fragment shader with wave effect
	const waveShader = /*glsl*/ `#version 300 es
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
			
			// Add wave effect
			float wave = sin(correctedUV.x * 10.0 + u_time * 2.0) * 0.01;
			correctedUV.y += wave;
			
			// Sample the texture with corrected UV coordinates
			vec4 texColor = texture(u_texture, correctedUV);
			
			fragColor = vec4(texColor);
		}`;

	return (
		<div className="w-screen h-screen overflow-hidden flex flex-col">
			{/* ShaderImage with custom wave effect */}
			<div className="w-full h-full">
				<ShaderImage
					src="https://cdn.jsdelivr.net/gh/felix-ops/website-assets/skeleton.png"
					className="w-full h-full"
					customFragmentShader={waveShader}
				/>
			</div>
		</div>
	);
}
