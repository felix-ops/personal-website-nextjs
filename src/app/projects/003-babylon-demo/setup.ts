import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";

export const setup = (scene: Scene, engine: Engine) => {
	const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
	camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

	const light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
	const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
};
