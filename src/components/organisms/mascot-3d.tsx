"use client";

import { Scene } from "@babylonjs/core/scene";
import BabylonScene from "./babylon-renderer";
import { Engine } from "@babylonjs/core/Engines/engine";
import { setup } from "@/app/projects/librarian-3d-model-DfKjk/setup";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react";

import { Tools } from "@babylonjs/core/Misc/tools";
import { mapRange } from "@/lib/utils";

export type MascotRef = {
	setInteraction: (x: number, y: number) => void;
	reset: () => void;
};

const Mascot3D = forwardRef<MascotRef>((_, ref) => {
	const [shouldShowFallback, setShouldShowFallback] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isModelLoading, setIsModelLoading] = useState(true);
	const sceneRef = useRef<Scene | null>(null);

	// ✅ Single placeholder image for both cases
	const PLACEHOLDER_IMAGE =
		"https://cdn.jsdelivr.net/gh/felix-ops/website-assets/projects/librarian-web-render/mascot-capture-2.png";

	useImperativeHandle(ref, () => ({
		setInteraction: (normX: number, normY: number) => {
			if (!sceneRef.current || !sceneRef.current.metadata) return;
			sceneRef.current.metadata.targetXRot = mapRange(normY, [0, 1], [Tools.ToRadians(-30), Tools.ToRadians(30)]);
			sceneRef.current.metadata.targetYRot = mapRange(normX, [0, 1], [Tools.ToRadians(-30), Tools.ToRadians(30)]);
		},
		reset: () => {
			if (!sceneRef.current || !sceneRef.current.metadata) return;
			sceneRef.current.metadata.targetXRot = 0;
			sceneRef.current.metadata.targetYRot = 0;
		},
	}));

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
		sceneRef.current = scene;
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
});

Mascot3D.displayName = "Mascot3D";

export default Mascot3D;
