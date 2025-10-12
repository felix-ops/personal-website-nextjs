import { applyMeshQuaternions, setHDREnvironmentTextureFromURL } from "@/lib/babylon-utils";
import { mapRange } from "@/lib/utils";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader.js";
import { Effect } from "@babylonjs/core/Materials/effect";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Tools } from "@babylonjs/core/Misc/tools";
import { PostProcess } from "@babylonjs/core/PostProcesses/postProcess";
import { Scene } from "@babylonjs/core/scene";

export const setup = async (scene: Scene, engine: Engine) => {
	const canvas = engine.getRenderingCanvas();

	const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
	// camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

	camera.minZ = 0.001;
	camera.maxZ = 100;

	camera.panningSensibility = 4000;
	camera.panningInertia = 0;
	camera.wheelPrecision = 1000;

	camera.lowerRadiusLimit = 0.0001;
	camera.upperRadiusLimit = 2;
	camera.lowerBetaLimit = Tools.ToRadians(0.01);
	camera.upperBetaLimit = Tools.ToRadians(90);
	camera.target = new Vector3(0, 1.61, 0);
	camera.alpha = -Math.PI / 2;
	camera.radius = 1.08;
	camera.fov = 0.4718;
	camera.useNaturalPinchZoom = true;

	scene.clearColor = Color4.FromHexString("#00000000");
	scene.imageProcessingConfiguration.toneMappingEnabled = true;
	scene.imageProcessingConfiguration.toneMappingType = 1;

	// Ensure proper transparency
	scene.autoClear = true;
	engine.setAlphaMode(Engine.ALPHA_COMBINE);

	// Disable fog for cleaner transparency
	scene.fogMode = Scene.FOGMODE_NONE;

	// const light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

	setHDREnvironmentTextureFromURL(
		"https://cdn.jsdelivr.net/gh/felix-ops/website-assets/3d-assets/env/small_studio.env",
		scene,
	);

	await ImportMeshAsync(
		"https://cdn.jsdelivr.net/gh/felix-ops/website-assets/projects/librarian-web-render/librarian-top.glb",
		scene,
	);

	applyMeshQuaternions(scene);

	//Meshes
	const lightPoint1 = scene.getMeshByName("lightPoint1");
	const lightPoint2 = scene.getMeshByName("lightPoint2");
	const character_parent = scene.getMeshByName("character_parent");

	//Materials
	const greenCapMat = scene.getMaterialByName("Green cap") as PBRMaterial;
	const greenDressMat = scene.getMaterialByName("Green parts") as PBRMaterial;
	const darkPartsMat = scene.getMaterialByName("DarkSkirt") as PBRMaterial;
	const collarMat = scene.getMaterialByName("LightParts") as PBRMaterial;
	const hairMat = scene.getMaterialByName("hair") as PBRMaterial;
	const skinMat = scene.getMaterialByName("skin") as PBRMaterial;

	greenCapMat.environmentIntensity = 0;
	greenDressMat.environmentIntensity = 0;
	darkPartsMat.environmentIntensity = 0;
	collarMat.environmentIntensity = 0;
	skinMat.environmentIntensity = 0;

	greenDressMat.directIntensity = 0;
	collarMat.directIntensity = 0;

	hairMat.albedoColor = Color3.FromHexString("#040302");
	hairMat.roughness = 0.8;

	skinMat.emissiveColor = Color3.FromHexString("#ffffff");

	lightPoint1.isVisible = false;
	lightPoint2.isVisible = false;

	//Lights
	const light1 = new PointLight("pointLight1", lightPoint1.getAbsolutePosition(), scene);
	const light2 = new PointLight("pointLight2", lightPoint2.getAbsolutePosition(), scene);

	light1.intensity = 5;
	light2.intensity = 4;

	//Post-Processing
	Effect.ShadersStore["customFragmentShader"] = `
	#ifdef GL_ES
	precision highp float;
	#endif
	
	varying vec2 vUV;
	uniform sampler2D textureSampler;
	uniform vec2 screenSize;
	uniform float pixelSize;
	
	const int paletteSize = 18;
	const vec3 palette[paletteSize] = vec3[](
		vec3(0.10, 0.10, 0.18),
		vec3(0.36, 0.09, 0.28),
		vec3(0.74, 0.27, 0.27),
		vec3(0.97, 0.52, 0.26),
		vec3(0.99, 0.81, 0.41),
		vec3(0.56, 0.91, 0.46),
		vec3(0.18, 0.67, 0.40),
		vec3(0.07, 0.53, 0.47),
		vec3(0.10, 0.27, 0.57),
		vec3(0.16, 0.40, 0.78),
		vec3(0.28, 0.55, 0.95),
		vec3(0.39, 0.85, 0.99),
		vec3(0.64, 0.83, 0.89),
		vec3(0.57, 0.70, 0.78),
		vec3(0.43, 0.53, 0.64),
		vec3(0.31, 0.40, 0.51),
		vec3(0.22, 0.28, 0.38),
		vec3(0.15, 0.20, 0.30)
	);
	
	vec3 getNearestPaletteColor(vec3 color) {
		float minDist = 1000.0;
		vec3 bestColor = palette[0];
		for (int i = 0; i < paletteSize; i++) {
			float d = distance(color, palette[i]);
			if (d < minDist) {
				minDist = d;
				bestColor = palette[i];
			}
		}
		return bestColor;
	}
	
	void main(void) {
		vec2 pixelUV = floor(vUV * screenSize / pixelSize) * pixelSize / screenSize;
		vec4 baseColor = texture2D(textureSampler, pixelUV);
		vec3 quantized = getNearestPaletteColor(baseColor.rgb);
		gl_FragColor = vec4(quantized, baseColor.a);
	}
	`;

	let postProcess = new PostProcess("Pixel Postprocessing", "custom", ["screenSize", "pixelSize"], null, 1.0, camera);

	postProcess.onApply = function (effect) {
		effect.setFloat2("screenSize", postProcess.width, postProcess.height);
		effect.setFloat("pixelSize", 3.0);
	};

	// Face the cursor
	let targetXRot = 0;
	let targetYRot = 0;

	scene.onPointerMove = function (evt) {
		const canvas = engine.getRenderingCanvas();
		const rect = canvas!.getBoundingClientRect();

		// Get mouse position relative to the canvas
		const mouseX = evt.clientX - rect.left;
		const mouseY = evt.clientY - rect.top;

		const normX = mouseX / rect.width;
		const normY = mouseY / rect.height;

		targetXRot = mapRange(normY, [0, 1], [Tools.ToRadians(-30), Tools.ToRadians(30)]);
		targetYRot = mapRange(normX, [0, 1], [Tools.ToRadians(-30), Tools.ToRadians(30)]);
	};

	// When mouse leaves the canvas — reset smoothly
	canvas?.addEventListener("mouseleave", () => {
		targetXRot = 0;
		targetYRot = 0;
	});

	// smoothing variables
	let smoothing = 0.05; // smaller = slower, smoother
	scene.onBeforeRenderObservable.add(() => {
		// Exponential smoothing (lerp)
		character_parent.rotation.x += (targetXRot - character_parent.rotation.x) * smoothing;
		character_parent.rotation.y += (targetYRot - character_parent.rotation.y) * smoothing;
	});
};
