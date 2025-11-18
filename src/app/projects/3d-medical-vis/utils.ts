import { Engine } from "@babylonjs/core/Engines/engine";
import { Texture } from "@babylonjs/core/Materials/Textures";
import { RawTexture3D } from "@babylonjs/core/Materials/Textures/rawTexture3D";
import { Scene } from "@babylonjs/core/scene";

/**
 * Loads a 2D flipbook image and rearranges its pixels into a 3D texture.
 * @param url The URL of the 2D sprite sheet.
 * @param tileCount The number of tiles per row/column (e.g., 16 for a 16x16 grid).
 * @param scene The Babylon.js scene.
 * @returns A promise that resolves with the RawTexture3D.
 */
export async function create3DTextureFromFlipbook(url: string, tileCount: number, scene: Scene): Promise<RawTexture3D> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (!context) {
                return reject(new Error("Could not get 2D context from canvas."));
            }

            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            const sourceData = context.getImageData(0, 0, img.width, img.height).data;

            const tileWidth = img.width / tileCount;
            const tileHeight = img.height / tileCount;
            const depth = tileCount * tileCount;

            // Create a new buffer for the 3D texture data.
            const texture3DData = new Uint8Array(tileWidth * tileHeight * depth * 4);

            // Loop through each frame of the flipbook
            for (let k = 0; k < depth; k++) {
                const sourceCol = k % tileCount;
                const sourceRow = Math.floor(k / tileCount);

                // Loop through pixels within the tile
                for (let j = 0; j < tileHeight; j++) {
                    for (let i = 0; i < tileWidth; i++) {

                        // Calculate index for the source 2D image data
                        const sourcePixelX = sourceCol * tileWidth + i;
                        const sourcePixelY = sourceRow * tileHeight + j;
                        const sourceIndex = (sourcePixelY * img.width + sourcePixelX) * 4;

                        // Calculate index for the destination 3D texture data
                        const destIndex = (j * tileWidth * tileHeight + k * tileWidth + i) * 4;

                        // Copy RGBA values
                        texture3DData[destIndex + 0] = sourceData[sourceIndex + 0];
                        texture3DData[destIndex + 1] = sourceData[sourceIndex + 1];
                        texture3DData[destIndex + 2] = sourceData[sourceIndex + 2];
                        texture3DData[destIndex + 3] = sourceData[sourceIndex + 3];
                    }
                }
            }

            // Create the RawTexture3D from the rearranged data
            const tex3D = new RawTexture3D(
                texture3DData,
                tileWidth,
                tileHeight,
                depth,
                Engine.TEXTUREFORMAT_RGBA,
                scene,
                false, // no mipmaps
                false,  // invert Y
                Texture.LINEAR_LINEAR // Use NEAREST for sharp pixels
            );
            resolve(tex3D);
        };
        img.onerror = (err) => reject(err);
        img.src = url;
    });
}