"use client";

import BabylonScene from "@/components/organisms/babylon-renderer";
import { setup } from "./setup";

export default function BabylonDemo() {
	return (
		<div>
			<BabylonScene className="w-full h-screen" onSceneReady={setup} debug={true} />
		</div>
	);
}
