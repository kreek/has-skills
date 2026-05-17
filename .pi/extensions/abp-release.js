const YEET_PROMPT = `Commit, merge, and push the current repository changes to main.

Steps:
1. Stay on the current topic branch for the initial commit.
2. Add all unstaged changes with \`git add -A\`.
3. Inspect the staged changes and write a concise commit message that accurately summarizes them.
4. Commit the changes with that message.
5. If this repository has no git remotes configured, do not push.
6. Switch to \`main\` and merge the topic branch into \`main\`.
7. Bump the version if the merged changes require it.
8. Commit the version bump on \`main\` if one was needed.
9. Push \`main\` to \`origin main\`.
10. Output the normal remote repository URL.
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
