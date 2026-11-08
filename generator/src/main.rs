//! Writes the site's pages and the hypersig runtime they load to the
//! repository root: `index.html` for the top page and `about/index.html`.
//!
//! The top page lists the articles of the feeds in `feed::SOURCES`, fetched
//! when this runs, so it needs the network.
//!
//! ```sh
//! cargo run --manifest-path generator/Cargo.toml
//! ```

mod feed;

use std::error::Error;
use std::path::Path;

use feed::Article;
use hypersig::html::{
    self, El, a, attr, div, h1, h2, header, img, li, nav, p, section, span, time, ul,
};
use hypersig::{
    Asset, LanguageTag, OpenGraph, OpenGraphLocale, Origin, Page, PageResponse, Route, SafeUrl,
    Signals,
};
use serde::{Deserialize, Serialize};

const ORIGIN: Origin = Origin::new("https://imaim.ai");
const RUNTIME_FILE: &str = "hypersig.js";

// Nothing serves these routes, because the pages are written as files. They
// build the links between the pages and the `Url` that the canonical link and
// `og:url` take.
hypersig::routes! {
    fn pages(Router<()>);
    const HOME: Route = "/" => unserved;
    const ABOUT: Route = "/about" => unserved;
}

#[expect(dead_code, reason = "the pages are written as files, not served")]
async fn unserved((): (), (): ()) -> PageResponse {
    PageResponse::not_found()
}

/// The pages hold no state the browser changes.
#[derive(Signals, Serialize, Deserialize)]
struct Doc {}

/// A page the header links to.
#[derive(Clone, Copy, PartialEq)]
enum Section {
    Articles,
    About,
}

impl Section {
    const ALL: [Self; 2] = [Self::Articles, Self::About];

    fn label(self) -> &'static str {
        match self {
            Self::Articles => "Articles",
            Self::About => "About",
        }
    }

    fn route(self) -> &'static Route {
        match self {
            Self::Articles => &HOME,
            Self::About => &ABOUT,
        }
    }
}

/// The band along `edge` of the window that blurs the page scrolling under it.
fn edge_blur(edge: look::Edge) -> El<Doc> {
    div()
        .attr(attr::ARIA_HIDDEN, "true")
        .css(look::edge_blur(edge))
        .children(
            (0..look::BLUR_LAYERS).map(move |layer| span().css(look::blur_layer(edge, layer))),
        )
        .child(span().css(look::blur_tint(edge)))
}

/// The `<head>`, the styles, and the header every page shares, around `main`.
fn layout(title: &str, current: Section, main: El<Doc>) -> Page<Doc> {
    Page::new(title, Doc {})
        .lang(LanguageTag::new("ja"))
        .description("imaimai17468のポートフォリオサイト")
        .canonical(ORIGIN, &current.route().url(()))
        .icon(Asset::new("/icon.png"))
        .global(look::global())
        .theme(look::theme())
        .runtime_src(Asset::new("/hypersig.js"))
        .open_graph(
            OpenGraph::new()
                .locale(OpenGraphLocale::new("ja_JP"))
                .image(ORIGIN, "/og.png", "カエルのアイコンと imaimai17468 の文字"),
        )
        .child(edge_blur(look::Edge::Top))
        .child(edge_blur(look::Edge::Bottom))
        .child(
            header()
                .css(look::header())
                .child(
                    img()
                        .src(SafeUrl::new("/frog.svg"))
                        .attr(
                            attr::ALT,
                            "helloと挨拶しているいまいまいのカエルアイコンのイラスト",
                        )
                        .attr(attr::WIDTH, "70")
                        .attr(attr::HEIGHT, "48"),
                )
                .child(span().css(look::site_name()).text("imaim.ai"))
                .child(
                    nav()
                        .css(look::nav())
                        .children(Section::ALL.into_iter().map(|section| {
                            let link = a()
                                .href(section.route().link())
                                .css(look::nav_link())
                                .text(section.label());
                            if section == current {
                                link.attr(attr::ARIA_CURRENT, "page")
                            } else {
                                link
                            }
                        })),
                ),
        )
        .child(main)
}

fn home(articles: &[Article]) -> Page<Doc> {
    layout(
        "imaimai17468",
        Section::Articles,
        html::main()
            .child(
                div().css(look::hero()).child(
                    img()
                        .src(SafeUrl::new("/pencil.svg"))
                        .attr(attr::ALT, "「筆先の黒は乾かすな」という文字のSVGイラスト")
                        // The SVG's own size, so the browser reserves the
                        // image's height before the file arrives.
                        .attr(attr::WIDTH, "816")
                        .attr(attr::HEIGHT, "144")
                        // The largest element on the top page's first screen.
                        .attr(attr::FETCHPRIORITY, "high")
                        .css(look::pencil()),
                ),
            )
            .child(
                section().child(h2().text("Articles")).child(
                    ul().css(look::articles())
                        .children(articles.iter().map(article)),
                ),
            ),
    )
}

/// A place elsewhere the about page links to, under the profile.
struct Contact {
    label: &'static str,
    href: &'static str,
}

const CONTACTS: [Contact; 3] = [
    Contact {
        label: "GitHub",
        href: "https://github.com/imaimai17468",
    },
    Contact {
        label: "X",
        href: "https://x.com/imaimai17468",
    },
    Contact {
        label: "contact@imaim.ai",
        href: "mailto:contact@imaim.ai",
    },
];

const BIO: [&str; 4] = [
    "千葉の田舎でぬくぬくしているエンジニアです。木更津高専、長岡技術科学大学を経て、2024年株式会社ゆめみに入社し、現在は買収によりアクセンチュアでエンジニアとして働きながら、採用活動、DevEx改善に取り組んでいます。",
    "ものづくりが好きで、C言語に始まり、競技プログラミング、ゲーム（Unity）、ビジュアル表現（Processing）、IoT、AI、そしてWebなど興味本位で多くのものに手を出しています。",
    "人材育成・組織運営に興味があり、サポーターズ主催の技育祭ではスポンサー登壇を勤めています。また、複数のハッカソンで審査員を務め、学生の制作物に対してフィードバックを行う活動も行なっています。",
    "開発物では、Rust製Webフレームワーク、個人開発向けテンプレートをはじめ、個人で困った時に作ったサービスがぽこぽこあります。",
];

/// The lines under the motto, which is the same phrase `pencil.svg` draws.
const MOTTO: [&str; 3] = [
    "自身が達成したい表現を求め続け、手を止めるなという気持ちを込めています。",
    "どんな時代であれ、アルチザンであり、クラフツマンシップを持ち続けます。",
    "\"わかってんじゃん、アンタ\"って思ってもらえる人に、私はここにいるって伝えなくちゃいけないんだ。",
];

/// The owner's GitHub Sponsors page, which the button in the about page's
/// Support section opens.
const SPONSORS: &str = "https://github.com/sponsors/imaimai17468";

/// The text above the Sponsor button.
const SUPPORT: &str = "hypersig や個人開発のサービスを気に入っていただけたら、GitHub Sponsors から応援してもらえると嬉しいです。";

struct Project {
    name: &'static str,
    href: &'static str,
    summary: &'static str,
}

const PROJECTS: [Project; 8] = [
    Project {
        name: "hypersig",
        href: "https://imaimai17468.github.io/hypersig/",
        summary: "ページもブラウザの動きもサーバーも Rust で書き、シグナル名や URL の誤りをコンパイルエラーにする Web フレームワーク",
    },
    Project {
        name: "imaimai-front-templete",
        href: "https://github.com/imaimai17468/imaimai-front-templete",
        summary: "TanStack Start + Tailwind CSS + shadcn/ui を Cloudflare Workers で動かすフロントエンド開発テンプレート",
    },
    Project {
        name: "Osampo",
        href: "https://osampo.vercel.app",
        summary: "標高グラデーションマップでお散歩ルートを探索・記録できるアプリ",
    },
    Project {
        name: "ツウキンプレイス",
        href: "https://tsuukin-place.com",
        summary: "通勤時間から駅の家賃相場を調べられるサービス",
    },
    Project {
        name: "Contrast Color Palette",
        href: "https://contrast-color-palette.vercel.app",
        summary: "コントラスト比を考慮したカラーパレット生成ツール",
    },
    Project {
        name: "Digital Agency Icons",
        href: "https://digital-agency-icons-docs.vercel.app",
        summary: "デジタル庁アイコンをReact・Vue・Svelteで使える非公式コンポーネントライブラリ",
    },
    Project {
        name: "imaimai UI",
        href: "https://imaimai-ui.vercel.app",
        summary: "他のライブラリには無い、実装が面倒なコンポーネント集",
    },
    Project {
        name: "木更津高専単位カウンター",
        href: "https://credits-counter-fo-knct.vercel.app",
        summary: "木更津高専の卒業に必要な単位数を自動計算するツール",
    },
];

fn about() -> Page<Doc> {
    layout(
        "About | imaimai17468",
        Section::About,
        html::main()
            .css(look::about())
            .child(h1().text("About"))
            .child(
                p().text(
                    "ものづくりが好きです。今はフロントエンドとハードウェアに熱が入っています。",
                ),
            )
            .child(
                div()
                    .css(look::profile())
                    .child(
                        img()
                            .src(SafeUrl::new("/avatar.png"))
                            .attr(attr::ALT, "舌を出したいまいまいのカエルのアイコン")
                            .attr(attr::WIDTH, "80")
                            .attr(attr::HEIGHT, "80")
                            .css(look::avatar()),
                    )
                    .child(
                        div()
                            .child(p().css(look::profile_name()).text("imaimai"))
                            .child(
                                p().css(look::profile_role())
                                    .text("Frontend Engineer at Accenture (ex Yumemi.inc)"),
                            ),
                    ),
            )
            .child(
                ul().css(look::contacts())
                    .children(CONTACTS.iter().map(|contact| {
                        li().child(
                            a().href(SafeUrl::new(contact.href))
                                .css(look::plain_link())
                                .text(contact.label),
                        )
                    })),
            )
            .children(BIO.iter().map(|text| p().text(*text)))
            .child(
                section()
                    .child(h2().text("筆先の黒は乾かすな"))
                    .children(MOTTO.iter().map(|line| p().css(look::motto()).text(*line))),
            )
            .child(
                section().child(h2().text("Projects")).child(
                    ul().css(look::projects())
                        .children(PROJECTS.iter().map(project)),
                ),
            )
            .child(
                section()
                    .child(h2().text("Support"))
                    .child(p().text(SUPPORT))
                    .child(
                        a().href(SafeUrl::new(SPONSORS))
                            .css(look::sponsor())
                            .text("Sponsor"),
                    ),
            ),
    )
}

fn project(project: &Project) -> El<Doc> {
    li().child(
        a().href(SafeUrl::new(project.href))
            .css(look::plain_link())
            .text(project.name),
    )
    .child(p().css(look::project_summary()).text(project.summary))
}

fn article(article: &Article) -> El<Doc> {
    let link = SafeUrl::parse(article.link.clone())
        .unwrap_or_else(|_| panic!("{} gave the link {}", article.source, article.link));
    li().css(look::article())
        .child(
            time()
                .attr(attr::DATETIME, article.date.format("%Y-%m-%d").to_string())
                .css(look::article_date())
                .text(article.date.format("%Y.%m.%d").to_string()),
        )
        .child(
            a().href(link)
                .css(look::article_title())
                .text(&article.title),
        )
}

/// The page's styles, written into a `<style>` in `<head>`.
mod look {
    use hypersig::style::pattern::{center, hstack, stack};
    use hypersig::style::value::{
        AlignItems, BorderBottomStyle, Color, ColorScheme, Display, FlexWrap, FontFamily,
        FontVariantNumeric, FontWeight, Height, LineHeight, ListStyle, MarginInline,
        OverscrollBehavior, PointerEvents, Position, TextDecorationLine, ZIndex, pct, px, quoted,
        raw, rem, url,
    };
    use hypersig::style::{
        Element, FontFace, Global, Media, PseudoClass, Selector, Style, Theme, Token,
    };

    const WHITE: u32 = 0xf9fafb;
    const BLACK: u32 = 0x1d1d1d;

    fn background() -> Token<Color> {
        Token::new("background", Color::hex(WHITE))
    }

    fn foreground() -> Token<Color> {
        Token::new("foreground", Color::hex(BLACK))
    }

    /// Text that steps back, such as a date: the foreground at 65 percent.
    fn muted() -> Color {
        foreground().var().mix(&background().var(), 65)
    }

    /// Light text on dark under `prefers-color-scheme: dark`.
    pub(crate) fn theme() -> Theme {
        Theme::new().on(
            Media::Dark,
            Theme::new()
                .set(&background(), Color::hex(BLACK))
                .set(&foreground(), Color::hex(WHITE)),
        )
    }

    /// The site's one font, for Latin and Japanese text alike, in one weight.
    /// A bold heading is drawn bolder by the browser. `scripts/subset_fonts.py`
    /// writes the file it loads.
    fn zen_kurenaido() -> FontFace {
        FontFace::new("Zen Kurenaido", url("/fonts/zen-kurenaido.woff2")).weights(400, 400)
    }

    /// Zen Kurenaido, then the Yu Gothic the system has.
    fn font_stack() -> FontFamily {
        zen_kurenaido()
            .family()
            .fallback(quoted("游ゴシック体"))
            .fallback(quoted("YuGothic"))
            .fallback(quoted("游ゴシック Medium"))
            .fallback(quoted("Yu Gothic Medium"))
            .fallback(quoted("Yu Gothic"))
            .fallback(FontFamily::SansSerif)
    }

    pub(crate) fn global() -> Global {
        Global::new()
            .font(zen_kurenaido())
            .rule(
                Selector::Root,
                // Without the bounce at the top and bottom edges, the
                // plain color past the paper texture never shows.
                Style::new()
                    .color_scheme(ColorScheme::LightDark)
                    .overscroll_behavior(OverscrollBehavior::None),
            )
            .rule(
                Element::Body,
                Style::new()
                    .max_width(rem(40))
                    .margin_block(px(0))
                    .margin_inline(MarginInline::Auto)
                    // Room for the last line to scroll clear of the bottom `edge_blur`.
                    .padding_block_end(rem(6))
                    .padding_inline(rem(1))
                    .background_color(background().var())
                    // A noise tile that `paper.svg` draws in the foreground
                    // color, so the page reads as paper in both themes.
                    .background_image(url("/paper.svg"))
                    .overscroll_behavior(OverscrollBehavior::None)
                    .color(foreground().var())
                    .font_family(font_stack())
                    .line_height(LineHeight::Number(1.7)),
            )
    }

    /// How many blurred bands `edge_blur` stacks.
    pub(crate) const BLUR_LAYERS: u8 = 8;

    /// The edge of the window a blurred band sits along.
    #[derive(Clone, Copy)]
    pub(crate) enum Edge {
        /// Under the header, blurred by up to 20px.
        Top,
        /// At the bottom of the window, blurred by up to 8px.
        Bottom,
    }

    impl Edge {
        /// The direction of the gradients, from the edge inward.
        fn inward(self) -> &'static str {
            match self {
                Edge::Top => "to bottom",
                Edge::Bottom => "to top",
            }
        }

        /// The blur of the band nearest the edge, in px.
        fn strongest_blur(self) -> f64 {
            match self {
                Edge::Top => 20.0,
                Edge::Bottom => 8.0,
            }
        }
    }

    /// A band 6rem tall along `edge` of the window, over the page, that
    /// blurs the page scrolling under it: strongest at the edge and gone at
    /// the band's inner side. It is drawn as `BLUR_LAYERS` bands, from
    /// `blur_layer`, whose blur halves from one to the next, under
    /// `blur_tint`.
    pub(crate) fn edge_blur(edge: Edge) -> Style {
        let band = Style::new()
            .position(Position::Fixed)
            .left(px(0))
            .right(px(0))
            .height(rem(6))
            .pointer_events(PointerEvents::None)
            .z_index(ZIndex::Integer(1));
        match edge {
            Edge::Top => band.top(px(0)),
            Edge::Bottom => band.bottom(px(0)),
        }
    }

    /// Band `layer`, counted from `edge`: blurred by the edge's strongest
    /// blur halved `layer` times, and shown only over its eighth of the
    /// height and the eighths on either side, where it fades in and out.
    pub(crate) fn blur_layer(edge: Edge, layer: u8) -> Style {
        let eighth = |step: i32| format!("{}%", f64::from(step) * 12.5);
        let at = i32::from(layer);
        Style::new()
            .position(Position::Absolute)
            .inset(px(0))
            .backdrop_filter(raw(format!(
                "blur({}px)",
                edge.strongest_blur() / f64::from(1_u16 << layer)
            )))
            .mask_image(raw(format!(
                "linear-gradient({}, transparent {}, #000 {}, #000 {}, transparent {})",
                edge.inward(),
                eighth(at - 2),
                eighth(at - 1),
                eighth(at),
                eighth(at + 1),
            )))
    }

    /// The background color over the blur, nearly opaque at `edge` and gone
    /// by 70 percent of the band's height.
    pub(crate) fn blur_tint(edge: Edge) -> Style {
        let background = background().var();
        Style::new()
            .position(Position::Absolute)
            .inset(px(0))
            .background_image(raw(format!(
                "linear-gradient({}, {} 18px, {} 42%, transparent 70%)",
                edge.inward(),
                background.opacity(95),
                background.opacity(48),
            )))
    }

    /// Fixed to the top right corner of the window, over the page.
    pub(crate) fn header() -> Style {
        hstack(rem(0.75))
            .position(Position::Fixed)
            .top(rem(1))
            .right(rem(2))
            .z_index(ZIndex::Integer(1))
    }

    pub(crate) fn nav() -> Style {
        hstack(rem(1)).margin_inline_start(rem(0.5))
    }

    pub(crate) fn nav_link() -> Style {
        Style::new()
            .font_size(rem(0.875))
            .color(foreground().var())
            .text_decoration_line(TextDecorationLine::None)
    }

    /// The first screen: the pencil in the middle of the window's full height.
    pub(crate) fn hero() -> Style {
        center().height(raw("100dvh"))
    }

    /// The site's name, in bold.
    pub(crate) fn site_name() -> Style {
        Style::new()
            .font_size(rem(0.875))
            .font_weight(FontWeight::Bold)
    }

    /// A rule between articles, the foreground at 20 percent.
    fn line() -> Color {
        foreground().var().mix(&background().var(), 20)
    }

    pub(crate) fn articles() -> Style {
        stack(px(0))
            .list_style(ListStyle::None)
            .padding(px(0))
            .on(Media::Sm, Style::new().gap(rem(2)))
    }

    /// On a phone, the date sits above the title and a rule ends each
    /// article. From the `sm` breakpoint, the date has a column of its own,
    /// so a title that wraps stays beside it. The column is 3rem wide in every
    /// row, because Zen Kurenaido's digits differ in width and has no
    /// `tnum`: the widest date it can draw at 10px, `8888.88.88`, is 47.8px.
    pub(crate) fn article() -> Style {
        Style::new()
            .display(Display::Grid)
            .padding_block(rem(0.75))
            .border_bottom_width(px(1))
            .border_bottom_style(BorderBottomStyle::Solid)
            .border_bottom_color(line())
            .on(
                Media::Sm,
                Style::new()
                    .grid_template_columns(raw("3rem 1fr"))
                    .align_items(AlignItems::Start)
                    .column_gap(rem(1))
                    .padding_block(px(0))
                    .border_bottom_width(px(0)),
            )
    }

    pub(crate) fn article_date() -> Style {
        trimmed_top()
            .color(muted())
            .font_size(px(10))
            .font_variant_numeric(FontVariantNumeric::TabularNums)
    }

    pub(crate) fn article_title() -> Style {
        trimmed_top()
            .color(foreground().var())
            .text_decoration_line(TextDecorationLine::None)
    }

    /// From the `sm` breakpoint, where the date and the title sit side by
    /// side, the space a line box keeps above the letters is cut down to
    /// the top of the capitals. Without it the 16px title starts lower than
    /// the 10px date, since that space grows with the font size. Firefox
    /// ignores `text-box` and keeps the space.
    fn trimmed_top() -> Style {
        Style::new().on(
            Media::Sm,
            Style::new().text_box(raw("trim-start cap alphabetic")),
        )
    }

    /// The about page starts below the fixed header.
    pub(crate) fn about() -> Style {
        Style::new().padding_block_start(rem(5))
    }

    pub(crate) fn profile() -> Style {
        hstack(rem(1)).margin_block_start(rem(2))
    }

    pub(crate) fn avatar() -> Style {
        Style::new().border_radius(pct(50))
    }

    pub(crate) fn profile_name() -> Style {
        Style::new().font_weight(FontWeight::Bold).margin(px(0))
    }

    pub(crate) fn profile_role() -> Style {
        Style::new()
            .color(muted())
            .font_size(rem(0.875))
            .margin(px(0))
    }

    /// GitHub, X, and the mail address in one row that wraps on a phone.
    pub(crate) fn contacts() -> Style {
        hstack(rem(1))
            .flex_wrap(FlexWrap::Wrap)
            .list_style(ListStyle::None)
            .padding(px(0))
    }

    /// A link in the foreground color, without an underline.
    pub(crate) fn plain_link() -> Style {
        Style::new()
            .color(foreground().var())
            .text_decoration_line(TextDecorationLine::None)
    }

    /// The motto's lines, set close together like a verse.
    pub(crate) fn motto() -> Style {
        Style::new().margin_block(px(0))
    }

    pub(crate) fn projects() -> Style {
        stack(rem(1)).list_style(ListStyle::None).padding(px(0))
    }

    /// A pill outlined in the foreground color, filled with it on hover.
    pub(crate) fn sponsor() -> Style {
        Style::new()
            .display(Display::InlineBlock)
            .padding_block(rem(0.5))
            .padding_inline(rem(1.5))
            .border(raw(format!("1px solid {}", foreground().var())))
            .border_radius(px(9999))
            .color(foreground().var())
            .text_decoration_line(TextDecorationLine::None)
            .on(
                PseudoClass::Hover,
                Style::new()
                    .background_color(foreground().var())
                    .color(background().var()),
            )
    }

    pub(crate) fn project_summary() -> Style {
        Style::new()
            .color(muted())
            .font_size(rem(0.875))
            .margin(px(0))
    }

    /// 20rem wide, shrinking to the page on a narrower screen.
    pub(crate) fn pencil() -> Style {
        Style::new()
            .width(rem(20))
            .max_width(pct(100))
            .height(Height::Auto)
    }
}

fn main() -> Result<(), Box<dyn Error>> {
    let articles = feed::fetch_all()?;
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("..");
    std::fs::write(root.join("index.html"), home(&articles).render())?;
    std::fs::create_dir_all(root.join("about"))?;
    std::fs::write(root.join("about/index.html"), about().render())?;
    std::fs::write(root.join(RUNTIME_FILE), hypersig::RUNTIME_JS)?;
    println!(
        "wrote index.html ({} articles), about/index.html, and {RUNTIME_FILE}",
        articles.len()
    );
    Ok(())
}
