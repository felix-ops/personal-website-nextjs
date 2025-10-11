"use client";

import { useEffect, useRef } from "react";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/loaders/glTF";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";

type BabylonSceneProps = {
	className?: string;
	onSceneReady: (scene: Scene, engine: Engine) => void;
	debug?: boolean;
};

export default function BabylonScene({ className, onSceneReady, debug = false }: BabylonSceneProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;

		// initialize babylon scene and engine
		const engine = new Engine(canvas, true, {
			alpha: true,
			antialias: true,
			preserveDrawingBuffer: false,
			premultipliedAlpha: false,
		});
		const scene = new Scene(engine);

		// Execute the custom 3D code
		onSceneReady(scene, engine);

		// hide/show the Inspector
		const handleKeyDown = (ev: KeyboardEvent) => {
			// Shift+Ctrl+Alt+I
			if (debug && ev.shiftKey && ev.ctrlKey && ev.altKey && (ev.key === "I" || ev.key === "i")) {
				if (scene.debugLayer.isVisible()) {
					scene.debugLayer.hide();
				} else {
					scene.debugLayer.show();
				}
			}
		};
		import("@babylonjs/inspector").then(() => {
			window.addEventListener("keydown", handleKeyDown);
		});

		// run the main render loop
		engine.runRenderLoop(() => {
			scene.render();
		});

		// Handle window resize
		const handleResize = () => {
			engine.resize();
		};
		window.addEventListener("resize", handleResize);

		const fixResolution = () => {
			const isPortrait = window.innerWidth < window.innerHeight;

			const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

			let maxWidth = 1920;
			let maxHeight = 1080;

			const mobileScaleFactor = 0.5;

			if (isMobile) {
				maxHeight *= mobileScaleFactor;
				maxWidth *= mobileScaleFactor;
			}

			if (isPortrait) {
				engine.setHardwareScalingLevel(window.innerWidth / maxHeight);
			} else {
				engine.setHardwareScalingLevel(window.innerWidth / maxWidth);
			}
		};
		fixResolution();

		window.addEventListener("resize", fixResolution);
		window.addEventListener("orientationchange", fixResolution);

		// Cleanup function
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("resize", handleResize);
			engine.dispose();
		};
	}, [onSceneReady, debug]);

	return (
		<div className={className} style={{ background: "transparent" }}>
			<canvas
				ref={canvasRef}
				style={{
					width: "100%",
					height: "100%",
					outline: "none",
					background: "transparent",
					display: "block",
				}}
				id="gameCanvas"
			/>
		</div>
	);
}
