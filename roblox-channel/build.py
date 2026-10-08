"""Turn an episode file into the two Roblox scripts and a timing file for the edit.

    python3 build.py ep01
      -> dist/ep01/EpisodeServer.lua   paste into a Script in ServerScriptService
      -> dist/ep01/EpisodeClient.lua   paste into a LocalScript in StarterPlayer > StarterPlayerScripts
      -> dist/ep01/timeline.json       when each line / shot happens (used for music and editing)
"""
import importlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).parent
LEAD_IN = 5.0  # seconds of black screen before the first step (server waits for the client to load)


def lua(v, indent=0):
    pad = "\t" * indent
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return repr(round(v, 4))
    if isinstance(v, str):
        return json.dumps(v)  # JSON string escaping is valid Lua for these strings
    if isinstance(v, tuple) and len(v) == 3 and all(isinstance(x, (int, float)) for x in v):
        return "Vector3.new(%s)" % ", ".join(lua(x) for x in v)
    if isinstance(v, dict):
        items = ", ".join(f"{k} = {lua(x)}" for k, x in v.items())
        return "{ " + items + " }"
    if isinstance(v, (list, tuple)):
        if v and isinstance(v[0], list) and isinstance(v[0][0], str):  # list of steps
            return "{\n" + "".join(f"{pad}\t{lua(x)},\n" for x in v) + pad + "}"
        return "{ " + ", ".join(lua(x) for x in v) + " }"
    raise TypeError(type(v))


def timeline(steps):
    """Replay the blocking rules from the server script to find when each step starts."""
    t, out = LEAD_IN, []
    for s in steps:
        out.append({"t": round(t, 3), "step": s[0], "args": [list(a) if isinstance(a, tuple) else a for a in s[1:]]})
        if s[0] in ("say", "card", "announce"):
            t += s[3]
        elif s[0] == "fade":
            t += s[2]
        elif s[0] == "wait":
            t += s[1]
    return out, t


def main(ep_id):
    ep = importlib.import_module(f"episodes.{ep_id}")
    steps = ep.build_steps()
    # actors keep only what the server needs
    cast = [{k: v for k, v in c.items() if k != "color"} for c in ep.CAST]
    for c in cast:
        for key in ("skin", "shirt", "pants", "hairColor"):
            c[key] = list(c[key])
    server = (ROOT / "engine/server.lua").read_text()
    server = server.replace("--[[EPISODE_TITLE]]", ep.TITLE.replace('"', "'"))
    server = server.replace("--[[CAST]]", "{\n" + "".join(f"\t{lua(c)},\n" for c in cast) + "}")
    server = server.replace("--[[STEPS]]", lua(steps))
    colors = "{ " + ", ".join(f'{c["name"]} = Color3.fromRGB({c["color"][0]}, {c["color"][1]}, {c["color"][2]})'
                              for c in ep.CAST) + " }"
    client = (ROOT / "engine/client.lua").read_text().replace("--[[NAME_COLORS]]", colors)

    out = ROOT / "dist" / ep_id
    out.mkdir(parents=True, exist_ok=True)
    (out / "EpisodeServer.lua").write_text(server)
    (out / "EpisodeClient.lua").write_text(client)
    tl, end = timeline(steps)
    (out / "timeline.json").write_text(json.dumps({"title": ep.TITLE, "lead_in": LEAD_IN, "end": round(end, 3),
                                                   "steps": tl}, indent=1))
    print(f"{ep.TITLE}: {len(steps)} steps, runs {end - LEAD_IN:.1f}s after a {LEAD_IN:.0f}s lead-in -> {out}")


if __name__ == "__main__":
    sys.path.insert(0, str(ROOT))
    main(sys.argv[1] if len(sys.argv) > 1 else "ep01")
