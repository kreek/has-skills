import type { ExtensionAPI, Theme } from "@earendil-works/pi-coding-agent";
import { truncateToWidth } from "@earendil-works/pi-tui";

function getLargeAbp(theme: Theme): string[] {
	const accent = (text: string) => theme.fg("accent", text);
	const muted = (text: string) => theme.fg("muted", text);
	const dim = (text: string) => theme.fg("dim", text);

	return [
		"",
		accent("     █████╗  ██████╗  ██████╗  🚀"),
		accent("    ██╔══██╗ ██╔══██╗ ██╔══██╗"),
		accent("    ███████║ ██████╔╝ ██████╔╝"),
		accent("    ██╔══██║ ██╔══██╗ ██╔═══╝ "),
		accent("    ██║  ██║ ██████╔╝ ██║     "),
		accent("    ╚═╝  ╚═╝ ╚═════╝  ╚═╝     "),
		"",
		muted("        Agent Booster Pack") + dim("  /hotkeys for shortcuts"),
	];
}

export default function (pi: ExtensionAPI) {
	pi.on("session_start", async (_event, ctx) => {
		if (!ctx.hasUI) return;

		ctx.ui.setHeader((_tui, theme) => ({
			render(width: number): string[] {
				return getLargeAbp(theme).map((line) => truncateToWidth(line, width));
			},
			invalidate() {},
		}));
	});

	pi.registerCommand("builtin-header", {
		description: "Restore the built-in Pi startup header",
		handler: async (_args, ctx) => {
			ctx.ui.setHeader(undefined);
			ctx.ui.notify("Built-in header restored", "info");
		},
	});
}
