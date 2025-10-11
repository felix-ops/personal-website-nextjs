"use client";

import { Scene } from "@babylonjs/core/scene";
import BabylonScene from "./babylon-renderer";
import { Engine } from "@babylonjs/core/Engines/engine";
import { setup } from "@/app/projects/librarian-web-render/setup";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

export default function Mascot3D() {
	const [shouldShowFallback, setShouldShowFallback] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isModelLoading, setIsModelLoading] = useState(true);

	useEffect(() => {
		const checkDeviceAndWebGL = () => {
			// Check if it's a mobile device
			const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

			// Check if it's a touch device
			const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

			// Check WebGL support
			const canvas = document.createElement("canvas");
			const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
			const hasWebGL = !!gl;

			// Show fallback if mobile, touch device, or no WebGL support
			const shouldFallback = isMobile || isTouchDevice || !hasWebGL;

			setShouldShowFallback(shouldFallback);
			setIsLoading(false);
		};

		checkDeviceAndWebGL();
	}, []);

	// Wrapper for the setup function to handle the model loading state
	const setupWithLoadingState = useCallback(async (scene: Scene, engine: Engine) => {
		// 1. Call the original setup function, which includes the heavy ImportMeshAsync
		await setup(scene, engine);

		// 2. Wait for the next render frame.
		// The scene starts rendering after the setup function returns. By waiting for the
		// 'onAfterRenderObservable', we ensure the 3D model is fully drawn on the canvas
		// before we remove the fallback image, eliminating the flicker.
		scene.onAfterRenderObservable.addOnce(() => {
			// 3. Model loading is complete and rendered, so hide the placeholder image.
			setIsModelLoading(false);
		});
	}, []);

	// Show loading state initially (for device/WebGL check)
	if (isLoading) {
		return (
			<div className="w-full h-full rounded-2xl overflow-hidden bg-gray-100 animate-pulse flex items-center justify-center">
				<div className="text-gray-400">Pixeling...</div>
			</div>
		);
	}

	// Show permanent fallback image for mobile/touch devices or when WebGL is not supported
	if (shouldShowFallback) {
		return (
			<div className="relative w-full h-full rounded-2xl overflow-hidden">
				<Image
					src="https://cdn.jsdelivr.net/gh/felix-ops/website-assets/book-girl-pixel.png"
					alt="Professional headshot"
					fill
					className="rounded-2xl object-cover"
					sizes="(max-width: 768px) 100vw, 33vw"
					priority={true}
				/>
			</div>
		);
	}

	// Show 3D scene for desktop devices with WebGL support
	return (
		<div className="relative w-full h-full rounded-2xl overflow-hidden">
			{/* Interim image shown while the Babylon scene loads the GLB model */}
			{isModelLoading && (
				<Image
					src="https://cdn.jsdelivr.net/gh/felix-ops/website-assets/projects/librarian-web-render/mascot-capture.png"
					alt="Mascot loading preview"
					fill
					// Ensure the image sits behind the transparent Babylon canvas
					className="rounded-2xl object-cover absolute top-0 left-0"
					sizes="(max-width: 768px) 100vw, 33vw"
					priority={true}
				/>
			)}
			{/* BabylonScene is rendered immediately, calling setupWithLoadingState */}
			<BabylonScene
				className="w-full h-full rounded-2xl overflow-hidden"
				onSceneReady={setupWithLoadingState} // Use the wrapper function
				debug={false}
			/>
		</div>
	);
}
