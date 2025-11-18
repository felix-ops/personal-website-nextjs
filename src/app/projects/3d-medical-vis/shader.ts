export const shaderVert = /*glsl*/ `
    precision highp float;
    
    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 worldViewProjection;
    uniform mat4 world;

    varying vec2 vUV; 
    varying vec3 vWorldPosition;

    void main(void) {
         vec4 worldPosition = world * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vUV = uv;
        gl_Position = worldViewProjection * vec4(position, 1.0);
    }
    `;
    
export const shaderFrag = /*glsl*/ `
    precision highp float;
    precision highp sampler3D;

    varying vec3 vWorldPosition;
    uniform vec3 u_cameraPosition;
    uniform sampler3D u_texture3D;
    uniform vec3 u_voxel_resolution;
    uniform vec3 u_voxel_spacing;
     uniform vec3 u_volume_size_world;

    // This is now a "per-voxel" opacity. You will likely need a smaller value.
    const float OPACITY_MULTIPLIER = 0.2; 
    // This is now just a safety break to prevent infinite loops, not a quality setting.
    const int MAX_STEPS = 512; // Should be >= resolution * sqrt(3)

    void main() {
        // The bounding box min/max points are defined in world space
        vec3 volumeMin = -u_volume_size_world / 2.0;
        vec3 volumeMax = u_volume_size_world / 2.0;

        // --- 1. INITIALIZATION PHASE (Amanatides & Woo) ---
        vec3 rayDir = normalize(vWorldPosition - u_cameraPosition);
        vec3 rayOrigin = u_cameraPosition;

        // Find the intersection range of the ray with the bounding box
        vec3 invDir = 1.0 / rayDir;
        vec3 tNearVec = (volumeMin - rayOrigin) * invDir;
        vec3 tFarVec = (volumeMax - rayOrigin) * invDir;
        vec3 tMinVec = min(tNearVec, tFarVec);
        vec3 tMaxVec = max(tNearVec, tFarVec);
        float tMin = max(max(tMinVec.x, tMinVec.y), tMinVec.z);
        float tFar = min(min(tMaxVec.x, tMaxVec.y), tMaxVec.z);

        if (tMin >= tFar) {
            discard;
            return;
        }
        // This prevents floating-point errors ("surface acne") at the entry point.
        tMin += 0.0001; 
        // The starting point of the traversal is on the bounding box surface
        vec3 entryPoint = rayOrigin + rayDir * tMin;
        
        // Convert the entry point from world space [-0.5, 0.5] to voxel grid space [0, resolution-1]
        // We clamp to ensure the starting voxel is valid.
        ivec3 currentVoxel = ivec3(floor(((entryPoint - volumeMin) / u_volume_size_world) * u_voxel_resolution));

        // Determine the direction of stepping (1 or -1) for each axis
        ivec3 rayStep = ivec3(sign(rayDir));

        // Calculate tDelta: the distance along the ray to traverse one voxel's width/height/depth.
        // This is done by projecting a world-space unit vector (1,1,1) scaled by voxel size onto the ray.
         vec3 tDelta = abs(invDir * (u_volume_size_world / u_voxel_resolution));

        // Calculate tMax: the distance to the NEXT voxel boundary.
        vec3 nextVoxelBoundary = volumeMin + ((vec3(currentVoxel) + step(0.0, rayDir)) / u_voxel_resolution) * u_volume_size_world;
        vec3 tMax = (nextVoxelBoundary - rayOrigin) * invDir;
        
        vec4 accumulatedColor = vec4(0.0);

        // --- 2. INCREMENTAL TRAVERSAL (The Loop) ---
        for (int i = 0; i < MAX_STEPS; i++) {
            // Sample the current voxel's center
            vec3 uvw = (vec3(currentVoxel) + 0.5) / u_voxel_resolution;
            float intensity = texture(u_texture3D, uvw).r;

            if (intensity > 0.1) {
                vec4 sampleColor;
                sampleColor.rgb = vec3(intensity);
                // The "thickness" of each sample is now 1 voxel, so opacity needs to be tuned accordingly
                sampleColor.a = intensity * OPACITY_MULTIPLIER;

                // Standard alpha compositing
                accumulatedColor.rgb += sampleColor.rgb * sampleColor.a * (1.0 - accumulatedColor.a);
                accumulatedColor.a += sampleColor.a * (1.0 - accumulatedColor.a);
            }

            // The core of the algorithm: step to the next voxel
            // We advance along the axis that has the smallest tMax.
            if (tMax.x < tMax.y && tMax.x < tMax.z) {
                currentVoxel.x += rayStep.x;
                tMax.x += tDelta.x;
            } else if (tMax.y < tMax.z) {
                currentVoxel.y += rayStep.y;
                tMax.y += tDelta.y;
            } else {
                currentVoxel.z += rayStep.z;
                tMax.z += tDelta.z;
            }

            // Exit conditions
            if (accumulatedColor.a > 0.99 || 
                currentVoxel.x < 0 || currentVoxel.x >= int(u_voxel_resolution.x) ||
                currentVoxel.y < 0 || currentVoxel.y >= int(u_voxel_resolution.y) ||
                currentVoxel.z < 0 || currentVoxel.z >= int(u_voxel_resolution.z)) {
                break;
            }
        }
        
        if (accumulatedColor.a == 0.0) {
            discard;
        }

        gl_FragColor = accumulatedColor;
    }
`;