const YEET_PROMPT = `Commit, merge, and push the current repository changes to main.

Steps:
1. Add all unstaged changes with \`git add -A\`.
2. Inspect the staged changes and write a concise commit message that accurately summarizes them.
3. Commit the changes with that message.
4. If this repository has no git remotes configured, do not push.
5. Switch to \`main\` and merge the committed branch into \`main\`.
6. Push \`main\` to \`origin main\`.
7. Output the normal remote repository URL.
   - Convert SSH git remotes like \`git@github.com:owner/repo.git\` to HTTPS URLs when printing.

Keep the commit message concise.`;

export function buildYeetPrompt(args = "") {
  const trimmed = args.trim();
  if (!trimmed) return YEET_PROMPT;

  return `${YEET_PROMPT}\n\nAdditional instructions from the user:\n${trimmed}`;
}

export default function abpYeetCommand(pi) {
  pi.registerCommand("yeet", {
    description: "Add, commit, and push the current repo changes",
    handler: async (args, ctx) => {
      const prompt = buildYeetPrompt(args ?? "");

      if (ctx.isIdle()) {
        pi.sendUserMessage(prompt);
        return;
      }

      pi.sendUserMessage(prompt, { deliverAs: "followUp" });
      ctx.ui.notify("Queued /yeet as a follow-up", "info");
    },
  });
}
