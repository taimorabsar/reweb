"use client";

import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/utils";

interface TimeAgoProps {
  date: string;
  prefix?: string;
  className?: string;
}

// Calculated after the page loads, so the text never mismatches the server's version.
export default function TimeAgo({ date, prefix = "", className }: TimeAgoProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(timeAgo(date));
  }, [date]);

  return <span className={className}>{text ? `${prefix}${text}` : ""}</span>;
}