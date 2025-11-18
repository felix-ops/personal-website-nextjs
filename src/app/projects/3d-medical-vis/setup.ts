import { applyMeshQuaternions } from "@/lib/babylon-utils";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector2, Vector3, Vector4 } from "@babylonjs/core/Maths/math.vector";
import { Tools } from "@babylonjs/core/Misc/tools";
import { Scene } from "@babylonjs/core/scene";
import { shaderFrag, shaderVert } from "./shader";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Effect } from "@babylonjs/core/Materials/effect";
import { Texture } from "@babylonjs/core/Materials/Textures";
import { create3DTextureFromFlipbook } from "./utils";
import { PBRMaterial } from "@babylonjs/core";

export const setup = async (scene: Scene, engine: Engine) => {
	const canvas = engine.getRenderingCanvas();

	const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
	camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

	camera.minZ = 0.001;
	camera.maxZ = 100;

	camera.panningSensibility = 4000;
	camera.panningInertia = 0;
	camera.wheelPrecision = 500;

	camera.lowerRadiusLimit = 0.0001;
	camera.upperRadiusLimit = 20;
	camera.lowerBetaLimit = Tools.ToRadians(0.01);
	camera.upperBetaLimit = Tools.ToRadians(180);
	camera.target = new Vector3(0, 0, 0);
	camera.alpha = -Math.PI / 2;
	camera.radius = 2;
	camera.fov = 0.6;
	camera.useNaturalPinchZoom = true;

	scene.clearColor = Color4.FromHexString("#000000ff");
	scene.imageProcessingConfiguration.toneMappingEnabled = true;
	scene.imageProcessingConfiguration.toneMappingType = 1;

	// Ensure proper transparency
	scene.autoClear = true;
	engine.setAlphaMode(Engine.ALPHA_COMBINE);

	applyMeshQuaternions(scene);

	//Meshes

	//Materials

	//Shader Material

	Effect.ShadersStore["customFragmentShader"] = shaderFrag;
	Effect.ShadersStore["customVertexShader"] = shaderVert;

	const scanTexture2D = new Texture(
		"http://localhost:8000/projects/3D-Scan-Vis/scan.png",
		scene,
		false,
		true,
		Texture.NEAREST_NEAREST,
	);

	const scanTexture3D = await create3DTextureFromFlipbook("http://localhost:8000/projects/3D-Scan-Vis/scan.png", 16, scene)
	const volumeDimensions = new Vector3(256, 256, 256);
	const voxelSpacing = new Vector3(1.0, 0.7, 1.0);

		// Calculate the total physical size of the volume in world units
	const physicalSize = volumeDimensions.multiply(voxelSpacing);
	const maxDim = Math.max(physicalSize.x, physicalSize.y, physicalSize.z);
	
	// This is the final size of the bounding box in the world
	const volumeSizeWorld = new Vector3(
		physicalSize.x / maxDim,
		physicalSize.y / maxDim,
		physicalSize.z / maxDim
	);

	const shaderMaterial = new ShaderMaterial(
		"shader",
		scene,
		{
			vertex: "custom",
			fragment: "custom", 
		},
		{
			uniforms: ["worldViewProjection", "world", "u_time", "u_cameraPosition", "u_voxel_resolution", "u_volume_size_world"],
			attributes: ["position", "uv"],
			samplers: ["u_texture3D"],
		},
	);

	shaderMaterial.setTexture("u_texture3D", scanTexture3D);
	shaderMaterial.setVector3("u_voxel_resolution", volumeDimensions);
	shaderMaterial.setVector3("u_volume_size_world", volumeSizeWorld);
	

	let time = 0;
	scene.onBeforeRenderObservable.add(() => {
		time += engine.getDeltaTime() / 1000.0; // Increment time in seconds
		shaderMaterial.setFloat("u_time", time);
		shaderMaterial.setVector3("u_cameraPosition", camera.position);
	});


	let volumeBounds = MeshBuilder.CreateBox("volumeBounds");
	volumeBounds.scaling = volumeSizeWorld;

	volumeBounds.material = shaderMaterial;
	shaderMaterial.backFaceCulling = true;
	shaderMaterial.transparencyMode = 2;

};
