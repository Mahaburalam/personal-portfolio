import { DIRECTION_ID, skillCategories, skillLinks } from "@/content/skills";
import { PatchScan } from "./patch-scan";
import { ResearchDirection } from "./research-direction";
import { SkillCategoryCard } from "./skill-category";
import { SkillsGraph, type GraphNode } from "./skills-graph";

/*
 * AI-first layout (owner's sketch), xl 12-col:
 *            [ AI / ML ]
 *   [ CV ]  [ Multimodal ] [ Research ]
 *   [    ]  [ research direction      ]
 *        [ Software Engineering ]
 *   [ Backend ] [ Database ] [ Frontend ] [ Tools ]   ← owner's priority order
 * md–lg: 2 columns (four children are too narrow below 1280px). Mobile: one column on a dashed spine.
 */
const placement: Record<string, string> = {
  "ai-ml": "md:col-span-2 xl:col-span-6 xl:col-start-4",
  "computer-vision": "xl:col-span-5 xl:col-start-1 xl:row-span-2",
  multimodal: "xl:col-span-4",
  research: "md:col-span-2 xl:col-span-3",
  [DIRECTION_ID]: "md:col-span-2 xl:col-span-7 xl:col-start-6",
  "software-engineering": "md:col-span-2 xl:col-span-8 xl:col-start-3",
  backend: "xl:col-span-3",
  data: "xl:col-span-3",
  frontend: "xl:col-span-3",
  tools: "xl:col-span-3",
};

/** The /skills ecosystem: server-rendered cards handed to the client graph as slots. */
export function SkillsEcosystem() {
  const nodes: GraphNode[] = skillCategories.map((category, i) => ({
    id: category.id,
    className: placement[category.id] ?? "xl:col-span-4",
    content: (
      <SkillCategoryCard
        category={category}
        index={i}
        // CV is the emphasized specialization: its tall xl card carries the patch motif
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
