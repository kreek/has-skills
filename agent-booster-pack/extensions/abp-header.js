import path from "node:path";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const ACCENT = "\x1b[38;2;181;189;104m";
const DIM = "\x1b[2m";
const ANSI_PATTERN = /[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[a-zA-Z\d]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g;

const LOGO_LINES = [
  "    ___    ____  ____ ",
  "   /   |  / __ )/ __ \\",
  "  / /| | / __  / /_/ /",
  " / ___ |/ /_/ / ____/ ",
  "/_/  |_/_____/_/      ",
];

function plainLength(text) {
  return [...text.replace(ANSI_PATTERN, "")].length;
}

function center(text, width) {
  const length = plainLength(text);
  if (length >= width) return text;
  return `${" ".repeat(Math.floor((width - length) / 2))}${text}`;
}

function color(text, code) {
  return `${code}${text}${RESET}`;
}

function projectName() {
  return path.basename(process.cwd()) || "session";
}

export function renderAbpHeader(width, contextText) {
  const title = color("AGENT BOOSTER PACK", BOLD + ACCENT);
  const context = color(contextText, DIM);
  return [
    "",
    ...LOGO_LINES.map((line) => center(color(line, ACCENT), width)),
    center(title, width),
    center(context, width),
    "",
  ];
}

function installHeader(ctx) {
  ctx.ui.setHeader((tui) => ({
    render(width) {
      const model = ctx.model?.id ?? "no model selected";
      return renderAbpHeader(width, `${model} · ${projectName()}`);
    },
    invalidate() {
      tui.requestRender?.();
    },
  }));
}

export default function abpHeader(pi) {
  pi.on("session_start", (_event, ctx) => {
    if (!ctx.hasUI) return;
    installHeader(ctx);
  });

  pi.registerCommand("abp:header-on", {
    description: "Enable the ABP startup header",
    handler: async (_args, ctx) => {
      if (!ctx.hasUI) return;
      installHeader(ctx);
      ctx.ui.notify("ABP startup header enabled", "info");
    },
  });

  pi.registerCommand("abp:header-off", {
    description: "Restore pi's built-in startup header",
    handler: async (_args, ctx) => {
      if (!ctx.hasUI) return;
      ctx.ui.setHeader(undefined);
      ctx.ui.notify("Built-in header restored", "info");
    },
  });
}
