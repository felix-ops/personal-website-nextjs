import { Scene } from "@babylonjs/core/scene";
import { Animation } from "@babylonjs/core/Animations/animation";
import { EasingFunction, CubicEase } from "@babylonjs/core/Animations/easing";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Animatable } from "@babylonjs/core/Animations/animatable";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";

export function animateVignetteWeight(scene: Scene, targetWeight: number, duration = 1) {
	// Get the imageProcessingConfiguration from the scene
	let ipc = scene.imageProcessingConfiguration;

	// Get the current vignetteWeight value
	let currentWeight = ipc.vignetteWeight;

	// Define animation parameters
	let framePerSecond = 30; // Consistent with the mesh animation
	let endFrame = framePerSecond * duration;

	// Create a new animation for the "vignetteWeight" property
	let animation = new Animation(
		"vignetteAnimation", // Animation name
		"vignetteWeight", // Target property to animate
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_FLOAT, // Animation type (float for vignetteWeight)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at current weight, end at target weight
	let keys = [
		{ frame: 0, value: currentWeight },
		{ frame: endFrame, value: targetWeight },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	let easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Start the animation on the imageProcessingConfiguration
	scene.beginDirectAnimation(ipc, [animation], 0, endFrame, false, 1);
}

export function animateMeshVisibility(mesh: AbstractMesh, targetVisibility: number, duration = 1) {
	// Get the scene from the mesh
	let scene = mesh.getScene();

	// Get the current visibility value
	let currentVisibility = mesh.visibility;

	// Define animation parameters
	let framePerSecond = 30; // Consistent with previous animations
	let endFrame = framePerSecond * duration;

	// Create a new animation for the "visibility" property
	let animation = new Animation(
		"visibilityAnimation", // Animation name
		"visibility", // Target property to animate
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_FLOAT, // Animation type (float for visibility)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at current visibility, end at target visibility
	let keys = [
		{ frame: 0, value: currentVisibility },
		{ frame: endFrame, value: targetVisibility },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	let easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Start the animation on the mesh
	let animatable = scene.beginDirectAnimation(mesh, [animation], 0, endFrame, false);

	return animatable;
}

export function animateMeshPosition(
	mesh: AbstractMesh,
	targetPosition: Vector3,
	startingPosition: Vector3 = mesh.getAbsolutePosition().clone(),
	duration = 1,
) {
	// Get the scene from the mesh
	let scene = mesh.getScene();

	// Clone the current position to avoid modifying it directly

	// Define animation parameters
	let framePerSecond = 30;
	let endFrame = framePerSecond * duration;

	// Create a new animation for the "position" property
	let animation = new Animation(
		"moveAnimation", // Animation name
		"position", // Target property to animate
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_VECTOR3, // Animation type (Vector3 for position)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at current position, end at target position
	let keys = [
		{ frame: 0, value: startingPosition },
		{ frame: endFrame, value: targetPosition },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	let easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Start the animation on the mesh
	let animatable = scene.beginDirectAnimation(mesh, [animation], 0, endFrame, false, 1);

	return animatable;
}

export function animateMeshRotation(mesh: AbstractMesh, targetRotation: Vector3, duration = 1): Animatable {
	// Get the scene from the mesh
	const scene: Scene = mesh.getScene();

	// Clone the current rotation to avoid modifying it directly
	const currentRotation: Vector3 = mesh.rotation.clone();

	// Define animation parameters
	const framePerSecond = 30;
	const endFrame = framePerSecond * duration;

	// Create a new animation for the "rotation" property
	const animation = new Animation(
		"meshRotationAnimation", // Animation name
		"rotation", // Target property to animate
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_VECTOR3, // Animation type (Vector3 for rotation)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at current rotation, end at target rotation
	const keys = [
		{ frame: 0, value: currentRotation },
		{ frame: endFrame, value: targetRotation },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	const easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Start the animation on the mesh and return the Animatable object
	const animatable = scene.beginDirectAnimation(mesh, [animation], 0, endFrame, false, 1);
	return animatable;
}

export function animateMeshScaling(mesh: AbstractMesh, targetScale: Vector3, duration = 1): Animatable {
	// Get the scene from the mesh
	const scene: Scene = mesh.getScene();

	// Clone the current scaling to avoid modifying it directly
	const currentScale: Vector3 = mesh.scaling.clone();

	// Define animation parameters
	const framePerSecond = 30;
	const endFrame = framePerSecond * duration;

	// Create a new animation for the "scaling" property
	const animation = new Animation(
		"meshScalingAnimation", // Animation name
		"scaling", // Target property to animate
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_VECTOR3, // Animation type (Vector3 for scaling)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at current scale, end at target scale
	const keys = [
		{ frame: 0, value: currentScale },
		{ frame: endFrame, value: targetScale },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	const easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Start the animation on the mesh and return the Animatable object
	const animatable = scene.beginDirectAnimation(mesh, [animation], 0, endFrame, false, 1);
	return animatable;
}

export function animateCameraPosition(camera: FreeCamera, targetPosition: Vector3, duration = 1) {
	// Get the scene from the camera
	let scene = camera.getScene();

	// Clone the current position to avoid modifying it directly
	let currentPosition = camera.position.clone();

	// Define animation parameters
	let framePerSecond = 30;
	let endFrame = framePerSecond * duration;

	// Create a new animation for the "position" property
	let animation = new Animation(
		"cameraPositionAnimation", // Animation name
		"position", // Target property to animate
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_VECTOR3, // Animation type (Vector3 for position)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at current position, end at target position
	let keys = [
		{ frame: 0, value: currentPosition },
		{ frame: endFrame, value: targetPosition },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	let easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Start the animation on the camera and return the Animatable object
	let animatable = scene.beginDirectAnimation(camera, [animation], 0, endFrame, false, 1);
	return animatable;
}

export function animateCameraRotation(camera: FreeCamera, targetRotation: Vector3, duration = 1) {
	// Get the scene from the camera
	let scene = camera.getScene();

	// Clone the current rotation to avoid modifying it directly
	let currentRotation = camera.rotation.clone();

	// Define animation parameters
	let framePerSecond = 30;
	let endFrame = framePerSecond * duration;

	// Create a new animation for the "rotation" property
	let animation = new Animation(
		"cameraRotationAnimation", // Animation name
		"rotation", // Target property to animate
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_VECTOR3, // Animation type (Vector3 for rotation)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at current rotation, end at target rotation
	let keys = [
		{ frame: 0, value: currentRotation },
		{ frame: endFrame, value: targetRotation },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	let easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Start the animation on the camera and return the Animatable object
	let animatable = scene.beginDirectAnimation(camera, [animation], 0, endFrame, false, 1);
	return animatable;
}

export function animateCameraTarget(camera: ArcRotateCamera, targetTarget: Vector3, duration = 1): Animatable {
	// Get the scene from the camera
	const scene: Scene = camera.getScene();

	// Clone the current target to avoid modifying it directly
	const currentTarget: Vector3 = camera.target.clone();

	// Define animation parameters
	const framePerSecond = 30;
	const endFrame = framePerSecond * duration;

	// Create a new animation for the "target" property
	const animation = new Animation(
		"cameraTargetAnimation", // Animation name
		"target", // Target property to animate
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_VECTOR3, // Animation type (Vector3 for target)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at current target, end at target target
	const keys = [
		{ frame: 0, value: currentTarget },
		{ frame: endFrame, value: targetTarget },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	const easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Start the animation on the camera and return the Animatable object
	const animatable = scene.beginDirectAnimation(camera, [animation], 0, endFrame, false, 1);
	return animatable;
}

export function animateCameraRadius(camera: ArcRotateCamera, targetRadius: number, duration = 1): Animatable {
	// Get the scene from the camera
	const scene: Scene = camera.getScene();

	// Get the current radius value
	const currentRadius: number = camera.radius;

	// Define animation parameters
	const framePerSecond = 30;
	const endFrame = framePerSecond * duration;

	// Create a new animation for the "radius" property
	const animation = new Animation(
		"cameraRadiusAnimation", // Animation name
		"radius", // Target property to animate
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_FLOAT, // Animation type (float for radius)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at current radius, end at target radius
	const keys = [
		{ frame: 0, value: currentRadius },
		{ frame: endFrame, value: targetRadius },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	const easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Start the animation on the camera and return the Animatable object
	const animatable = scene.beginDirectAnimation(camera, [animation], 0, endFrame, false, 1);
	return animatable;
}

export function animateCameraAlpha(camera: ArcRotateCamera, targetAlpha: number, duration = 1): Animatable {
	// Get the scene from the camera
	const scene: Scene = camera.getScene();

	// Get the current alpha value
	const currentAlpha: number = camera.alpha;

	// Define animation parameters
	const framePerSecond = 30;
	const endFrame = framePerSecond * duration;

	// Create a new animation for the "alpha" property
	const animation = new Animation(
		"cameraAlphaAnimation", // Animation name
		"alpha", // Target property to animate
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_FLOAT, // Animation type (float for alpha)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at current alpha, end at target alpha
	const keys = [
		{ frame: 0, value: currentAlpha },
		{ frame: endFrame, value: targetAlpha },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	const easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Start the animation on the camera and return the Animatable object
	const animatable = scene.beginDirectAnimation(camera, [animation], 0, endFrame, false, 1);
	return animatable;
}

export function animateCameraBeta(camera: ArcRotateCamera, targetBeta: number, duration = 1): Animatable {
	// Get the scene from the camera
	const scene: Scene = camera.getScene();

	// Get the current beta value
	const currentBeta: number = camera.beta;

	// Define animation parameters
	const framePerSecond = 30;
	const endFrame = framePerSecond * duration;

	// Create a new animation for the "beta" property
	const animation = new Animation(
		"cameraBetaAnimation", // Animation name
		"beta", // Target property to animate
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_FLOAT, // Animation type (float for beta)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at current beta, end at target beta
	const keys = [
		{ frame: 0, value: currentBeta },
		{ frame: endFrame, value: targetBeta },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	const easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Start the animation on the camera and return the Animatable object
	const animatable = scene.beginDirectAnimation(camera, [animation], 0, endFrame, false, 1);
	return animatable;
}

export function animateValue(
	callback: (value: number) => void,
	startValue: number,
	targetValue: number,
	scene: Scene,
	duration: number = 1,
): Animatable {
	// Define animation parameters
	const framePerSecond = 30;
	const endFrame = framePerSecond * duration;

	// Create a new animation for a generic "value" property
	const animation = new Animation(
		"valueAnimation", // Animation name
		"value", // Target property (generic)
		framePerSecond, // Frames per second
		Animation.ANIMATIONTYPE_FLOAT, // Animation type (float for single value)
		Animation.ANIMATIONLOOPMODE_CONSTANT, // No looping
	);

	// Define keyframes: start at startValue, end at targetValue
	const keys = [
		{ frame: 0, value: startValue },
		{ frame: endFrame, value: targetValue },
	];

	// Assign keyframes to the animation
	animation.setKeys(keys);

	// Add an easing function for smoother animation
	const easingFunction = new CubicEase();
	easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
	animation.setEasingFunction(easingFunction);

	// Create a dummy object to hold the animated value
	const valueHolder = { value: startValue };

	// Start the animation
	const animatable = scene.beginDirectAnimation(valueHolder, [animation], 0, endFrame, false, 1);

	// Update callback on each frame
	const observer = scene.onBeforeRenderObservable.add(() => {
		callback(valueHolder.value);
	});

	// Clean up and call callback with final value when animation ends
	animatable.onAnimationEnd = () => {
		callback(targetValue);
		scene.onBeforeRenderObservable.remove(observer);
	};

	return animatable;
}

export function setAnimationFrame(Anim: AnimationGroup, frame: number) {
	Anim.play();
	Anim.goToFrame(frame);
	Anim.pause();
}

export function Color4ToColor3(color4: Color4) {
	return new Color3(color4.r, color4.g, color4.b);
}
