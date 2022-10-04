/// <reference types="vitest" />
import * as path from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import Unocss from "unocss/vite";
import { presetAttributify, presetUno } from "unocss";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    Vue(),
    VueJsx(),
    Unocss({
      presets: [presetUno(), presetAttributify()],
    }),
  ],
});
