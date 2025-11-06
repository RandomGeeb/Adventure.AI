"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { TypeAnimation } from "react-type-animation";
import { Navigation, Eclipse } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [genre, setGenre] = useState(1);
  const [loadingApi, setLoadingApi] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [reading, setReading] = useState(true);

  const [sequences, setSequences] = useState([
    {
      text: `Choose your next adventure...  \n 1. Fantasy 🧙‍♂️ \n 2. Cyberpunk 🤖 \n 3. Sci-Fi 🚀`,
      placeholder: "Choose your genre... (1, 2, or 3)",
    },
  ]);

  const form = useForm({
    defaultValues: {
      userInput: "",
    },
    resolver: async (values) => {
      const errors = {};
      if (sequences.length === 1) {
        if (
          !values.userInput.trim() ||
          !["1", "2", "3"].includes(values.userInput.trim())
        ) {
          errors.userInput = {
            type: "pattern",
            message: "Cmon, just choose 1, 2, or 3 😒",
          };
        }
      } else {
        if (!values.userInput.trim()) {
          errors.userInput = {
            type: "required",
            message: "It's an interactive story, interactive. 😐",
          };
        } else if (values.userInput.length > 500) {
          errors.userInput = {
            type: "maxLength",
            message: "Holy Yap 🥱, type a lil' less please",
          };
        }
      }
      return { values: Object.keys(errors).length ? {} : values, errors };
    },
  });

  async function playVoice(text) {
    setLoadingApi(true);
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("TTS API error");
      setLoadingApi(false);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onplay = () => {
        setAnimationKey((prev) => prev + 1);
        setReading(true);
      };
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setReading(false);
      };
      audio.onerror = () => {
        console.error("Audio playback error");
        setReading(false);
      };

      await audio.play();
    } catch (error) {
      console.error("playVoice error:", error);
      setReading(false);
      setLoadingApi(false);
    }
  }

  async function onSubmit(data) {
    if (sequences.length === 1) {
      setGenre(parseInt(data.userInput.trim()));
      const nextText =
        "Now that you've chosen your genre, describe your character. Go crazy, give us the lore! The childhood tragedy, a heartbroken romance, or a secret superpower...";
      setSequences((prev) => [
        ...prev,
        { text: nextText, placeholder: "Describe your character..." },
      ]);
      const creationAudio = new Audio("/assets/character-creation.mp3");

      creationAudio.onplay = () => {
        setAnimationKey((prev) => prev + 1);
        setReading(true);
      };
      creationAudio.onended = () => {
        URL.revokeObjectURL("/assets/character-creation.mp3");
        setReading(false);
      };
      creationAudio.onerror = () => {
        console.error("Audio playback error");
        setReading(false);
      };

      creationAudio.play();
    } else {
      let promptResponse;
      if (sequences.length === 2) {
        setLoadingApi(true);
        try {
          const response = await fetch("/api/setup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              StoryType: genre,
              CharacterDescription: data.userInput,
            }),
          });

          if (!response.ok) {
            console.error("API error", await response.text());
            return;
          }

          const responseData = await response.json();
          
          promptResponse = responseData;
        } catch (error) {
          console.error("Error during story setup:", error);
          setLoadingApi(false);
          return;
        }
      } else {
        setLoadingApi(true);
        try {
          const response = await fetch("/api/write-prompt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Content: data.userInput,
            }),
          });

          if (!response.ok) {
            console.error("API error", await response.text());
            return;
          }

          const responseData = await response.json();
          promptResponse = responseData;
        } catch (error) {
          console.error("Error during story setup:", error);
          setLoadingApi(false);
          return;
        }
      }
      setLoadingApi(false);
      setSequences((prev) => [
        ...prev,
        { text: promptResponse, placeholder: "Type your response..." },
      ]);
      await playVoice(promptResponse);
    }
    form.reset();
  }

  async function onStart() {
    setStarted(true);
    const introAudio = new Audio("/assets/intro.mp3");

    introAudio.onplay = () => {
      setAnimationKey((prev) => prev + 1);
      setReading(true);
    };
    introAudio.onended = () => {
      URL.revokeObjectURL("/assets/intro.mp3");
      setReading(false);
    };
    introAudio.onerror = () => {
      console.error("Audio playback error");
      setReading(false);
    };

    introAudio.play();
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-b from-[#111] to-[#2b2c4d] text-white relative overflow-hidden">
      <AnimatePresence>
        {!started && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c1a]"
            onClick={() => onStart()}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-6xl md:text-8xl font-bold tracking-tight select-none"
            >
              Aldrich.Ai
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 text-lg text-gray-400"
            >
              click anywhere to begin your journey
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {started && (
          <motion.div
            className="flex flex-col w-full max-w-5xl mx-auto justify-between py-20 px-10"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col space-y-4"
            >
              <span className="text-5xl font-bold">Aldrich.Ai</span>
              {loadingApi ? (
                <TypeAnimation
                  sequence={[
                    "Processing.",
                    2000,
                    "Processing..",
                    2000,
                    "Processing...",
                    2000,
                    "Processing..",
                  ]}
                  wrapper="p"
                  speed={70}
                  style={{
                    fontSize: "1.8em",
                    display: "inline-block",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.4em",
                  }}
                  repeat={Infinity}
                  cursor={false}
                />
              ) : (
                <TypeAnimation
                  key={animationKey}
                  sequence={[
                    sequences[sequences.length - 1].text,
                    () => setReading(false),
                  ]}
                  wrapper="p"
                  speed={70}
                  style={{
                    fontSize: "1.8em",
                    display: "inline-block",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.4em",
                  }}
                  repeat={0}
                  cursor={false}
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="w-full mt-16"
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full relative"
                >
                  {form.formState.errors.userInput && (
                    <div className="text-red-500 text-2xl mb-1 animate-in fade-in slide-in-from-top-1">
                      {form.formState.errors.userInput.message}
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="userInput"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            disabled={reading || loadingApi}
                            placeholder={
                              sequences[sequences.length - 1].placeholder
                            }
                            className={`resize-none bg-white/20 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30 text-white text-[24px]! transition-all duration-500 ease-in-out p-3 ${
                              sequences.length !== 1 && !loadingApi
                                ? "h-48"
                                : "h-12"
                            } ${
                              form.formState.errors.userInput
                                ? "border-red-500"
                                : ""
                            }`}
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
                  {reading || loadingApi ? (
                    <Button className="absolute right-4 bottom-2 size-12">
                      <Eclipse className="animate-pulse size-6" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="absolute right-4 bottom-2 size-12 bg-[#2b2c4d] hover:bg-[#6F70AE] transition-colors duration-300"
                    >
                      <Navigation className="size-6 mt-1" />
                    </Button>
                  )}
                </form>
              </Form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}