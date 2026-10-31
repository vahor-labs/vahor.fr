import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = () =>
	Response.json(
		{ sha: process.env.APP_BUILD_SHA || null },
		{ headers: { "Cache-Control": "no-store" } },
	);
