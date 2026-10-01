import { DIRECTION_ID, skillCategories, skillLinks } from "@/content/skills";
import { PatchScan } from "./patch-scan";
import { ResearchDirection } from "./research-direction";
import { SkillCategoryCard } from "./skill-category";
import { SkillsGraph, type GraphNode } from "./skills-graph";

/*
 * AI-first layout (owner's sketch), lg 12-col:
 *            [ AI / ML ]
 *   [ CV ]  [ Multimodal ] [ Research ]
 *   [    ]  [ research direction      ]
 *        [ Software Engineering ]
 *   [ Frontend ] [ Database ] [ Tools ]
 * md: 2 columns. Mobile: one column on a dashed spine.
 */
const placement: Record<string, string> = {
  "ai-ml": "md:col-span-2 lg:col-span-6 lg:col-start-4",
  "computer-vision": "lg:col-span-5 lg:col-start-1 lg:row-span-2",
  multimodal: "lg:col-span-4",
  research: "md:col-span-2 lg:col-span-3",
  [DIRECTION_ID]: "md:col-span-2 lg:col-span-7 lg:col-start-6",
  "software-engineering": "md:col-span-2 lg:col-span-8 lg:col-start-3",
  frontend: "lg:col-span-4",
  data: "lg:col-span-4",
  tools: "md:col-span-2 lg:col-span-4",
};

/** The /skills ecosystem: server-rendered cards handed to the client graph as slots. */
export function SkillsEcosystem() {
  const nodes: GraphNode[] = skillCategories.map((category, i) => ({
    id: category.id,
    className: placement[category.id] ?? "lg:col-span-4",
    content: (
      <SkillCategoryCard
        category={category}
        index={i}
        // CV is the emphasized specialization: its tall lg card carries the patch motif
        visual={category.id === "computer-vision" ? <PatchScan /> : undefined}
      />
    ),
  }));

  // The direction strip sits right after AI Research, under Multimodal + Research.
  const after = nodes.findIndex((node) => node.id === "research") + 1;
  nodes.splice(after, 0, {
    id: DIRECTION_ID,
    className: placement[DIRECTION_ID],
    content: <ResearchDirection />,
  });

  return <SkillsGraph nodes={nodes} links={skillLinks} />;
}
