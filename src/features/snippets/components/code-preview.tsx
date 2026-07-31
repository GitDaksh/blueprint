"use client";

import ShikiHighlighter from "react-shiki";

interface CodePreviewProps {
  code: string;
  language: string;
}

export function CodePreview({ code, language }: CodePreviewProps) {
  return (
    <ShikiHighlighter
      language={language}
      theme={{ light: "github-light", dark: "github-dark" }}
      defaultColor="light-dark()"
      className="rounded-lg text-sm [&_pre]:p-4"
    >
      {code}
    </ShikiHighlighter>
  );
}