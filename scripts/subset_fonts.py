"""Writes the WOFF2 file the pages load from the font in fonts/src/.

Run it through scripts/build.sh, which supplies fontTools:

    uv run --no-project --with 'fonttools[woff]' python -I scripts/subset_fonts.py

Zen Kurenaido, the site's one font, keeps the kana, the Japanese
punctuation, the full-width ASCII forms, and every other character in the
text of the generated pages (`index.html` and `*/index.html`), so it has to
be rerun after each change to their text.
"""

from html.parser import HTMLParser
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "fonts" / "src"
OUT = ROOT / "fonts"

# CJK punctuation, hiragana, katakana, and the full-width ASCII forms.
KANA = "U+3000-30FF,U+FF01-FF5E"


class PageText(HTMLParser):
    """Collects the text the browser draws, leaving out scripts and styles."""

    def __init__(self) -> None:
        super().__init__()
        self.skip = 0
        self.chars: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list) -> None:
        if tag in ("script", "style"):
            self.skip += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in ("script", "style"):
            self.skip -= 1

    def handle_data(self, data: str) -> None:
        if not self.skip:
            self.chars.update(data)


def write_subset(src: Path, out: Path, unicodes: str, text: str = "") -> None:
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    font = TTFont(src)
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=subset.parse_unicodes(unicodes), text=text)
    subsetter.subset(font)
    font.save(out)


def main() -> None:
    page = PageText()
    for html in [ROOT / "index.html", *sorted(ROOT.glob("*/index.html"))]:
        page.feed(html.read_text(encoding="utf-8"))
    text = "".join(sorted(c for c in page.chars if not c.isspace()))

    write_subset(
        SRC / "ZenKurenaido-Regular.ttf", OUT / "zen-kurenaido.woff2", KANA, text
    )
    path = OUT / "zen-kurenaido.woff2"
    print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
