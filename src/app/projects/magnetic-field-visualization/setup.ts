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

declare global {
	interface Window {
		state?: Record<string, unknown>;
		_updateState?: (next: Record<string, unknown>) => void;
	}
}

export const setup = async (scene: Scene, engine: Engine) => {
	const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

	// init simple global state bridge for UI controls
	const state: Record<string, unknown> = window.state ?? {
		current: 0,
		coilTurns: 5,
		solenoidRadius: 0.0125,
		interCoilDistance: 0.0109,
		currentDirection: 1,
		isCurrentUpdated: false,
		isCoilTurnsUpdated: false,
		isSolenoidRadiusUpdated: false,
		isInterCoilDistanceUpdated: false,
		isCurrentDirectionUpdated: false,
	};
	window.state = state;
	window._updateState = (next: Record<string, unknown>) => {
		for (const key of Object.keys(next)) {
			(state as any)[key] = next[key];
		}
	};
	const _updateState = (next: Record<string, unknown>) => {
		window._updateState?.(next);
	};
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

	//magnetic field variables
	const mu0 = 0.00000125663706144;
	let n = 6;
	let R = 0.01;
	let dL = (4 / 3) * R;
	let r = R / 6;
	let x1 = (0.25 - n / 2) * dL;
	let current = 0;
	let coilResolution = 0.025;
	let currentDirection = 1;
	let currentPath: Vector3[] = [];
	let points: number[] = new Array(75).fill(0);
	let sign: number[] = new Array(25).fill(0);

	//catchup variables
	let catchupCurrent = current;
	let northTextCatchupXPosition = 0;
	let southTextCatchupXPosition = 0;

	//current Particle Animation Vairables
	let currentParticleFrame = 0;
	let currentParticleSpeed = 0;
	let currentParticleSpeedMultiplier = 0.01;
	let path3d: Path3D;
	let currentParticles: AbstractMesh[] = [];
	let currentParticlesCount = 25;

	//calibration Variables
	let currentFrame = 0;
	let fpsSync = 75 / Math.round(scene.getEngine().getFps());

	let solenoidMat = new PBRMaterial("solenoidMat", scene);
	solenoidMat.albedoColor = new Color3(255 / 255, 170 / 255, 30 / 255);
	solenoidMat.roughness = 0;

	//solenoid
	interface SolenoidOptions {
		path: Vector3[];
		radius: number;

		tessellation: number;
	}

	// Create a solenoid
	let createSolenoid = (options: SolenoidOptions, scene: Scene) => {
		let tube = MeshBuilder.CreateTube(
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

		let sphereStart = MeshBuilder.CreateSphere(
			"solenoidHead",
			{
				diameter: options.radius * 2,
				segments: 8,
			},
			scene,
		);
		let sphereEnd = MeshBuilder.CreateSphere(
			"solenoidTail",
			{
				diameter: options.radius * 2,
				segments: 8,
			},
			scene,
		);

		// Position the sphere at the ends of the tube
		sphereStart.position = options.path[0];
		sphereEnd.position = options.path[options.path.length - 1];
		sphereStart.parent = tube;
		sphereEnd.parent = tube;

		tube.material = solenoidMat;
		sphereStart.material = solenoidMat;
		sphereEnd.material = solenoidMat;

		return tube;
	};

	let updateSolenoid = (mesh: Mesh, options: SolenoidOptions) => {
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

		let sphereStart = MeshBuilder.CreateSphere(
			"solenoidHead",
			{
				diameter: options.radius * 2,
				segments: 8,
			},
			scene,
		);
		let sphereEnd = MeshBuilder.CreateSphere(
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

		// Position the sphere at the ends of the tube
	};

	let calculateSolenoidPath = (n: number, R: number, dL: number, x1: number, coilResolution: number): Vector3[] => {
		let l = x1;
		let offset = (x1 + (x1 + dL * n)) / 2;
		let path: Vector3[] = [];
		for (let i = 0; i < n; i++) {
			for (let j = 0; j <= 1; j += coilResolution) {
				let theta = 2 * Math.PI * j;
				let p1 = new Vector3(l - offset, R * Math.sin(theta), -R * Math.cos(theta));
				path.push(p1);
				l += dL * coilResolution;
			}
		}
		currentPath = path;
		path3d = new Path3D(currentPath);
		return path;
	};

	let calcSign = (i: number): number => {
		return 1.0 - 2.0 * Math.floor((2.0 * (((i - 1.0) / 2.0) % n)) / n);
	};

	let calcYPosition = (i: number): number => {
		return R * calcSign(i);
	};

	let calcXPosition = (i: number): number => {
		const modResult = (i - 1.0) % n;
		return dL * (modResult + 0.5 * Math.floor((2.0 * (((i - 1.0) / 2.0) % n)) / n) - 0.5 * (n - 0.5));
	};

	// solenoid initial properties
	let solenoidOptions = {
		path: calculateSolenoidPath(n, R, dL, x1, coilResolution),
		radius: r,
		tessellation: 20,
	};

	// Create the solenoid
	let solenoid = createSolenoid(solenoidOptions, scene);

	// Create a plane for rendering the magnetic field created using shaders
	const plane = MeshBuilder.CreatePlane("plane", { size: 10 }, scene);

	// Define custom vertex and fragment shaders for magnetic field
	Effect.ShadersStore["customVertexShader"] = `
		precision highp float;
		
		// Attributes
		attribute vec3 position;
		attribute vec2 uv;
		
		// Uniforms
		uniform mat4 worldViewProjection;
		uniform mat4 world;
		
		// Varying
		varying vec3 worldPos;
		
		void main(void) {
			gl_Position = worldViewProjection * vec4(position, 1.0);
			worldPos = (world * vec4(position, 1.0)).xyz; // Calculate world coordinates
		}
		`;

	Effect.ShadersStore["customFragmentShader"] = `
		precision highp float;
		
		// Varying
		varying vec3 worldPos;
		
		// uniform sampler2D textureSampler;
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
			
			//for calculating magnetic field falloff curve
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
			
			//create oscillating contour pattern in smooth falloff
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

			//final calculated intensity for the pixel
			float value = min(1.0, max(0.0, 12000.0 * B(worldPos.x, worldPos.y) * contours(worldPos.x, worldPos.y)));
		
			// Define your color mapping logic below
			vec4 color;

			//for purple tint
			color.r = smoothstep(0.2, 0.7, value); 
			color.g = smoothstep(0.65, 0.9, value);
			color.b = smoothstep(0.0, 0.1, value); 
			color.a = smoothstep(0.0, 0.5, value); 

			//for yellow tint (optional color theme)
			// color.r = smoothstep(0.0, 0.1, value); 
			// color.g = smoothstep(0.05, 0.5, value);
			// color.b = smoothstep(0.5, 1.0, value); 
			// color.a = smoothstep(0.0, 0.25, value);

			//for ocean blue tint
			// color.r = smoothstep(0.8, 1.0, value); 
			// color.g = smoothstep(0.2, 0.6, value);
			// color.b = smoothstep(0.0, 0.1, value); 
			// color.a = smoothstep(0.0, 0.4, value);

			//for crimson red tint
			// color.r = smoothstep(0.0, 0.1, value); 
			// color.g = smoothstep(0.2, 0.7, value);
			// color.b = smoothstep(0.5, 1.0, value); 
			// color.a = smoothstep(0.0, 0.25, value);

			gl_FragColor = color;
		}
		

	
		`;

	// Create a ShaderMaterial using the custom shaders
	let shaderMaterial = new ShaderMaterial(
		"shader",
		scene,
		{
			vertex: "custom",
			fragment: "custom",
		},
		{
			attributes: ["position", "normal", "uv"],
			uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time"],
		},
	);

	// Enable alpha blending
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

	let currentParticle = scene.getMeshByName("current_particle");
	let battery = scene.getMeshByName("battery");
	let northText = scene.getMeshByName("north_text");
	let southText = scene.getMeshByName("south_text");
	let batteryNode1 = scene.getMeshByName("battery_Node1");
	let batteryNode2 = scene.getMeshByName("battery_Node2");
	let wire1: AbstractMesh;
	let wire2: AbstractMesh;

	for (let i = 0; i < currentParticlesCount; i++) {
		currentParticles?.push(currentParticle.clone("currentParticle " + i, null));
	}

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

	let updateWires = () => {
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

	(batteryNode1.material as PBRMaterial).alpha = 0;
	(batteryNode2.material as PBRMaterial).alpha = 0;
	(batteryNode1.material as PBRMaterial).roughness = 1;
	(batteryNode2.material as PBRMaterial).roughness = 1;
	(batteryNode1.material as PBRMaterial).specularIntensity = 0;
	(batteryNode2.material as PBRMaterial).specularIntensity = 0;

	let northTextMat = new PBRMaterial("northTextMat", scene);
	northTextMat.emissiveColor = new Color3(1, 0.2, 0);
	northTextMat.albedoColor = new Color3(0.9, 0.9, 0.9);
	northTextMat.specularIntensity = 0;
	northTextMat.metallic = 0;
	northTextMat.roughness = 1;
	northTextMat.emissiveIntensity = 0.75;

	let southTextMat = new PBRMaterial("southTextMat", scene);
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

	let currentMat = new PBRMaterial("currentParticleMat", scene);
	currentMat.emissiveColor = new Color3(1, 0.6, 0);
	currentMat.albedoColor = new Color3(0.9, 0.9, 0.9);
	currentMat.specularIntensity = 0;
	currentMat.metallic = 0;
	currentMat.roughness = 1;
	currentMat.emissiveIntensity = 0.75;

	let wireMat = new PBRMaterial("wireMat", scene);
	wireMat.albedoColor = new Color3(255 / 255, 150 / 255, 90 / 255);
	wireMat.roughness = 0;

	currentParticle.material = currentMat;
	currentParticle.position = new Vector3(100000, 100000, 100000);

	//Current Animation loop
	scene.registerBeforeRender(() => {
		currentParticleFrame += currentParticleSpeed;
		let frameOffset = currentParticleFrame / currentParticles.length;

		// Wrap around if frameOffset goes beyond 0 or 1
		frameOffset = frameOffset < 0 ? 1 + (frameOffset % 1) : frameOffset % 1;

		for (let i = 0; i < currentParticles.length; i++) {
			let point = path3d.getPointAt((frameOffset + i / currentParticles.length) % 1);
			if (point) {
				currentParticles[i].position = point;
				let nextPoint = path3d.getPointAt((frameOffset + i / currentParticles.length + 0.001) % 1);
				currentParticles[i].lookAt(nextPoint, 0, -(Math.PI / 2) * currentDirection);
			}
		}
	});

	// Magnetism loop
	scene.registerBeforeRender(() => {
		// run once when state is updated
		if (state["isCurrentUpdated"] as boolean) {
			catchupCurrent = (state["current"] as number) * currentDirection;

			if (almostEqual(0, catchupCurrent, 0.001) && currentParticles?.length !== 0) {
				currentParticles.forEach((particle) => {
					particle.isVisible = false;
				});
				northTextCatchupXPosition = 0;
				southTextCatchupXPosition = 0;
			} else if (currentParticles?.length !== 0) {
				currentParticles.forEach((particle) => {
					particle.isVisible = true;
				});
				northTextCatchupXPosition = currentDirection * -0.1;
				southTextCatchupXPosition = currentDirection * 0.1;
			}

			_updateState({
				isCurrentUpdated: false,
			});
		}
		if (state["isCurrentDirectionUpdated"] as boolean) {
			currentDirection = state["currentDirection"] as number;

			catchupCurrent *= -1;

			northTextCatchupXPosition = currentDirection * -0.1;
			southTextCatchupXPosition = currentDirection * 0.1;

			battery.scaling.x *= -1;

			_updateState({
				isCurrentDirectionUpdated: false,
			});
		}
		if (state["isInterCoilDistanceUpdated"] as boolean) {
			dL = state["interCoilDistance"] as number;
			shaderMaterial.setFloat("dL", parseFloat(dL.toString()));

			solenoidOptions.path = calculateSolenoidPath(n, R, dL, x1, coilResolution);

			updateSolenoid(solenoid, solenoidOptions);
			updateWires();

			_updateState({
				isInterCoilDistanceUpdated: false,
			});
		}
		if (state["isSolenoidRadiusUpdated"] as boolean) {
			R = state["solenoidRadius"] as number;
			shaderMaterial.setFloat("R", parseFloat(R.toString()));

			solenoidOptions.path = calculateSolenoidPath(n, R, dL, x1, coilResolution);
			updateSolenoid(solenoid, solenoidOptions);
			updateWires();

			_updateState({
				isSolenoidRadiusUpdated: false,
			});
		}
		if (state["isCoilTurnsUpdated"] as boolean) {
			n = state["coilTurns"] as number;
			shaderMaterial.setFloat("n", parseFloat(n.toString()));

			solenoidOptions.path = calculateSolenoidPath(n, R, dL, x1, coilResolution);
			updateSolenoid(solenoid, solenoidOptions);
			updateWires();

			currentParticlesCount = n * 4 + 1;
			if (currentParticles?.length !== 0) {
				currentParticles.forEach((particle) => {
					particle.dispose();
				});
				currentParticles = [];
				for (let i = 0; i < currentParticlesCount; i++) {
					currentParticles?.push(currentParticle.clone("currentParticle " + i, null));
					if (almostEqual(catchupCurrent, 0, 0.01)) currentParticles[i].isVisible = false;
				}
			}

			_updateState({
				isCoilTurnsUpdated: false,
			});
		}

		//catchup animations
		if (!almostEqual(current, catchupCurrent, 0.001)) {
			currentParticleSpeed = catchupCurrent * currentParticleSpeedMultiplier * fpsSync;
			let delta = catchupCurrent - current;
			let smoothingFactor = 0.01;
			current += delta * smoothingFactor;
			shaderMaterial.setFloat("current", parseFloat(current.toString()));
		}

		if (!almostEqual(northTextCatchupXPosition, northText.position.x, 0.001)) {
			let delta = northTextCatchupXPosition - northText.position.x;
			let smoothingFactor = 0.01;
			northText.position.x += delta * smoothingFactor;
		}

		if (!almostEqual(southTextCatchupXPosition, southText.position.x, 0.001)) {
			let delta = southTextCatchupXPosition - southText.position.x;
			let smoothingFactor = 0.01;
			southText.position.x += delta * smoothingFactor;
		}

		//runs every frame
		northText.material.alpha = mapRange(Math.abs(current), [0.001, 0.2], [0, 1]);
		southText.material.alpha = mapRange(Math.abs(current), [0.001, 0.2], [0, 1]);

		//calculate intersection points for solenoid and update shader
		points = [];
		sign = [];
		for (let i = 0; i < n * 2; i++) {
			points.push(parseFloat(calcXPosition(i + 1).toString()));
			points.push(parseFloat(calcYPosition(i + 1).toString()));
			sign.push(parseFloat(calcSign(i + 1).toString()));
		}
		shaderMaterial.setFloats("pointsRaw", points);
		shaderMaterial.setFloats("sign", sign);

		//Adaptive framesync
		if (currentFrame % 120 === 0) {
			fpsSync = 75 / Math.round(scene.getEngine().getFps());
		}
		currentFrame++;
		currentFrame %= 10000;
	});
};
