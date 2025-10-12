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

	// ✅ Single placeholder image for both cases
	const PLACEHOLDER_IMAGE =
		"https://cdn.jsdelivr.net/gh/felix-ops/website-assets/projects/librarian-web-render/mascot-capture-2.png";

	useEffect(() => {
		const checkDeviceAndWebGL = () => {
			const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

			const canvas = document.createElement("canvas");
			const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
			const hasWebGL = !!gl;

			const shouldFallback = isMobile || isTouchDevice || !hasWebGL;
			setShouldShowFallback(shouldFallback);
			setIsLoading(false);
		};

		checkDeviceAndWebGL();
	}, []);

	const setupWithLoadingState = useCallback(async (scene: Scene, engine: Engine) => {
		await setup(scene, engine);

		scene.onAfterRenderObservable.addOnce(() => {
			setTimeout(() => setIsModelLoading(false), 500);
		});
	}, []);

	// ✅ Same placeholder used for fallback mode
	if (shouldShowFallback) {
		return (
			<div className="relative w-full h-full rounded-2xl overflow-hidden">
				<Image
					src={PLACEHOLDER_IMAGE}
					alt="Mascot fallback image"
					fill
					className="rounded-2xl object-cover"
					sizes="(max-width: 768px) 100vw, 33vw"
					priority={true}
				/>
			</div>
		);
	}

	// ✅ Same placeholder also used while the 3D model loads
	return (
		<div className="relative w-full h-full rounded-2xl overflow-hidden">
			{isModelLoading && (
				<Image
					src={PLACEHOLDER_IMAGE}
					alt="Mascot loading preview"
					fill
					className="rounded-2xl object-cover absolute top-0 left-0"
					sizes="(max-width: 768px) 100vw, 33vw"
					priority={true}
				/>
			)}

			<BabylonScene
				className="w-full h-full rounded-2xl overflow-hidden"
				onSceneReady={setupWithLoadingState}
				debug={false}
			/>
		</div>
	);
}
