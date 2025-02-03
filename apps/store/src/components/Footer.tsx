import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground border-t border-border py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-copy-light text-sm text-center">
          Made with{" "}
          <Heart className="w-4 h-4 inline-block mx-1 text-primary fill-primary" />{" "}
          by{" "}
          <Link
            href="https://github.com/omarsaouri"
            target="_blank"
            rel="noopener noreferrer"
            className="text-copy hover:text-primary transition-colors"
          >
            Omar Saouri
          </Link>
        </p>
      </div>
    </footer>
  );
}
