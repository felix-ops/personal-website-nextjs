"use client";

import { Scene } from "@babylonjs/core/scene";
import BabylonScene from "./babylon-renderer";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Color4, Color3 } from "@babylonjs/core/Maths/math.color";
import { GridMaterial } from "@babylonjs/materials";
import { Animation, EasingFunction, CircleEase } from "@babylonjs/core/Animations";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { Tools } from "@babylonjs/core/Misc/tools";

const setup = (scene: Scene, engine: Engine) => {
	const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
	// camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
	camera.radius = 6;
	camera.useNaturalPinchZoom = true;
	camera.wheelPrecision = 20;
	camera.target.y = -6;

	const bgColor = Color3.FromHexString("#f5f5f5");
	const gridColor = new Color3(0.85, 0.85, 0.85);

	scene.clearColor = Color4.FromHexString("#f5f5f5ff");
	scene.fogColor = bgColor;
	scene.fogMode = Scene.FOGMODE_EXP;
	scene.fogDensity = 0.03;

	const light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

	const cube = MeshBuilder.CreateBox("cube", { size: 1 }, scene);
	cube.position.y = 0.5;
	cube.visibility = 0;

	// Create tunnel with four grid walls
	const tunnelLength = 10000;
	const tunnelWidth = 40;
	const tunnelHeight = 20;

	// Create grid material
	const gridMaterial = new GridMaterial("gridMaterial", scene);
	gridMaterial.alpha = 0.3; // Semi-transparent
	gridMaterial.gridRatio = 0.5; // Grid size
	gridMaterial.mainColor = bgColor; // Light gray color
	gridMaterial.backFaceCulling = false;
	gridMaterial.lineColor = bgColor;

	// Floor (bottom wall)
	const floor = MeshBuilder.CreateGround(
		"floor",
		{
			width: tunnelWidth,
			height: tunnelLength,
			subdivisions: 20,
		},
		scene,
	);
	floor.material = gridMaterial;
	floor.rotation.y = Math.PI / 2; // Rotate to align with tunnel direction
	floor.position.y = -tunnelHeight / 2;

	// Ceiling (top wall)
	const ceiling = MeshBuilder.CreateGround(
		"ceiling",
		{
			width: tunnelWidth,
			height: tunnelLength,
			subdivisions: 20,
		},
		scene,
	);
	ceiling.material = gridMaterial;
	ceiling.rotation.y = Math.PI / 2; // Rotate to align with tunnel direction
	ceiling.position.y = tunnelHeight / 2;

	// Left wall
	const leftWall = MeshBuilder.CreateGround(
		"leftWall",
		{
			width: tunnelHeight,
			height: tunnelLength,
			subdivisions: 20,
		},
		scene,
	);
	leftWall.material = gridMaterial;
	leftWall.rotation.y = Math.PI / 2; // Rotate to align with tunnel direction
	leftWall.rotation.z = Math.PI / 2; // Rotate to make it vertical
	leftWall.position.z = -tunnelWidth / 2;

	// Right wall
	const rightWall = MeshBuilder.CreateGround(
		"rightWall",
		{
			width: tunnelHeight,
			height: tunnelLength,
			subdivisions: 20,
		},
		scene,
	);
	rightWall.material = gridMaterial;
	rightWall.rotation.y = Math.PI / 2; // Rotate to align with tunnel direction
	rightWall.rotation.z = Math.PI / 2; // Rotate to make it vertical
	rightWall.position.z = tunnelWidth / 2;

	// Create animation for line color change
	const lineColorAnimation = new Animation(
		"lineColorAnimation",
		"lineColor",
		30, // frames per second
		Animation.ANIMATIONTYPE_COLOR3,
		Animation.ANIMATIONLOOPMODE_CONSTANT,
	);

	// Define keyframes
	const keyFrames = [];
	keyFrames.push({
		frame: 0,
		value: bgColor,
	});
	keyFrames.push({
		frame: 150, // 5 seconds at 30 fps
		value: gridColor,
	});

	lineColorAnimation.setKeys(keyFrames);

	// Add easing function for smooth transition
	const easingFunction = new CircleEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	lineColorAnimation.setEasingFunction(easingFunction);

	// Apply animation to all tunnel walls
	scene.beginDirectAnimation(gridMaterial, [lineColorAnimation], 0, 150, false);

	let targetAlpha = Tools.ToRadians(180);
	let targetBeta = Tools.ToRadians(90);

	scene.onPointerObservable.add((pointerInfo) => {
		if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
			const evt = pointerInfo.event;
			const x = evt.clientX;
			const y = evt.clientY;

			const xRatio = (x / window.innerWidth) * 2 - 1;
			const yRatio = (y / window.innerHeight) * 2 - 1;

			targetAlpha = Tools.ToRadians(180 + xRatio * -10);
			targetBeta = Tools.ToRadians(90 + yRatio * -10);
		}
	});

	scene.onBeforeRenderObservable.add(() => {
		// Smoothly interpolate camera.alpha and camera.beta toward targetAlpha and targetBeta
		const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
		camera.alpha = lerp(camera.alpha, targetAlpha, 0.08); // 0.08 controls smoothness
		camera.beta = lerp(camera.beta, targetBeta, 0.08);
		camera.target.x += 0.02;
	});
};
export default function HomePage3D() {
	return <BabylonScene className="w-full h-full" onSceneReady={setup} debug={false} />;
}
