import esbuild from "esbuild";

esbuild.build({
	entryPoints: ["src/server.ts"],
	bundle: true,
	platform: "node",
	outfile: "dist/server.js",
	external: ["mock-aws-s3", "aws-sdk", "nock"],
	loader: {
		".html": "text",
	},
});
