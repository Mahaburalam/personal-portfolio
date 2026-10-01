import { ArrowUpRight } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { channelNotes } from "@/content/contact";
import { activeSocialLinks, profile } from "@/lib/site";

/** "github.com/name" from "https://github.com/name/" — compact display for a URL. */
function displayUrl(href: string) {
  return href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export function ContactChannels() {
  return (
    <div>
      <h2 id="channels-title" className="label-mono text-muted-foreground">
        Direct channels
      </h2>
      <ul className="mt-4 divide-y border-y">
        <li className="py-5">
          <p className="label-mono text-foreground/40">Email</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <a
              href={`mailto:${profile.email}`}
              className="min-w-0 truncate font-medium transition-colors hover:text-accent"
            >
              {profile.email}
            </a>
            <CopyButton text={profile.email} label="Copy email address" className="-mr-3" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{channelNotes.Email}</p>
        </li>

        {activeSocialLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start justify-between gap-4 py-5"
            >
              <span className="min-w-0">
                <span className="label-mono block text-foreground/40">{link.label}</span>
                <span className="mt-1 block truncate font-medium transition-colors group-hover:text-accent">
                  {displayUrl(link.href)}
                </span>
                {channelNotes[link.label] && (
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {channelNotes[link.label]}
                  </span>
                )}
              </span>
              <ArrowUpRight
                aria-hidden
                className="mt-5 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
