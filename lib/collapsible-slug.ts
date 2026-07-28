import { slug } from "github-slugger";

/**
 * Anchor id for a Collapsible drawer, derived from its title text.
 * Shared by the Collapsible component and the SEC search indexer so a
 * search result's href always lands on the drawer that produced it.
 */
export function collapsibleSlug(title: string): string {
  return slug(title);
}
