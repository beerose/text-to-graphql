"use client";

import { useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import {
  DocumentDuplicateIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import TextInput from "../components/TextInput";

function App() {
  const [isDarkMode, setDarkMode] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | { type: "error"; message: string }
  >("idle");
  const [copied, setCopied] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState("");
  const [result, setResult] = useState("");

  const onPromptRun = async () => {
    if (status === "loading") return;
    if (!prompt) return;

    setStatus("loading");
    const result = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        schema,
      }),
    });

    const response = await result.json();

    if (
      response &&
      typeof response === "object" &&
      "errorMessage" in response
    ) {
      setStatus({ type: "error", message: response.errorMessage });
    } else {
      setStatus("success");
    }

    setResult(response.text);

    setTimeout(() => {
      setStatus("idle");
    }, 2000);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-700 w-full min-h-full p-7 flex flex-col items-center pb-8 justify-center">
      <DarkModeSwitch
        style={{
          marginBottom: "2rem",
          position: "absolute",
          top: 18,
          right: 20,
        }}
        checked={isDarkMode}
        onChange={() =>
          setDarkMode((prev) => {
            if (prev) document.documentElement.classList.remove("dark");
            else document.documentElement.classList.add("dark");
            return !prev;
          })
        }
        size={22}
      />
      <a
        className="absolute top-[19px] right-[55px]"
        href="https://github.com/beerose/text-to-graphql"
        target={"_blank"}
      >
        <svg
          className="h-[20px] w-[20px] text-black dark:text-gray-100"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          />
        </svg>
      </a>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 py-4">
        ✨ Text to GraphQL ✨
      </h1>
      <div className="sm:grid grid-cols-7 w-full h-full sm:h-[400px] lg:w-4/5">
        <div className="col-span-3 space-y-8">
          <TextInput
            placeholder="Enter your prompt here"
            label="Question"
            value={prompt}
            onChange={setPrompt}
          />
          <TextInput
            placeholder="Enter your schema here"
            label="GraphQL Schema"
            value={schema}
            onChange={setSchema}
          />
        </div>
        <div className="flex items-center justify-center">
          <button className="self-center" onClick={onPromptRun}>
            <PlayCircleIcon
              className={`${
                status === "loading" ? "animate-pulse" : ""
              } h-14 w-14 text-slate-700 hover:text-slate-800 dark:text-gray-100 transition ease-in-out hover:scale-105 duration-200 hover:[#131921] dark:hover:text-gray-50`}
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="col-span-3 bg-white rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 prose mt-[24px]  overflow-scroll">
          <pre className="h-[200px] sm:h-full w-full relative">
            <div className="absolute top-0 right-0">
              {copied && (
                <span className="text-xs absolute top-[12px] right-[33px]">
                  Copied!
                </span>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              >
                <DocumentDuplicateIcon
                  className="h-6 w-6 text-gray-300 m-2 hover:text-gray-100 transition ease-in-out hover:scale-105 duration-200"
                  aria-hidden="true"
                />
              </button>
            </div>
            {typeof status === "object" ? (
              <code
                className="text-red-400"
                style={{
                  // @ts-ignore
                  textWrap: "wrap",
                }}
              >
                {status.message}
              </code>
            ) : (
              <code
                className="text-gray-300"
                style={{
                  // @ts-ignore
                  textWrap: "wrap",
                }}
              >
                {result}
              </code>
            )}
          </pre>
        </div>
      </div>
      <footer className="text-gray-500 dark:text-gray-400 text-xs mt-4 absolute bottom-2">
        Made with ❤️ by{" "}
        <a
          className="text-gray-900 dark:text-gray-100 underline underline-offset-2"
          href="https://twitter.com/aleksandrasays"
          target="_blank"
        >
          Aleksandra
        </a>
      </footer>
    </div>
  );
}

export default App;
