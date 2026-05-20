const YEET_PROMPT = `Commit the current repository changes to a topic branch and push that branch. Never commit to or push \`main\` or \`master\`.

Steps:
1. Check the current branch. If it is \`main\` or \`master\`, create and switch to a new topic branch named with a type prefix (\`fix/\`, \`feature/\`, \`refactor/\`, or \`chore/\`) chosen from the nature of the changes. If already on a topic branch, stay on it.
2. Add all unstaged changes with \`git add -A\`.
3. Inspect the staged changes and write a concise commit message that accurately summarizes them.
4. Commit the changes with that message.
5. If this repository has no git remotes configured, stop after committing and report that there is no remote to push to.
6. Push the topic branch to \`origin\`, setting the upstream with \`git push -u origin <branch>\`.
7. Open a pull request for the branch into the default branch if the \`gh\` CLI is available; otherwise output the URL to open one. Do not merge it.
8. Output the normal remote repository URL.
   - Convert SSH git remotes like \`git@github.com:owner/repo.git\` to HTTPS URLs when printing.

Keep the commit message concise.`;

export function buildYeetPrompt(args = "") {
  const trimmed = args.trim();
  if (!trimmed) return YEET_PROMPT;

  return `${YEET_PROMPT}\n\nAdditional instructions from the user:\n${trimmed}`;
}

export default function yeetCommand(pi) {
  pi.registerCommand("yeet", {
    description: "Commit to a topic branch and push it for review (never commits to main)",
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
