from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "content" / "social" / "2026-09-03" / "assets" / "instagram-carousel"
OUTPUT.mkdir(parents=True, exist_ok=True)

WIDTH, HEIGHT = 1080, 1350
NAVY = "#0F172A"
NAVY_2 = "#172033"
ORANGE = "#F97316"
CREAM = "#F7F7F5"
WHITE = "#FFFFFF"
MUTED = "#94A3B8"
TEXT = "#E2E8F0"

FONT_REGULAR = "C:/Windows/Fonts/segoeui.ttf"
FONT_SEMIBOLD = "C:/Windows/Fonts/seguisb.ttf"
FONT_BOLD = "C:/Windows/Fonts/segoeuib.ttf"


def font(path: str, size: int):
    return ImageFont.truetype(path, size)


def wrap(draw, text, face, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=face)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_measure_icon(draw, x, y, kind):
    color = ORANGE
    if kind == "screen":
        draw.rounded_rectangle((x, y, x + 350, y + 225), radius=16, outline=color, width=8)
        draw.line((x + 45, y + 260, x + 305, y + 260), fill=color, width=7)
        for tx in range(x + 45, x + 306, 52):
            draw.line((tx, y + 245, tx, y + 275), fill=color, width=5)
    elif kind == "throw":
        draw.rounded_rectangle((x, y + 165, x + 135, y + 250), radius=18, outline=color, width=8)
        draw.ellipse((x + 105, y + 187, x + 132, y + 214), fill=color)
        draw.line((x + 150, y + 205, x + 350, y + 115), fill=color, width=6)
        draw.line((x + 150, y + 205, x + 350, y + 295), fill=color, width=6)
        draw.line((x + 350, y + 80, x + 350, y + 330), fill=WHITE, width=8)
    elif kind == "light":
        draw.ellipse((x + 110, y + 70, x + 240, y + 200), outline=color, width=8)
        draw.line((x + 175, y, x + 175, y + 48), fill=color, width=7)
        draw.line((x + 75, y + 35, x + 110, y + 70), fill=color, width=7)
        draw.line((x + 275, y + 35, x + 240, y + 70), fill=color, width=7)
        draw.line((x + 135, y + 225, x + 215, y + 225), fill=color, width=8)
        draw.line((x + 148, y + 252, x + 202, y + 252), fill=color, width=8)
    elif kind == "use":
        draw.rounded_rectangle((x, y + 35, x + 350, y + 245), radius=16, outline=color, width=8)
        draw.polygon([(x + 145, y + 88), (x + 145, y + 192), (x + 235, y + 140)], fill=color)
        draw.line((x + 90, y + 285, x + 260, y + 285), fill=WHITE, width=8)
    elif kind == "connect":
        for index, label in enumerate(("HDMI", "AUDIO", "POWER")):
            yy = y + index * 92
            draw.rounded_rectangle((x, yy, x + 350, yy + 62), radius=14, outline=color, width=5)
            draw.text((x + 25, yy + 11), label, font=font(FONT_SEMIBOLD, 27), fill=WHITE)
            draw.ellipse((x + 295, yy + 17, x + 325, yy + 47), fill=color)
    elif kind == "check":
        draw.ellipse((x + 55, y + 25, x + 295, y + 265), outline=color, width=10)
        draw.line((x + 110, y + 150, x + 160, y + 200), fill=color, width=15)
        draw.line((x + 160, y + 200, x + 255, y + 95), fill=color, width=15)


def render_slide(number, eyebrow, title, body, icon):
    image = Image.new("RGB", (WIDTH, HEIGHT), NAVY)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 24, HEIGHT), fill=ORANGE)
    draw.ellipse((755, -170, 1240, 315), fill=NAVY_2)
    draw.text((80, 76), "REACH PROJECTOR", font=font(FONT_BOLD, 30), fill=WHITE)
    draw.text((925, 78), f"{number}/7", font=font(FONT_SEMIBOLD, 28), fill=MUTED)
    draw.text((80, 202), eyebrow.upper(), font=font(FONT_BOLD, 24), fill=ORANGE)

    title_face = font(FONT_BOLD, 67 if number > 1 else 76)
    y = 258
    for line in wrap(draw, title, title_face, 900):
        draw.text((80, y), line, font=title_face, fill=WHITE)
        y += 84

    icon_y = max(y + 55, 555)
    draw_measure_icon(draw, 80, icon_y, icon)

    body_face = font(FONT_REGULAR, 35)
    body_y = icon_y + 390
    for line in wrap(draw, body, body_face, 900):
        draw.text((80, body_y), line, font=body_face, fill=TEXT)
        body_y += 51

    draw.line((80, 1230, 1000, 1230), fill="#334155", width=2)
    draw.text((80, 1260), "Choose for the room. Buy with confidence.", font=font(FONT_SEMIBOLD, 25), fill=MUTED)
    image.save(OUTPUT / f"{number:02d}-{icon}.png", optimize=True)


SLIDES = [
    (1, "Projector buying guide", "6 checks before you choose a projector", "The model name is not your first decision.", "check"),
    (2, "Check 1", "Choose the image size", "Fit the screen to both your wall and viewing distance. Bigger is not automatically more comfortable.", "screen"),
    (3, "Check 2", "Measure real throw distance", "Measure from the lens position to the screen, then check the exact model calculator.", "throw"),
    (4, "Check 3", "Account for room light", "A dark theater, bright living room and outdoor night each require different compromises.", "light"),
    (5, "Check 4", "Define what you watch", "Movies, sports and gaming prioritize different combinations of contrast, brightness, motion and response.", "use"),
    (6, "Check 5", "Map the whole system", "Confirm regional software, HDMI ports, audio path and the source devices you already own.", "connect"),
    (7, "Final check", "Write down these six details", "Country · Screen size · Throw distance · Room lighting · Main use · Audio and sources", "check"),
]

for slide in SLIDES:
    render_slide(*slide)

print(f"Rendered {len(SLIDES)} slides to {OUTPUT}")
