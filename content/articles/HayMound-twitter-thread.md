# Twitter / X thread: the Haystack Together mound

Velite only scans `.mdx`, so this file stays off the site. Copy-paste source.

Article: `https://hakanerunsal.com/articles/HayMound`

Media files are in `content/images/`. Web-encoded already, all well under X's limits.

---

**1/8** — media: `haymound_result.mp4`

Everyone's dropping "find the thing in a million individual pieces" demos right now.

Here's mine. A barn-sized haystack in UE5, about 250,000 straws, and you pull them
out one at a time.

None of them are stored. None of them go over the wire. How, without cooking
anyone's GPU:

---

**2/8** — media: `haymound_threepieces.jpg`

Three pieces, and not one of them is a mesh of hay.

1. the surface is a formula
2. a blanket of straws one band deep, 15 cm
3. a dark low-poly dome under the blanket

The dome makes the other two affordable. Real hay is full of holes, and you need
something behind them.

---

**3/8** — media: `haymound_descent.mp4`

The shape is a function, not geometry:

Dome(x,y) = Peak · (1 − t^Sharpness)^Shoulder

Emptying the pile is one integer cutting a ceiling through that dome. Not a
subtraction: subtract and the rim runs out first and the footprint creeps inward.

Crown flattens, skirt never moves.

---

**4/8** — no media

No array of straws exists anywhere.

They sit on a jittered lattice. Each site is an integer id, and one hash turns that
id into a position, a tilt and a blade variant.

Same integer, same blade, on every machine.

250,000 straws for 0 bytes of memory and 0 bytes of network.

---

**5/8** — media: `haymound_shell_only.jpg`

What's under the blanket. About 1,300 triangles and one draw call, standing in for
100k instances.

Inset 5 cm along the surface normal, not down in Z. Drop it in Z and the flat top
keeps its clearance while a steep flank loses most of it, and the dome pokes through
on the sides.

---

**6/8** — media: `haymound_slump.mp4`

Picking flat out in one spot, and no hole opens.

Every straw taken presses a dimple into the surface. The band re-derives that column
and more straws rise into it from below.

The dimple is narrow and deep. Spread it wide and one pluck pops a dozen straws a
metre away.

---

**7/8** — no media

Here's what cooks a GPU, and a draw call count won't show it.

Lumen on hardware RT makes every straw its own instance in the acceleration
structure. 138,000 of an 8-triangle card, rebuilt every frame.

Same 470 draw calls: 8 ms from one side of the barn, 64 ms from the other.

---

**8/8** — media: `haymound_gameplay.mp4`

Traversal costs by where the rays go, not what you submit.

The dome fixes it. Pull the straws out, leave the dome in, and Lumen sees a
haystack-shaped solid, not 138,000 needles. Same trick for shadows and distance.

More details in the article:
https://hakanerunsal.com/articles/HayMound

---

## Alt text for the media

- `haymound_result.mp4` — A person walking toward a barn-sized haystack, then the
  camera pushing in until individual straws fill the frame.
- `haymound_threepieces.jpg` — A cut through the mound with the analytic surface
  traced in green, the straw blanket in the band below it, and the low-poly inner
  shell in orange.
- `haymound_descent.mp4` — The inner shell alone in an editor viewport, its crown
  flattening into a table and sinking while the selection ring marking its footprint
  stays exactly the same width.
- `haymound_shell_only.jpg` — The inner shell alone in the barn with the straws
  culled away: a dark, smooth, low-poly dome with its crown cut off flat.
- `haymound_slump.mp4` — First person, picking straws out of the top of the pile as
  fast as the hands go, with the surface staying full.
- `haymound_gameplay.mp4` — Picking straws one at a time, loading them into a
  wheelbarrow, and walking around on top of the pile.

---

## Notes

- Tweet 7 is the strongest opener if you'd rather lead with the number instead of the
  trend. Open with 7, follow with 1, and the rest holds its order.
- `haymound_gameplay.mp4` is 22 s, the longest of the six. Trim it to the barrow beat
  if tweet 8 should read faster.
