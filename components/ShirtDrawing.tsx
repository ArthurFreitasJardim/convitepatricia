"use client";
import {useId} from "react";
import type {Model} from "@/data/site";
export function ShirtDrawing({model}:{model:Model}){
  const id=useId().replace(/:/g,"");
  const shapes:Record<Model,string>={
    tradicional:"M36 31L53 19L62 24Q80 38 98 24L107 19L124 31L138 56L115 69L107 54L107 138L53 138L53 54L45 69L22 56Z",
    babyLook:"M39 29L56 19L62 24Q80 37 98 24L104 19L121 29L136 53L115 65L106 51Q97 84 107 121L113 138Q80 145 47 138L53 121Q63 84 54 51L45 65L24 53Z",
    infantil:"M45 32L60 24L66 27Q80 37 94 27L100 24L115 32L131 56L111 67L106 55L106 132L54 132L54 55L49 67L29 56Z"
  };
  return <svg viewBox="0 0 160 160" fill="none" aria-hidden="true" focusable="false"><defs><linearGradient id={id} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff8f4"/><stop offset="1" stopColor="#d4baba"/></linearGradient></defs><path d={shapes[model]} fill={`url(#${id})`} stroke="#c0a8a7" strokeWidth="1.8" strokeLinejoin="round"/><path d="M62 24Q80 42 98 24" stroke="#baa6a5" strokeWidth="2"/><path d="M58 132H102" stroke="#ebd8d5" strokeWidth="1.2"/><path d="M70 65H90" stroke="#cc9396" strokeWidth="1.2"/></svg>;
}
