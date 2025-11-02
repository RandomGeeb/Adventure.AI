"use client";

import React, { useState, useEffect } from "react";
import { AnimatedSpan } from "@/components/ui/animatedspan";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export default function Home() {
  const form = useForm({
    defaultValues: {
      userInput: "",
    },
  });

  const [sequences, setSequences] = useState([
    {
      text: `Choose your next adventure...  \n 1. Fantasy 🧙‍♂️ \n 2. Cyberpunk 🤖 \n 3. Sci-Fi 🚀`,
      placeholder: "Choose your genre... (1, 2, or 3)",
    },
  ]);

  const [animationKey, setAnimationKey] = useState(0);

  function onSubmit(data) {
    if (sequences.length === 1) {
      setSequences((prev) => [
        ...prev,
        {
          text: "You chose your genre! Now, describe your character. Go crazy, give us the lore! The childhood tragedy, a heartbroken romance, or a secret superpower...",
          placeholder: "Describe your character...",
        },
      ]);
      setAnimationKey((prev) => prev + 1);
    } else {
      setSequences((prev) => [
        ...prev,
        {
          text: data.userInput,
          placeholder: "Please wait...",
        },
      ]);
      setAnimationKey((prev) => prev + 1);
    }
    form.reset();
  }
  useEffect(() => {
    // Future logic to update sequences based on user interaction can be added here
  }, [sequences]);

  return (
    <div className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-between py-32 px-16 sm:items-start">
      <div className="flex flex-col space-y-4">
        <span className="text-5xl">Adventure.AI</span>
        <AnimatedSpan
          key={animationKey}
          text={sequences[sequences.length - 1].text}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="userInput"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={sequences[sequences.length - 1].placeholder}
                    className="bg-white/20 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30 text-white text-[24px]! h-32"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
