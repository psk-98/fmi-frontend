import { createServer } from "node:http";

const port = Number(process.env.MOCK_API_PORT ?? 4010);
const origin = `http://127.0.0.1:${port}`;
const token = "e2e-token";

const seededUser = {
	id: 1,
	name: "Naledi Mokoena",
	email: "naledi@fmi.test",
	role: "user",
	storage_used_bytes: 1_536_000,
	storage_quota_bytes: 1_073_741_824,
	storage_remaining_bytes: 1_072_205_824,
	created_at: "2026-09-01T08:00:00.000Z",
};

function image(overrides) {
	return {
		uid: "image-processed",
		url: `${origin}/images/portrait.svg`,
		original_name: "portrait-one.jpg",
		mime_type: "image/jpeg",
		width: 1200,
		height: 900,
		file_size: 512_000,
		celebrity_name: null,
		description: "A processed portrait",
		tags: [],
		face_count: 1,
		processing_status: "processed",
		moderation_status: "approved",
		is_public: true,
		processed_at: "2026-09-09T10:05:00.000Z",
		created_at: "2026-09-09T10:00:00.000Z",
		...overrides,
	};
}

function seededGalleries() {
	return [
		{
			uid: "gallery-a",
			name: "Portrait Studies",
			description: "Individual and group portrait experiments.",
			visibility: "private",
			owner: seededUser,
			images_count: 2,
			images: [
				image({}),
				image({
					uid: "image-failed",
					url: `${origin}/images/group.svg`,
					original_name: "group-failed.jpg",
					description: "A group frame awaiting another processing pass",
					face_count: 4,
					processing_status: "failed",
					moderation_status: "pending",
					is_public: false,
					processed_at: null,
					created_at: "2026-09-10T11:00:00.000Z",
				}),
			],
			created_at: "2026-09-08T09:00:00.000Z",
			updated_at: "2026-09-10T11:00:00.000Z",
		},
		{
			uid: "gallery-b",
			name: "Archive Nights",
			description: "Public evening-event archive.",
			visibility: "public",
			owner: seededUser,
			images_count: 0,
			images: [],
			created_at: "2026-08-20T18:00:00.000Z",
			updated_at: "2026-08-20T18:00:00.000Z",
		},
	];
}

let currentUser;
let galleries;

function resetState() {
	currentUser = structuredClone(seededUser);
	galleries = seededGalleries();
}

resetState();

function sendJson(response, status, payload) {
	response.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store",
	});
	response.end(JSON.stringify(payload));
}

function sendEmpty(response, status = 204) {
	response.writeHead(status);
	response.end();
}

async function readJson(request) {
	const chunks = [];
	for await (const chunk of request) chunks.push(chunk);
	if (!chunks.length) return {};

	try {
		return JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		return {};
	}
}

function isAuthenticated(request) {
	return request.headers.authorization === `Bearer ${token}`;
}

function findGallery(uid) {
	return galleries.find((gallery) => gallery.uid === uid);
}

function findImage(uid) {
	for (const gallery of galleries) {
		const found = gallery.images.find((candidate) => candidate.uid === uid);
		if (found) return { gallery, image: found };
	}
	return null;
}

function requireAuthentication(request, response) {
	if (isAuthenticated(request)) return true;
	sendJson(response, 401, { message: "Unauthenticated." });
	return false;
}

function sendSvg(response, kind) {
	const colors =
		kind === "group" ? ["#0f172a", "#38bdf8"] : ["#082f49", "#a7f3d0"];
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><defs><linearGradient id="g"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs><rect width="1200" height="900" fill="url(#g)"/><circle cx="600" cy="350" r="180" fill="#f8fafc" fill-opacity=".82"/><rect x="330" y="555" width="540" height="260" rx="130" fill="#f8fafc" fill-opacity=".72"/></svg>`;
	response.writeHead(200, {
		"content-type": "image/svg+xml",
		"cache-control": "public, max-age=3600",
	});
	response.end(svg);
}

const server = createServer(async (request, response) => {
	const url = new URL(request.url ?? "/", origin);
	const path = url.pathname;
	const method = request.method ?? "GET";

	if (path === "/health") return sendJson(response, 200, { ok: true });
	if (path === "/__reset" && method === "POST") {
		resetState();
		return sendJson(response, 200, { ok: true });
	}
	if (path === "/images/portrait.svg") return sendSvg(response, "portrait");
	if (path === "/images/group.svg") return sendSvg(response, "group");

	if (path === "/api/v1/auth/login" && method === "POST") {
		const input = await readJson(request);
		if (input.password === "wrong-password") {
			return sendJson(response, 422, {
				message: "The supplied credentials are invalid.",
				errors: { email: ["The supplied credentials are invalid."] },
			});
		}
		return sendJson(response, 200, { token, user: currentUser });
	}

	if (path === "/api/v1/auth/register" && method === "POST") {
		const input = await readJson(request);
		currentUser = {
			...currentUser,
			name: input.name,
			email: input.email,
		};
		return sendJson(response, 201, {
			token,
			user: { ...currentUser, role: null },
		});
	}

	if (path === "/api/v1/auth/me") {
		if (!requireAuthentication(request, response)) return;
		return sendJson(response, 200, { data: currentUser });
	}

	if (path === "/api/v1/galleries" && method === "GET") {
		return sendJson(response, 200, {
			data: galleries.filter((gallery) => gallery.visibility === "public"),
		});
	}

	if (path === "/api/v1/me/galleries" && method === "GET") {
		if (!requireAuthentication(request, response)) return;
		return sendJson(response, 200, { data: galleries });
	}

	const ownedGalleryMatch = path.match(/^\/api\/v1\/me\/galleries\/([^/]+)$/);
	if (ownedGalleryMatch && method === "GET") {
		if (!requireAuthentication(request, response)) return;
		const gallery = findGallery(ownedGalleryMatch[1]);
		return gallery
			? sendJson(response, 200, { data: gallery })
			: sendJson(response, 404, { message: "Gallery not found." });
	}

	const gallerySearchMatch = path.match(
		/^\/api\/v1\/galleries\/([^/]+)\/images\/search$/,
	);
	if (gallerySearchMatch && method === "POST") {
		if (!requireAuthentication(request, response)) return;
		const gallery = findGallery(gallerySearchMatch[1]);
		const result = gallery?.images.find(
			(candidate) => candidate.processing_status === "processed",
		);
		return sendJson(response, 200, {
			data: result ? [{ ...result, similarity: 0.93 }] : [],
		});
	}

	const galleryUploadMatch = path.match(
		/^\/api\/v1\/galleries\/([^/]+)\/images$/,
	);
	if (galleryUploadMatch && method === "POST") {
		if (!requireAuthentication(request, response)) return;
		request.resume();
		const gallery = findGallery(galleryUploadMatch[1]);
		if (!gallery)
			return sendJson(response, 404, { message: "Gallery not found." });
		const uploaded = image({
			uid: `image-uploaded-${Date.now()}`,
			original_name: "new-image.png",
			processing_status: "pending",
			moderation_status: "pending",
			face_count: 0,
			is_public: false,
			processed_at: null,
			created_at: "2026-09-11T09:00:00.000Z",
		});
		gallery.images.unshift(uploaded);
		gallery.images_count = gallery.images.length;
		return sendJson(response, 201, { data: [uploaded] });
	}

	const galleryReprocessMatch = path.match(
		/^\/api\/v1\/galleries\/([^/]+)\/reprocess$/,
	);
	if (galleryReprocessMatch && method === "POST") {
		if (!requireAuthentication(request, response)) return;
		return sendJson(response, 202, {
			message: "Gallery images queued for processing.",
		});
	}

	const galleryMatch = path.match(/^\/api\/v1\/galleries\/([^/]+)$/);
	if (galleryMatch) {
		const gallery = findGallery(galleryMatch[1]);
		if (!gallery)
			return sendJson(response, 404, { message: "Gallery not found." });
		if (method === "GET") {
			return gallery.visibility === "public"
				? sendJson(response, 200, { data: gallery })
				: sendJson(response, 403, { message: "This gallery is private." });
		}
		if (!requireAuthentication(request, response)) return;
		if (method === "PATCH") {
			const input = await readJson(request);
			gallery.visibility = input.visibility ?? gallery.visibility;
			return sendJson(response, 200, { data: gallery });
		}
		if (method === "DELETE") {
			galleries = galleries.filter(
				(candidate) => candidate.uid !== gallery.uid,
			);
			return sendEmpty(response);
		}
	}

	const ownedImageMatch = path.match(/^\/api\/v1\/me\/images\/([^/]+)$/);
	if (ownedImageMatch && method === "GET") {
		if (!requireAuthentication(request, response)) return;
		const found = findImage(ownedImageMatch[1]);
		return found
			? sendJson(response, 200, { data: found.image })
			: sendJson(response, 404, { message: "Image not found." });
	}

	const imageReprocessMatch = path.match(
		/^\/api\/v1\/images\/([^/]+)\/reprocess$/,
	);
	if (imageReprocessMatch && method === "POST") {
		if (!requireAuthentication(request, response)) return;
		return sendJson(response, 202, { message: "Image queued for processing." });
	}

	const imageMatch = path.match(/^\/api\/v1\/images\/([^/]+)$/);
	if (imageMatch) {
		const found = findImage(imageMatch[1]);
		if (!found) return sendJson(response, 404, { message: "Image not found." });
		if (method === "GET") {
			return found.image.is_public
				? sendJson(response, 200, { data: found.image })
				: sendJson(response, 403, { message: "This image is private." });
		}
		if (method === "DELETE") {
			if (!requireAuthentication(request, response)) return;
			found.gallery.images = found.gallery.images.filter(
				(candidate) => candidate.uid !== found.image.uid,
			);
			found.gallery.images_count = found.gallery.images.length;
			return sendEmpty(response);
		}
	}

	return sendJson(response, 404, {
		message: `No mock route for ${method} ${path}`,
	});
});

server.listen(port, "127.0.0.1", () => {
	process.stdout.write(`FMI mock API listening on ${origin}\n`);
});
