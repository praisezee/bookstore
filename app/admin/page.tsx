"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
	const router = useRouter();

	useEffect(() => router.replace("/admin/dashboard"), []);
	return null;
};

export default page;
