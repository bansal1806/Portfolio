"""Trace a scanned signature into ordered pen strokes for components/Signature.jsx.

Usage:  pip install numpy pillow scipy scikit-image skan
        python scripts/trace-signature.py signature.png signature.svg out_dir
        then copy out_dir/strokes.json to src/data/signature.json
  signature.png — the signature in blue ink on transparent (any size; ink is detected by colour)
  signature.svg — a vector trace of the same image (its blue-filled paths become the ink)

1. ink mask from the blue signature PNG
2. skeletonize → 1px centreline, split into segments with skan
3. join segments through junctions by picking the straightest continuation
4. drop tiny spurs, orient + order strokes left→right, smooth into cubic Béziers
Outputs strokes.json (stroke paths + lengths + suggested mask width) and debug.png.
"""
import json
import math
import re
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from skan import Skeleton
from skimage.morphology import skeletonize, remove_small_objects, binary_closing, disk

src_png, src_svg, out_dir = sys.argv[1:4]

img = np.asarray(Image.open(src_png).convert("RGBA")).astype(int)
r, g, b, a = img[..., 0], img[..., 1], img[..., 2], img[..., 3]
ink = (a > 60) & (b > r + 40) & (b > g + 20)
ink = binary_closing(ink, disk(2))
ink = remove_small_objects(ink, 60)

dist = ndi.distance_transform_edt(ink)
skel = skeletonize(ink)
sk = Skeleton(skel)

# ---- segments between junctions/endpoints -------------------------------------------
segments = []
for i in range(sk.n_paths):
    coords = sk.path_coordinates(i)  # (row, col)
    if len(coords) < 2:
        continue
    pts = [(float(c[1]), float(c[0])) for c in coords]  # → (x, y)
    segments.append(pts)


def length(pts):
    return sum(math.dist(pts[k], pts[k + 1]) for k in range(len(pts) - 1))


def key(p):
    return (round(p[0]), round(p[1]))


# Which segments touch each endpoint location (junction clusters can span a few pixels).
ends = {}
for si, s in enumerate(segments):
    for end in (0, -1):
        ends.setdefault(key(s[end]), []).append((si, end))

# Remove short spurs: segments < 18px with a free (degree-1) end.
def degree(p):
    k = key(p)
    return len(ends.get(k, []))

keep = []
for si, s in enumerate(segments):
    if length(s) < 18 and (degree(s[0]) == 1 or degree(s[-1]) == 1):
        continue
    keep.append(s)
segments = keep
ends = {}
for si, s in enumerate(segments):
    for end in (0, -1):
        ends.setdefault(key(s[end]), []).append((si, end))


def direction(pts, at_end, span=14):
    """Unit vector pointing *out of* the segment at the given end."""
    if at_end == 0:
        a_, b_ = pts[min(span, len(pts) - 1)], pts[0]
    else:
        a_, b_ = pts[max(-span - 1, -len(pts))], pts[-1]
    dx, dy = b_[0] - a_[0], b_[1] - a_[1]
    n = math.hypot(dx, dy) or 1
    return dx / n, dy / n


# ---- pair segments at each junction: straightest continuation wins ------------------
partner = {}  # (seg, end) -> (seg, end)
for k, members in ends.items():
    if len(members) < 2:
        continue
    cands = []
    for i in range(len(members)):
        for j in range(i + 1, len(members)):
            (s1, e1), (s2, e2) = members[i], members[j]
            if s1 == s2:
                continue
            d1 = direction(segments[s1], e1)
            d2 = direction(segments[s2], e2)
            # going out of s1 then into s2: straight means d1 ≈ -d2
            straightness = -(d1[0] * d2[0] + d1[1] * d2[1])
            cands.append((straightness, members[i], members[j]))
    cands.sort(reverse=True)
    used = set()
    for st, m1, m2 in cands:
        if m1 in used or m2 in used or st < -0.2:
            continue
        partner[m1] = m2
        partner[m2] = m1
        used.update([m1, m2])

# ---- chain segments into strokes -----------------------------------------------------
visited = set()
strokes = []


def walk(start_seg, start_end):
    """Walk from a segment end that has no partner, following partners."""
    pts = []
    seg, entry = start_seg, start_end
    while seg is not None and seg not in visited:
        visited.add(seg)
        s = segments[seg]
        oriented = s if entry == 0 else s[::-1]
        pts.extend(oriented if not pts else oriented[1:])
        exit_end = -1 if entry == 0 else 0
        nxt = partner.get((seg, exit_end))
        if nxt is None:
            break
        seg, entry = nxt
    return pts


# Start from free ends first, then any leftover loops.
for si in range(len(segments)):
    for end in (0, -1):
        if si not in visited and (si, end) not in partner:
            pts = walk(si, end)
            if pts:
                strokes.append(pts)
for si in range(len(segments)):
    if si not in visited:
        strokes.append(walk(si, 0))

strokes = [s for s in strokes if length(s) >= 25]

# Orient each stroke to start at its leftmost end, then order strokes left→right.
for i, s in enumerate(strokes):
    if s[-1][0] < s[0][0]:
        strokes[i] = s[::-1]
# Writing order: left→right, but long near-straight strokes (the underline flourish) come last.
def is_flourish(s):
    return length(s) > 300 and math.dist(s[0], s[-1]) / length(s) > 0.93
body = sorted((s for s in strokes if not is_flourish(s)), key=lambda s: s[0][0])
# A signature starts with its big opening letter: lead with the longest body stroke.
if body:
    lead = max(body, key=length)
    body = [lead] + [s for s in body if s is not lead]
flourish = sorted((s for s in strokes if is_flourish(s)), key=lambda s: s[0][0])
strokes = body + flourish


# ---- simplify + smooth ---------------------------------------------------------------
def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = math.hypot(dx, dy) or 1
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / norm
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        return rdp(pts[: idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [pts[0], pts[-1]]


def to_bezier(pts):
    """Catmull-Rom spline through the points as cubic Béziers."""
    d = f"M {pts[0][0]:.1f} {pts[0][1]:.1f}"
    for i in range(len(pts) - 1):
        p0 = pts[i - 1] if i > 0 else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < len(pts) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C {c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}"
    return d


out_strokes = []
for s in strokes:
    simple = rdp(s, 1.6)
    # Reveal brush sized to this stroke's own ink (widest point along it), so its round
    # ends don't uncover stubs of neighbouring strokes at crossings.
    widths = [dist[min(int(round(py)), dist.shape[0] - 1), min(int(round(px)), dist.shape[1] - 1)] for px, py in s]
    w = float(np.percentile(widths, 95)) * 2 + 5
    out_strokes.append({"d": to_bezier(simple), "length": round(length(s), 1), "width": round(min(max(w, 12), 40), 1)})

# ---- ink paths from the original vector trace (blue fills only) ---------------------
svg = open(src_svg, encoding="utf-8").read()
ink_paths = []
for m in re.finditer(r'<path\b[^>]*?fill="(#[0-9A-Fa-f]{6})"[^>]*?\sd="([^"]+)"', svg, re.S):
    fill, d = m.group(1), m.group(2)
    rr, gg, bb = int(fill[1:3], 16), int(fill[3:5], 16), int(fill[5:7], 16)
    if bb > rr + 80:  # the blue ink, not the near-white background pieces
        ink_paths.append(" ".join(d.split()))

ys, xs = np.nonzero(ink)
pad = 24
box = [int(xs.min()) - pad, int(ys.min()) - pad, int(xs.max() - xs.min()) + 2 * pad, int(ys.max() - ys.min()) + 2 * pad]
mask_width = round(float(dist[skel].max()) * 2 + 8, 1)

json.dump(
    {"viewBox": box, "maskWidth": mask_width, "strokes": out_strokes, "inkPaths": ink_paths},
    open(f"{out_dir}/strokes.json", "w"),
    indent=1,
)

# ---- debug render: strokes coloured by order -----------------------------------------
dbg = Image.new("RGB", ink.shape[::-1], "white")
dbg.paste(Image.fromarray((~ink * 255).astype(np.uint8)).convert("RGB").point(lambda v: 225 if v == 0 else 255))
draw = ImageDraw.Draw(dbg)
palette = [(124, 58, 237), (6, 182, 212), (236, 72, 153), (16, 185, 129), (245, 158, 11), (239, 68, 68), (59, 130, 246), (0, 0, 0)]
for i, s in enumerate(strokes):
    col = palette[i % len(palette)]
    draw.line(s, fill=col, width=5)
    draw.ellipse([s[0][0] - 9, s[0][1] - 9, s[0][0] + 9, s[0][1] + 9], fill=col)
    draw.text((s[0][0] + 12, s[0][1] - 8), str(i + 1), fill=col)
dbg.crop((box[0], box[1], box[0] + box[2], box[1] + box[3])).save(f"{out_dir}/debug.png")

print(f"segments={len(segments)} strokes={len(strokes)} ink_paths={len(ink_paths)} mask_width={mask_width}")
for i, s in enumerate(out_strokes):
    print(f"  stroke {i + 1}: length {s['length']}px, starts at x={strokes[i][0][0]:.0f}")
