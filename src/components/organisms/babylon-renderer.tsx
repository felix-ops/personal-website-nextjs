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
		const engine = new Engine(canvas, true);
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

		// Cleanup function
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("resize", handleResize);
			engine.dispose();
		};
	}, [onSceneReady, debug]);

	return (
		<div className={className}>
			<canvas
				ref={canvasRef}
				style={{
					width: "100%",
					height: "100%",
					outline: "none",
				}}
				id="gameCanvas"
			/>
		</div>
	);
}
