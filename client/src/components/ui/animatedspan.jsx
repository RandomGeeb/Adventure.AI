import { TypeAnimation } from "react-type-animation";
import { cn } from "@/lib/utils";

function AnimatedSpan({ className, text }) {
  return (
    <TypeAnimation
      sequence={text}
      wrapper="p"
      speed={50}
      style={{
        fontSize: "2em",
        display: "inline-block",
        whiteSpace: "pre-wrap",
      }}
      repeat={0}
      cursor={false}
      className={cn("text-2xl", className)}
    />
  );
}

export { AnimatedSpan };
