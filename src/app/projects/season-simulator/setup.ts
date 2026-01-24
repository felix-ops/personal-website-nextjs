import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Color4, Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

export const setup = async (scene: Scene, engine: Engine) => {
	// --- State & Constants ---
	const ORBIT_X = 10;
	const ORBIT_Z = 9.4; // Slightly elliptical
	const EARTH_TILT = 23.5 * (Math.PI / 180);

	const START_OFFSET_DAYS = 11;
	const START_ANGLE = (START_OFFSET_DAYS / 365.25) * Math.PI * 2;

	let orbitAngle = START_ANGLE;
	const now = new Date();
	const gmtHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
	let timeProgress = gmtHours / 24;
	let earthSpin = 0;
	let isSpinPlaying = false;

	// --- Visual Setup ---

	// Glow Layer
	const glowLayer = new GlowLayer("glow", scene);
	glowLayer.intensity = 0.6;

	// Camera
	const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, Vector3.Zero(), scene);
	camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
	camera.wheelPrecision = 50;
	camera.minZ = 0.1;
	camera.upperRadiusLimit = 50;
	camera.lowerRadiusLimit = 1.5;

	// Background
	scene.clearColor = new Color4(0.02, 0.02, 0.05, 1); // Deep space blue-black

	// Light (Sun)
	const light = new PointLight("sunLight", Vector3.Zero(), scene);
	light.intensity = 380; // Stronger point light for sharp terminator
	light.diffuse = new Color3(1, 1, 0.9);
	light.specular = new Color3(1, 1, 0.9);

	// Sun Mesh
	const sun = MeshBuilder.CreateSphere("sun", { diameter: 3 }, scene);
	const sunMat = new PBRMaterial("sunMat", scene);
	sunMat.emissiveColor = new Color3(1, 0.9, 0.5);
	sunMat.emissiveIntensity = 2.0;
	sunMat.albedoColor = new Color3(0, 0, 0);
	sunMat.roughness = 1.0;
	sun.material = sunMat;

	// --- Orbit Path ---
	const pathPoints = [];
	for (let i = 0; i <= 400; i++) {
		const angle = (i / 400) * Math.PI * 2;
		pathPoints.push(new Vector3(ORBIT_X * Math.cos(angle), 0, ORBIT_Z * Math.sin(angle)));
	}
	const orbitPath = MeshBuilder.CreateLines("orbitPath", { points: pathPoints }, scene);
	orbitPath.color = new Color3(0.05, 0.05, 0.2);
	orbitPath.alpha = 0.4;
	orbitPath.isVisible = true; // Default to visible based on request? Let's make it toggleable.

	// --- Earth System ---

	// 1. Tilt Frame (The "Gyroscope")
	// This node moves with the orbit, but its rotation maintaings the 23.5 degree tilt.
	const tiltNode = new TransformNode("earthTiltNode", scene);
	tiltNode.rotation.z = -EARTH_TILT;

	// 2. Earth Mesh (Child of Tilt Frame)
	const earth = MeshBuilder.CreateSphere("earth", { diameter: 1 }, scene);
	earth.parent = tiltNode;

	// Default Camera Focus
	camera.setTarget(tiltNode);

	const earthMat = new PBRMaterial("earthMat", scene);
	const earthTexture = new Texture(
		"https://cdn.jsdelivr.net/gh/felix-ops/website-assets@main/projects/season-simulator/earth-texture.png",
		scene,
	);
	earthTexture.vScale = -1;
	earthTexture.uScale = -1;
	earthMat.albedoTexture = earthTexture;
	earthMat.roughness = 0.7;
	earthMat.metallic = 0.0;
	earth.material = earthMat;

	// 3. Axis Line (Child of Tilt Frame)
	const axisPoints = [new Vector3(0, -1.3, 0), new Vector3(0, 0.8, 0)];
	const axis = MeshBuilder.CreateLines("earthAxis", { points: axisPoints }, scene);
	axis.parent = tiltNode;
	axis.color = new Color3(1, 1, 1);

	// North Marker
	const northMarker = MeshBuilder.CreateCylinder(
		"northMarker",
		{ diameterTop: 0, diameterBottom: 0.05, height: 0.1 },
		scene,
	);
	northMarker.position = new Vector3(0, 0.8, 0);
	northMarker.parent = tiltNode;
	const markerMat = new PBRMaterial("markerMat", scene);
	markerMat.albedoColor = Color3.Red();
	markerMat.unlit = true;
	northMarker.material = markerMat;

	// --- Sunlight Rays ---
	// A separate system to show parallel rays hitting the earth
	const rayRoot = new TransformNode("rayRoot", scene);
	const rayCount = 14;
	const rayLength = 10;
	const rayGap = 0.03;
	const earthRadius = 0.5;

	for (let i = -rayCount; i <= rayCount; i++) {
		const y = i * rayGap;
		// Calculate where a parallel ray hits the sphere surface: z = sqrt(R^2 - y^2)
		const hitZ = Math.sqrt(Math.pow(earthRadius, 2) - Math.pow(y, 2));

		const ray = MeshBuilder.CreateTube(
			"ray" + i,
			{
				path: [new Vector3(0, 0, rayLength), new Vector3(0, 0, hitZ)],
				radius: 0.005,
				tessellation: 4,
			},
			scene,
		);
		ray.position.y = y;
		ray.parent = rayRoot;

		const rayMat = new PBRMaterial("rayMat", scene);
		// Intensity decreases towards poles (cos-like falloff or simple linear)
		const intensity = 1.0 - Math.abs(i) / (rayCount + 2);
		rayMat.emissiveColor = new Color3(1, 1, 0.5).scale(intensity);
		rayMat.alpha = 0.6 * intensity;
		rayMat.unlit = true;
		ray.material = rayMat;
	}

	// --- State ---
	let isPlaying = false;
	let isCameraSynced = true;
	let lastOrbitAngle = orbitAngle;

	// Initial Camera Sync Positioning
	camera.alpha = orbitAngle + Math.PI / 1.5;

	const updateEarthRotation = () => {
		// Earth rotation consists of:
		// 1. Daily rotation (timeProgress * 2PI)
		// 2. Yearly alignment (must add orbitAngle to keep "noon" pointing at sun)
		// 3. Texture offset (calibration to align Greenwich)
		const TEXTURE_OFFSET = Math.PI / 2; // Adjust if Greenwich is not facing sun at 12:00 GMT
		earthSpin = timeProgress * Math.PI * 2 + orbitAngle + TEXTURE_OFFSET;
		earth.rotation.y = earthSpin;
	};

	// --- Latitude Ring ---
	const latRing = MeshBuilder.CreateTorus("latRing", { diameter: 1, thickness: 0.02, tessellation: 64 }, scene);
	latRing.parent = earth; // Parent to earth (so it spins with it? NO. Latitude ring stays fixed on earth surface, spins with earth).
	// Actually, normally latitude ring spins with earth. IF we want to show the "circle of latitude", it spins.
	// If we want to show "Day length", we want to see how much of this ring is in light.
	// So yes, parent to earth.
	const latMat = new PBRMaterial("latMat", scene);
	latMat.albedoColor = Color3.Green();
	latMat.unlit = true;
	latMat.alpha = 0.5;
	latRing.material = latMat;

	let currentLat = 45; // degrees

	const updateLatRing = () => {
		const rad = currentLat * (Math.PI / 180);
		const r = 0.5 * Math.cos(rad); // Earth radius 0.5
		const y = 0.5 * Math.sin(rad);
		latRing.scaling.set(r * 2, r * 2, r * 2); // Torus diameter is 1, so scale by diameter. Wait. CreateTorus diameter is 1, so radius 0.5.
		// We set diameter 1. So radius 0.5.
		// If lat=0, r=0.5. scaling 1. Correct.
		// If lat=90, r=0. scaling 0. Correct.
		latRing.position.y = y;
	};
	updateLatRing();

	// --- Render Loop ---
	scene.registerBeforeRender(() => {
		// 1. Orbital Physics
		if (isPlaying) {
			orbitAngle += 0.002;
		}
		if (isSpinPlaying) {
			timeProgress += 0.002;
			if (timeProgress > 1) timeProgress -= 1;
		}

		updateEarthRotation();

		// 2. Camera Sync
		if (isCameraSynced) {
			const orbitDelta = orbitAngle - lastOrbitAngle;
			camera.alpha += orbitDelta;
		}
		lastOrbitAngle = orbitAngle;

		const x = ORBIT_X * Math.cos(orbitAngle);
		const z = ORBIT_Z * Math.sin(orbitAngle);

		// Update Tilt Node Position (Orbit)
		tiltNode.position.set(x, 0, z);

		// Fixed Axial Tilt (Always ON)
		tiltNode.rotation.y = 0;

		// Update Earth Spin
		earth.rotation.y = earthSpin;

		// Update Sun Rays
		// Position at Earth center
		rayRoot.position.copyFrom(tiltNode.position);
		// Look at Sun
		rayRoot.lookAt(Vector3.Zero());

		// Report state back to React
		if ((window as any)._updateState) {
			// Normalize progress 0-1 where 0 = Jan 1
			let progress = (orbitAngle - START_ANGLE) / (Math.PI * 2);
			progress = progress % 1;
			if (progress < 0) progress += 1;

			// Calculate Sun Declination and Day Length
			const tiltRad = EARTH_TILT;
			const sinDelta = -Math.cos(orbitAngle) * Math.sin(tiltRad);
			const delta = Math.asin(sinDelta);
			const latRad = (currentLat * Math.PI) / 180;

			let h = 0;
			const val = -Math.tan(latRad) * Math.tan(delta);
			if (val >= 1) h = 0;
			else if (val <= -1) h = Math.PI;
			else h = Math.acos(val);

			const dayHours = h * 2 * (12 / Math.PI);
			const sunAngle = 90 - Math.abs(currentLat - (delta * 180) / Math.PI);

			(window as any)._updateState({
				progress: progress,
				timeProgress: timeProgress,
				dayHours: dayHours,
				sunAngle: sunAngle,
				isPlaying: isPlaying,
			});
		}
	});

	// --- Window Controls for React ---
	(window as any).setOrbitProgress = (progress: number) => {
		// progress 0 = Jan 1
		orbitAngle = START_ANGLE + progress * Math.PI * 2;
	};

	(window as any).setIsPlaying = (playing: boolean) => {
		isPlaying = playing;
	};

	(window as any).setShowOrbitPath = (visible: boolean) => {
		orbitPath.isVisible = visible;
	};

	(window as any).setCameraSync = (synced: boolean) => {
		isCameraSynced = synced;
		// Optionally reset alpha to a good "side" view when enabled
		if (synced) {
			camera.alpha = orbitAngle + Math.PI / 1.5;
		}
	};

	(window as any).setEarthSpinProgress = (progress: number) => {
		timeProgress = progress;
		updateEarthRotation();
	};

	(window as any).setIsSpinPlaying = (playing: boolean) => {
		isSpinPlaying = playing;
	};

	(window as any).setLatitude = (lat: number) => {
		currentLat = lat;
		updateLatRing();
	};
};
