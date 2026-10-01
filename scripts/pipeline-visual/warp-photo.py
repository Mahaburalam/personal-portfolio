"""Perspective-warps the pipeline's source photo into the image panel (called by generate.mjs).

SVG and Lottie can only transform images affinely, so the photo is pre-warped here. stdin (JSON):
  { "src": path, "quad": [[x, y] × 4  TL TR BR BL, artboard px], "scale": 2, "grid": [cols, rows] }
stdout (JSON):
  { "x", "y", "w", "h" (artboard px), "px": [W, H], "data": "data:image/jpeg;base64,…",
    "grid": { "cols", "rows", "colors": ["#rrggbb", …] row-major } }
The photo is centre-cropped to the panel's 3:4; `grid` is that crop averaged down, for sampling
patch / token colors. Needs Pillow + numpy.
"""

import base64
import io
import json
import math
import sys

import numpy as np
from PIL import Image

req = json.load(sys.stdin)
scale = req.get("scale", 2)

img = Image.open(req["src"]).convert("RGB")
w, h = img.size
cw, ch = (round(h * 3 / 4), h) if w / h > 3 / 4 else (w, round(w * 4 / 3))
img = img.crop(((w - cw) // 2, (h - ch) // 2, (w - cw) // 2 + cw, (h - ch) // 2 + ch))

quad = req["quad"]
x0 = math.floor(min(p[0] for p in quad))
y0 = math.floor(min(p[1] for p in quad))
x1 = math.ceil(max(p[0] for p in quad))
y1 = math.ceil(max(p[1] for p in quad))
size = ((x1 - x0) * scale, (y1 - y0) * scale)

# PIL PERSPECTIVE maps output pixels → source pixels: solve the 8 homography coefficients.
dst = [((px - x0) * scale, (py - y0) * scale) for px, py in quad]
src = [(0, 0), (cw, 0), (cw, ch), (0, ch)]
rows, rhs = [], []
for (X, Y), (sx, sy) in zip(dst, src):
    rows.append([X, Y, 1, 0, 0, 0, -sx * X, -sx * Y])
    rows.append([0, 0, 0, X, Y, 1, -sy * X, -sy * Y])
    rhs += [sx, sy]
coeffs = np.linalg.solve(np.array(rows, float), np.array(rhs, float)).tolist()

# Upsample first so the bicubic warp has detail to work with at 2× density.
big = img.resize((cw * 2, ch * 2), Image.LANCZOS)
coeffs2 = [c * 2 for c in coeffs[:6]] + coeffs[6:]
warped = big.transform(size, Image.PERSPECTIVE, coeffs2, Image.BICUBIC, fillcolor=(0, 0, 0))

buf = io.BytesIO()
warped.save(buf, "JPEG", quality=88, optimize=True, progressive=True)

cols, nrows = req.get("grid", [150, 200])
small = np.asarray(img.resize((cols, nrows), Image.BOX))
colors = ["#%02x%02x%02x" % tuple(px) for row in small for px in row]

json.dump(
    {
        "x": x0,
        "y": y0,
        "w": x1 - x0,
        "h": y1 - y0,
        "px": list(size),
        "data": "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode(),
        "grid": {"cols": cols, "rows": nrows, "colors": colors},
    },
    sys.stdout,
)
