import { createSwaggerSpec } from "next-swagger-doc";

export function getApiDocs() {
	const spec = createSwaggerSpec({
		apiFolder: "src/app/api",
		definition: {
			openapi: "3.0.0",
			info: {
				title: "MindVault API Documentation",
				version: "1.0.0",
				description: "API documentation for MindVault application",
			},
			security: [],
		},
	});
	return spec;
}
