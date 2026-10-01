import { ArrowUpRight, Mail, Phone, type LucideIcon } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { SocialIcon } from "@/components/ui/social-icon";
import { channelNotes } from "@/content/contact";
import { activeSocialLinks, profile } from "@/lib/site";
import { cn } from "@/lib/utils";

/** "github.com/name" from "https://github.com/name/?x=1" — compact display for a URL. */
function displayUrl(href: string) {
  return href
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/[?#].*$/, "")
    .replace(/\/$/, "");
}

type ChannelCardProps = {
  label: string;
  icon: LucideIcon;
  value: string;
  href: string;
  note: string;
  copyLabel: string;
  primary?: boolean;
};

/** Whole card opens `href` (stretched link); the copy button sits above it. */
function ChannelCard({
  label,
  icon: Icon,
  value,
  href,
  note,
  copyLabel,
  primary,
}: ChannelCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-lg border bg-card p-6 transition-colors duration-200",
        primary ? "border-accent/40 hover:border-accent/70" : "hover:border-foreground/25",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="label-mono text-muted-foreground">{label}</h3>
        <CopyButton text={value} label={copyLabel} className="relative z-10 -my-3 -mr-3" />
      </div>
      <a
        href={href}
        className="mt-3 flex items-center gap-3 font-display text-xl font-medium tracking-tight wrap-anywhere transition-colors group-hover:text-accent after:absolute after:inset-0 after:rounded-lg lg:text-2xl xl:text-3xl"
      >
        <Icon aria-hidden className="size-5 shrink-0 text-accent" />
        {value}
      </a>
      <p className="mt-3 text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

export function ContactChannels() {
  return (
    <>
      <h2 id="channels-title" className="sr-only">
        Direct channels
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <ChannelCard
          primary
          label="Primary"
          icon={Mail}
          value={profile.email}
          href={`mailto:${profile.email}`}
          note={channelNotes.Email}
          copyLabel="Copy email address"
        />
        <ChannelCard
          label="Phone"
          icon={Phone}
          value={profile.phone}
          href={profile.phoneHref}
          note={channelNotes.Phone}
          copyLabel="Copy phone number"
        />

        {activeSocialLinks.length > 0 && (
          <div className="rounded-lg border bg-card p-6">
            <h3 className="label-mono text-muted-foreground">Public channels</h3>
            <ul className="mt-2 divide-y">
              {activeSocialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid min-h-11 grid-cols-[1.25rem_1fr_auto] items-center gap-3 py-3 sm:grid-cols-[1.25rem_8rem_1fr_auto]"
                  >
                    <SocialIcon icon={link.icon} className="text-accent" />
                    <span className="font-medium transition-colors group-hover:text-accent">
                      {link.label}
                    </span>
                    <span className="hidden truncate font-mono text-xs text-muted-foreground sm:block">
                      {displayUrl(link.href)}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 text-muted-foreground transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    />
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
