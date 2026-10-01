"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { duration, easeOutExpo } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const containers = { div: motion.div, ul: motion.ul, ol: motion.ol } as const;
const items = { div: motion.div, li: motion.li } as const;

const parent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const child: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easeOutExpo } },
};

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: keyof typeof containers;
};

/** Staggers its `StaggerItem` children in once, on entering the viewport. */
export function Stagger({ children, className, as = "div" }: StaggerProps) {
  const reduce = useReducedMotion();
  const Component = containers[as];

  return (
    <Component
      className={className}
      variants={parent}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </Component>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: keyof typeof items;
  id?: string;
};

export function StaggerItem({ children, className, as = "div", id }: StaggerItemProps) {
  const Component = items[as];

  return (
    <Component id={id} className={className} variants={child}>
      {children}
    </Component>
  );
}
