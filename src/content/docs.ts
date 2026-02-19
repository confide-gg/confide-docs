import apiReference from "./docs/api-reference.md?raw";
import gettingStarted from "./docs/getting-started.md?raw";

export interface DocPage {
	slug: string;
	content: string;
	body: string;
	title: string;
	description: string;
	headings: { id: string; label: string }[];
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();
}

function parseMd(slug: string, raw: string): DocPage {
	const lines = raw.split("\n");

	let title = slug;
	let description = "";
	const headings: { id: string; label: string }[] = [];
	const bodyLines: string[] = [];

	let foundTitle = false;
	let lookingForDescription = false;
	let pastFrontmatter = false;

	for (const line of lines) {
		if (!foundTitle && /^# /.test(line)) {
			title = line.replace(/^# /, "").trim();
			foundTitle = true;
			lookingForDescription = true;
			continue;
		}

		if (lookingForDescription) {
			if (line.trim() === "") continue;
			if (/^#/.test(line)) {
				lookingForDescription = false;
				pastFrontmatter = true;
			} else {
				description = line.trim();
				lookingForDescription = false;
				continue;
			}
		}

		if (foundTitle && !lookingForDescription) {
			pastFrontmatter = true;
		}

		if (pastFrontmatter) {
			bodyLines.push(line);
		}

		const h2Match = line.match(/^## (.+)/);
		if (h2Match) {
			const label = h2Match[1].trim();
			headings.push({ id: slugify(label), label });
		}
	}

	return {
		slug,
		content: raw,
		body: bodyLines.join("\n").trim(),
		title,
		description,
		headings,
	};
}

const sources: Record<string, string> = {
	"getting-started": gettingStarted,
	"api-reference": apiReference,
};

export const docs: DocPage[] = Object.entries(sources).map(([slug, raw]) =>
	parseMd(slug, raw),
);

export function getDoc(slug: string): DocPage | undefined {
	return docs.find((d) => d.slug === slug);
}
