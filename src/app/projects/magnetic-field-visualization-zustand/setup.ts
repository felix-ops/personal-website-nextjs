import { setHDREnvironmentTextureFromURL } from "@/lib/babylon-utils";
import { almostEqual, mapRange } from "@/lib/utils";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader.js";
import { Effect } from "@babylonjs/core/Materials/effect";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Path3D } from "@babylonjs/core/Maths/math.path";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Tools } from "@babylonjs/core/Misc/tools";
import { Scene } from "@babylonjs/core/scene";
import { useSolenoidStore } from "./store";

export const setup = async (scene: Scene, engine: Engine) => {
	const glowLayer = new GlowLayer("glow", scene, {
		mainTextureSamples: 4,
		blurKernelSize: 32,
	});
	glowLayer.intensity = 1;

	const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
	camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

	camera.minZ = 0.001;
	camera.maxZ = 100;

	camera.panningSensibility = 4000;
	camera.panningInertia = 0;
	camera.wheelPrecision = 1000;

	camera.lowerRadiusLimit = 0.0001;
	camera.upperRadiusLimit = 2;
	camera.lowerBetaLimit = Tools.ToRadians(0.01);
	camera.upperBetaLimit = Tools.ToRadians(90);
	camera.radius = 0.1;
	camera.alpha = -Math.PI / 2;
	camera.fov = 0.8;
	camera.useNaturalPinchZoom = true;

	scene.clearColor = new Color4(0, 0, 0, 1);

	setHDREnvironmentTextureFromURL(
		"https://cdn.jsdelivr.net/gh/felix-ops/website-assets/3d-assets/env/sunrise.env",
		scene,
	);

	// Read initial Zustand state
	const initial = useSolenoidStore.getState();

	const mu0 = 0.00000125663706144;
	let n = initial.coilTurns;
	let R = initial.solenoidRadius;
	let dL = initial.interCoilDistance;
	let r = R / 6;
	let x1 = (0.25 - n / 2) * dL;
	let current = 0;
	let coilResolution = 0.025;
	let currentDirection: 1 | -1 = initial.currentDirection;
	let targetCurrent = initial.current * currentDirection;
	let currentPath: Vector3[] = [];
	let points: number[] = new Array(75).fill(0);
	let sign: number[] = new Array(25).fill(0);

	// Target positions for text labels
	let northTextCatchupXPosition = 0;
	let southTextCatchupXPosition = 0;

	// Particle animation variables
	let currentParticleFrame = 0;
	let currentParticleSpeed = 0;
	const currentParticleSpeedMultiplier = 0.01;
	let path3d: Path3D;
	let currentParticles: AbstractMesh[] = [];
	let currentParticlesCount = n * 4 + 1;

	// Calibration variables
	let currentFrame = 0;
	let fpsSync = 75 / Math.round(scene.getEngine().getFps() || 60);

	const solenoidMat = new PBRMaterial("solenoidMat", scene);
	solenoidMat.albedoColor = new Color3(255 / 255, 170 / 255, 30 / 255);
	solenoidMat.roughness = 0;

	interface SolenoidOptions {
		path: Vector3[];
		radius: number;
		tessellation: number;
	}

	const createSolenoid = (options: SolenoidOptions, scene: Scene) => {
		const tube = MeshBuilder.CreateTube(
			"solenoid",
			{
				path: options.path,
				radius: options.radius,
				tessellation: options.tessellation,
				sideOrientation: Mesh.DOUBLESIDE,
				updatable: true,
			},
			scene,
		);

		const sphereStart = MeshBuilder.CreateSphere(
			"solenoidHead",
			{
				diameter: options.radius * 2,
				segments: 8,
			},
			scene,
		);
		const sphereEnd = MeshBuilder.CreateSphere(
			"solenoidTail",
			{
				diameter: options.radius * 2,
				segments: 8,
			},
			scene,
		);

		sphereStart.position = options.path[0];
		sphereEnd.position = options.path[options.path.length - 1];
		sphereStart.parent = tube;
		sphereEnd.parent = tube;

		tube.material = solenoidMat;
		sphereStart.material = solenoidMat;
		sphereEnd.material = solenoidMat;

		return tube;
	};

	const updateSolenoid = (mesh: Mesh, options: SolenoidOptions) => {
		scene.removeMesh(mesh, true);

		solenoid = MeshBuilder.CreateTube(
			"solenoid",
			{
				path: options.path,
				radius: options.radius,
				tessellation: options.tessellation,
				sideOrientation: Mesh.DOUBLESIDE,
				updatable: true,
			},
			scene,
		);

		const sphereStart = MeshBuilder.CreateSphere(
			"solenoidHead",
			{
				diameter: options.radius * 2,
				segments: 8,
			},
			scene,
		);
		const sphereEnd = MeshBuilder.CreateSphere(
			"solenoidTail",
			{
				diameter: options.radius * 2,
				segments: 8,
			},
			scene,
		);

		sphereStart.position = options.path[0];
		sphereEnd.position = options.path[options.path.length - 1];
		sphereStart.parent = solenoid;
		sphereEnd.parent = solenoid;

		solenoid.material = solenoidMat;
		sphereStart.material = solenoidMat;
		sphereEnd.material = solenoidMat;
	};

	const calculateSolenoidPath = (
		numTurns: number,
		radius: number,
		spacing: number,
		startX: number,
		res: number,
	): Vector3[] => {
		let l = startX;
		const offset = (startX + (startX + spacing * numTurns)) / 2;
		const path: Vector3[] = [];
		for (let i = 0; i < numTurns; i++) {
			for (let j = 0; j <= 1; j += res) {
				const theta = 2 * Math.PI * j;
				const p1 = new Vector3(l - offset, radius * Math.sin(theta), -radius * Math.cos(theta));
				path.push(p1);
				l += spacing * res;
			}
		}
		currentPath = path;
		path3d = new Path3D(currentPath);
		return path;
	};

	const calcSign = (i: number): number => {
		return 1.0 - 2.0 * Math.floor((2.0 * (((i - 1.0) / 2.0) % n)) / n);
	};

	const calcYPosition = (i: number): number => {
		return R * calcSign(i);
	};

	const calcXPosition = (i: number): number => {
		const modResult = (i - 1.0) % n;
		return dL * (modResult + 0.5 * Math.floor((2.0 * (((i - 1.0) / 2.0) % n)) / n) - 0.5 * (n - 0.5));
	};

	const solenoidOptions: SolenoidOptions = {
		path: calculateSolenoidPath(n, R, dL, x1, coilResolution),
		radius: r,
		tessellation: 20,
	};

	let solenoid = createSolenoid(solenoidOptions, scene);

	const plane = MeshBuilder.CreatePlane("plane", { size: 10 }, scene);

	Effect.ShadersStore["customVertexShader"] = `
		precision highp float;
		
		attribute vec3 position;
		attribute vec2 uv;
		
		uniform mat4 worldViewProjection;
		uniform mat4 world;
		
		varying vec3 worldPos;
		
		void main(void) {
			gl_Position = worldViewProjection * vec4(position, 1.0);
			worldPos = (world * vec4(position, 1.0)).xyz;
		}
	`;

	Effect.ShadersStore["customFragmentShader"] = `
		precision highp float;
		
		varying vec3 worldPos;
		
		uniform float mu0;
		uniform float pi;
		uniform float current;
		uniform float n;
		uniform float pointsRaw[75];
		uniform float sign[25];

		int pointsCount = 0;
		float strengthMultiplier = 0.7;
		vec2 points[25]; 

		void vec2PointsFromRawPoints(){
			for(int i = 0; i < pointsCount; i++){
				points[i].x = pointsRaw[i * 2];
				points[i].y = pointsRaw[i * 2 + 1];
			}
		} 

		float Sqr(float x) {
			return x * x;
		}
		
		float I(float direction) {
			return direction * current * strengthMultiplier;
		}
		
		float B(float worldX, float worldY) {
			float sum1 = 0.0;
			float sum2 = 0.0;
			
			for (int i = 0; i < pointsCount; i++) {
				float x = worldX + points[i].x;
				float y = worldY + points[i].y;
				float sign = float(sign[i]);

				float term1 = I(sign) * y / (pow(x, 2.0) + pow(y, 2.0));
				float term2 = I(sign) * x / (pow(x, 2.0) + pow(y, 2.0));

				sum1 += term1;
				sum2 += term2;
			}

			float magneticFieldMagnitude = (mu0 / (2.0 * pi)) * sqrt((pow(sum1, 2.0) + pow(sum2, 2.0)));
			return magneticFieldMagnitude;
		}
		
		float contours(float worldX, float worldY) {
			float sum = 0.0;
			
			for (int i = 0; i < pointsCount; i++) {
				float x = worldX + points[i].x;
				float y = worldY + points[i].y;
				float sign = float(sign[i]);

				float term = I(sign) / sqrt(pow(x, 2.0) + pow(y, 2.0));
				sum += term;
			}
			
			return (2.0 + cos(0.06 * pi * sum)) / 3.0;
		}
		
		void main(void) {
			pointsCount = 2 * int(n);
			vec2PointsFromRawPoints();

			float value = min(1.0, max(0.0, 12000.0 * B(worldPos.x, worldPos.y) * contours(worldPos.x, worldPos.y)));
		
			vec4 color;
			color.r = smoothstep(0.2, 0.7, value); 
			color.g = smoothstep(0.65, 0.9, value);
			color.b = smoothstep(0.0, 0.1, value); 
			color.a = smoothstep(0.0, 0.5, value); 

			gl_FragColor = color;
		}
	`;

	const shaderMaterial = new ShaderMaterial(
		"shader",
		scene,
		{ vertex: "custom", fragment: "custom" },
		{
			attributes: ["position", "normal", "uv"],
			uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time"],
		},
	);

	shaderMaterial.needAlphaBlending = () => true;
	shaderMaterial.alphaMode = Engine.ALPHA_COMBINE;

	plane.material = shaderMaterial;
	plane.material.backFaceCulling = false;

	shaderMaterial.setFloat("n", parseFloat(n.toString()));
	shaderMaterial.setFloat("mu0", parseFloat(mu0.toString()));
	shaderMaterial.setFloat("current", parseFloat(current.toString()));
	shaderMaterial.setFloat("pi", Math.PI);
	shaderMaterial.setFloats("pointsRaw", points);
	shaderMaterial.setFloats("sign", sign);

	await ImportMeshAsync(
		"https://cdn.jsdelivr.net/gh/felix-ops/website-assets/projects/004-magnetic-field-visualization/solenoid_models.glb",
		scene,
	);

	scene.meshes.forEach((mesh) => {
		mesh.rotationQuaternion = null;
	});

	const currentParticle = scene.getMeshByName("current_particle") as Mesh;
	const battery = scene.getMeshByName("battery") as AbstractMesh;
	const northText = scene.getMeshByName("north_text") as Mesh;
	const southText = scene.getMeshByName("south_text") as Mesh;
	const batteryNode1 = scene.getMeshByName("battery_Node1") as Mesh;
	const batteryNode2 = scene.getMeshByName("battery_Node2") as Mesh;
	let wire1: AbstractMesh;
	let wire2: AbstractMesh;

	battery.scaling = new Vector3(0.5, 0.5, 0.5);
	northText.scaling = new Vector3(0.1, 0.1, -0.1);
	southText.scaling = new Vector3(0.1, 0.1, -0.1);

	northText.renderingGroupId = 1;
	southText.renderingGroupId = 1;

	battery.position.y = -0.1;
	battery.position.z = 0.05;

	northText.rotation.x = Math.PI / 2;
	southText.rotation.x = Math.PI / 2;

	northText.billboardMode = Mesh.BILLBOARDMODE_ALL;
	southText.billboardMode = Mesh.BILLBOARDMODE_ALL;

	northText.position.x = -0.1;
	southText.position.x = 0.1;

	batteryNode1.computeWorldMatrix(true);
	batteryNode2.computeWorldMatrix(true);

	battery.getChildMeshes().forEach((mesh) => {
		mesh.isVisible = false;
	});

	const northTextMat = new PBRMaterial("northTextMat", scene);
	northTextMat.emissiveColor = new Color3(1, 0.2, 0);
	northTextMat.albedoColor = new Color3(0.9, 0.9, 0.9);
	northTextMat.specularIntensity = 0;
	northTextMat.metallic = 0;
	northTextMat.roughness = 1;
	northTextMat.emissiveIntensity = 0.75;

	const southTextMat = new PBRMaterial("southTextMat", scene);
	southTextMat.emissiveColor = new Color3(0, 0.2, 1);
	southTextMat.albedoColor = new Color3(0.9, 0.9, 0.9);
	southTextMat.specularIntensity = 0;
	southTextMat.metallic = 0;
	southTextMat.roughness = 1;
	southTextMat.emissiveIntensity = 0.75;

	northText.material = northTextMat;
	southText.material = southTextMat;

	currentParticle.position = new Vector3(0, 0, 0);
	currentParticle.scaling = new Vector3(0.15, 0.3, 0.15);
	currentParticle.rotationQuaternion = null;
	currentParticle.setParent(null);
	currentParticle.renderingGroupId = 1;

	const currentMat = new PBRMaterial("currentParticleMat", scene);
	currentMat.emissiveColor = new Color3(1, 0.6, 0);
	currentMat.albedoColor = new Color3(0.9, 0.9, 0.9);
	currentMat.specularIntensity = 0;
	currentMat.metallic = 0;
	currentMat.roughness = 1;
	currentMat.emissiveIntensity = 0.75;

	const wireMat = new PBRMaterial("wireMat", scene);
	wireMat.albedoColor = new Color3(255 / 255, 150 / 255, 90 / 255);
	wireMat.roughness = 0;

	currentParticle.material = currentMat;
	currentParticle.position = new Vector3(100000, 100000, 100000);

	for (let i = 0; i < currentParticlesCount; i++) {
		const clone = currentParticle.clone("currentParticle " + i, null) as Mesh;
		if (almostEqual(targetCurrent, 0, 0.01)) clone.isVisible = false;
		currentParticles.push(clone);
	}

	const updateWires = () => {
		wire1?.dispose();
		wire2?.dispose();

		let wire1Path: Vector3[];
		let wire2Path: Vector3[];

		if (currentDirection === 1) {
			wire1Path = [batteryNode1.getAbsolutePosition(), currentPath[0]];
			wire2Path = [batteryNode2.getAbsolutePosition(), currentPath[currentPath.length - 1]];
		} else {
			wire1Path = [batteryNode2.getAbsolutePosition(), currentPath[0]];
			wire2Path = [batteryNode1.getAbsolutePosition(), currentPath[currentPath.length - 1]];
		}

		wire1 = MeshBuilder.CreateTube(
			"wire1",
			{
				path: wire1Path,
				radius: 0.0007,
				tessellation: 20,
				sideOrientation: Mesh.DOUBLESIDE,
				updatable: true,
			},
			scene,
		);

		wire2 = MeshBuilder.CreateTube(
			"wire2",
			{
				path: wire2Path,
				radius: 0.0007,
				tessellation: 20,
				sideOrientation: Mesh.DOUBLESIDE,
				updatable: true,
			},
			scene,
		);
		wire1.material = wire2.material = wireMat;
		wire1.isVisible = false;
		wire2.isVisible = false;
	};

	// ─── Reactive Zustand Subscriptions ───
	const rebuildSolenoid = () => {
		x1 = (0.25 - n / 2) * dL;
		solenoidOptions.path = calculateSolenoidPath(n, R, dL, x1, coilResolution);
		updateSolenoid(solenoid, solenoidOptions);
		updateWires();
	};

	const unsubscribe = useSolenoidStore.subscribe((state, prevState) => {
		// Current or Direction changed
		if (state.current !== prevState.current || state.currentDirection !== prevState.currentDirection) {
			currentDirection = state.currentDirection;
			targetCurrent = state.current * currentDirection;

			if (almostEqual(0, targetCurrent, 0.001)) {
				currentParticles.forEach((particle) => {
					particle.isVisible = false;
				});
				northTextCatchupXPosition = 0;
				southTextCatchupXPosition = 0;
			} else {
				currentParticles.forEach((particle) => {
					particle.isVisible = true;
				});
				northTextCatchupXPosition = currentDirection * -0.1;
				southTextCatchupXPosition = currentDirection * 0.1;
			}

			if (state.currentDirection !== prevState.currentDirection) {
				battery.scaling.x *= -1;
			}
		}

		// Inter-coil distance changed
		if (state.interCoilDistance !== prevState.interCoilDistance) {
			dL = state.interCoilDistance;
			shaderMaterial.setFloat("dL", parseFloat(dL.toString()));
			rebuildSolenoid();
		}

		// Solenoid radius changed
		if (state.solenoidRadius !== prevState.solenoidRadius) {
			R = state.solenoidRadius;
			shaderMaterial.setFloat("R", parseFloat(R.toString()));
			rebuildSolenoid();
		}

		// Coil turns count changed
		if (state.coilTurns !== prevState.coilTurns) {
			n = state.coilTurns;
			shaderMaterial.setFloat("n", parseFloat(n.toString()));
			rebuildSolenoid();

			currentParticlesCount = n * 4 + 1;
			currentParticles.forEach((p) => p.dispose());
			currentParticles = [];
			for (let i = 0; i < currentParticlesCount; i++) {
				const clone = currentParticle.clone("currentParticle " + i, null) as Mesh;
				if (almostEqual(targetCurrent, 0, 0.01)) clone.isVisible = false;
				currentParticles.push(clone);
			}
		}
	});

	// Current Particle Animation loop
	scene.registerBeforeRender(() => {
		currentParticleFrame += currentParticleSpeed;
		let frameOffset = currentParticleFrame / currentParticles.length;
		frameOffset = frameOffset < 0 ? 1 + (frameOffset % 1) : frameOffset % 1;

		for (let i = 0; i < currentParticles.length; i++) {
			const point = path3d?.getPointAt((frameOffset + i / currentParticles.length) % 1);
			if (point) {
				currentParticles[i].position = point;
				const nextPoint = path3d.getPointAt((frameOffset + i / currentParticles.length + 0.001) % 1);
				currentParticles[i].lookAt(nextPoint, 0, -(Math.PI / 2) * currentDirection);
			}
		}
	});

	// Magnetism & Catchup loop
	scene.registerBeforeRender(() => {
		if (!almostEqual(current, targetCurrent, 0.001)) {
			currentParticleSpeed = targetCurrent * currentParticleSpeedMultiplier * fpsSync;
			const delta = targetCurrent - current;
			const smoothingFactor = 0.01;
			current += delta * smoothingFactor;
			shaderMaterial.setFloat("current", parseFloat(current.toString()));
		}

		if (!almostEqual(northTextCatchupXPosition, northText.position.x, 0.001)) {
			const delta = northTextCatchupXPosition - northText.position.x;
			northText.position.x += delta * 0.01;
		}

		if (!almostEqual(southTextCatchupXPosition, southText.position.x, 0.001)) {
			const delta = southTextCatchupXPosition - southText.position.x;
			southText.position.x += delta * 0.01;
		}

		northTextMat.alpha = mapRange(Math.abs(current), [0.001, 0.2], [0, 1]);
		southTextMat.alpha = mapRange(Math.abs(current), [0.001, 0.2], [0, 1]);

		// Calculate intersection points for solenoid and update shader
		points = [];
		sign = [];
		for (let i = 0; i < n * 2; i++) {
			points.push(parseFloat(calcXPosition(i + 1).toString()));
			points.push(parseFloat(calcYPosition(i + 1).toString()));
			sign.push(parseFloat(calcSign(i + 1).toString()));
		}
		shaderMaterial.setFloats("pointsRaw", points);
		shaderMaterial.setFloats("sign", sign);

		if (currentFrame % 120 === 0) {
			fpsSync = 75 / Math.round(scene.getEngine().getFps() || 60);
		}
		currentFrame = (currentFrame + 1) % 10000;
	});

	// Cleanup on scene disposal
	scene.onDisposeObservable.addOnce(() => {
		unsubscribe();
	});
};
