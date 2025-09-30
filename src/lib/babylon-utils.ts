import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Scene } from "@babylonjs/core/scene";

export function applyMeshQuaternions(scene: Scene) {
	for (let mesh of scene.meshes) {
		let rotationTemp = mesh.rotationQuaternion?.toEulerAngles();

		if (rotationTemp) {
			mesh.rotationQuaternion = null;
			mesh.rotation = rotationTemp;
		}

		if (mesh.name === "__root__") {
			mesh.rotation.y = 0;
		}
		mesh.computeWorldMatrix();
	}
}

/**
 * Sets the given HDR texture as the environment texture for the scene.
 * This is used for Image-Based Lighting (IBL), affecting reflections
 * and overall scene illumination.
 *
 * @param hdrTextureURL The url of the prefiltered .env texture.
 *                      You can create prefiltered textures from standard .hdr images
 *                      using the Babylon.js IBL tools: https://www.babylonjs.com/tools/ibl/
 * @param scene The Babylon.js scene to apply the environment texture to.
 */
export const setHDREnvironmentTextureFromURL = (hdrTextureURL: string, scene: Scene): void => {
	// Return early if the URL is empty or invalid to avoid errors.
	if (!hdrTextureURL || hdrTextureURL.trim().length === 0) {
		console.warn("HDR texture URL is invalid.");
		// Optionally, you can clear the existing environment texture.
		// scene.environmentTexture = null;
		return;
	}

	// Create a cube texture from the prefiltered .env file URL.
	const hdrTexture = CubeTexture.CreateFromPrefilteredData(hdrTextureURL, scene);

	// Set the texture as the scene's environment texture.
	scene.environmentTexture = hdrTexture;
};
