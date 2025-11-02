"use client";

import { AnimatedSpan } from "../ui/animatedspan";

function storySetupSequence() {

}

export default function StoryBoard() {
  return (
    <div className="flex flex-col space-y-4">
      <span className="text-5xl">Adventure.AI</span>
      <AnimatedSpan text="Begin your next adventure..." />
    </div>
  );
}

