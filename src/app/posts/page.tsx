import { redirect } from "next/navigation";

export default function PostsRedirect() {
	redirect("/posts/all");
}
