import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsOpen(false);
		};
		if (isOpen) document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [isOpen]);

	const close = () => setIsOpen(false);

	return (
		<>
			<header
				className={`docs-header${scrolled || isOpen ? " is-scrolled" : ""}`}
			>
				<Link
					to="/docs/$slug"
					params={{ slug: "getting-started" }}
					className="docs-brand"
					onClick={close}
				>
					Confide Docs
				</Link>

				<nav className="docs-header-nav">
					<Link to="/docs/$slug" params={{ slug: "getting-started" }}>
						Getting Started
					</Link>
					<Link to="/docs/$slug" params={{ slug: "api-reference" }}>
						API Reference
					</Link>
				</nav>

				<button
					type="button"
					onClick={() => setIsOpen((v) => !v)}
					className="docs-menu-button"
					aria-label={isOpen ? "Close menu" : "Open menu"}
					aria-expanded={isOpen}
				>
					{isOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</header>

			<div className={`docs-mobile-menu${isOpen ? " is-open" : ""}`}>
				<Link
					to="/docs/$slug"
					params={{ slug: "getting-started" }}
					onClick={close}
				>
					Getting Started
				</Link>
				<Link
					to="/docs/$slug"
					params={{ slug: "api-reference" }}
					onClick={close}
				>
					API Reference
				</Link>
			</div>
		</>
	);
}
