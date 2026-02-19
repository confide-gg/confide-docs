import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { docs, getDoc } from "../../content/docs";

export const Route = createFileRoute("/docs/$slug")({
	component: DocsPage,
	head: ({ params }) => {
		const doc = getDoc(params.slug);
		const title = doc
			? `${doc.title} - Confide Docs`
			: "Not Found - Confide Docs";
		const description = doc?.description || "";

		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ name: "robots", content: "index, follow" },
				{ property: "og:type", content: "article" },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:site_name", content: "Confide Docs" },
				{ name: "twitter:card", content: "summary" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
			],
		};
	},
});

function DocsPage() {
	const { slug } = useParams({ from: "/docs/$slug" });
	const doc = getDoc(slug);

	if (!doc) {
		return (
			<div className="docs-layout">
				<main className="docs-main">
					<section className="docs-hero">
						<h1>Not Found</h1>
						<p className="docs-subtitle">This page doesn't exist.</p>
					</section>
				</main>
			</div>
		);
	}

	return (
		<div className="docs-layout">
			<aside className="docs-sidebar">
				<p className="docs-sidebar-label">Pages</p>
				<ul className="docs-sidebar-links">
					{docs.map((d) => (
						<li key={d.slug}>
							<Link
								to="/docs/$slug"
								params={{ slug: d.slug }}
								className={d.slug === slug ? "is-active" : ""}
							>
								{d.title}
							</Link>
						</li>
					))}
				</ul>

				<p className="docs-sidebar-label" style={{ marginTop: 28 }}>
					On this page
				</p>
				<ul className="docs-sidebar-links">
					{doc.headings.map((h) => (
						<li key={h.id}>
							<a href={`#${h.id}`}>{h.label}</a>
						</li>
					))}
				</ul>
			</aside>

			<main className="docs-main">
				<section className="docs-hero">
					<div className="docs-hero-top">
						<p className="docs-kicker">Confide Platform</p>
						<CopyMdButton content={doc.content} />
					</div>
					<h1>{doc.title}</h1>
					<p className="docs-subtitle">{doc.description}</p>
				</section>

				<article className="docs-content">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						rehypePlugins={[rehypeSlug]}
					>
						{doc.body}
					</ReactMarkdown>
				</article>
			</main>
		</div>
	);
}

function CopyMdButton({ content }: { content: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(content).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}, [content]);

	return (
		<button type="button" className="docs-copy-btn" onClick={handleCopy}>
			{copied ? <Check size={14} /> : <Copy size={14} />}
			{copied ? "Copied" : "Copy MD"}
		</button>
	);
}
