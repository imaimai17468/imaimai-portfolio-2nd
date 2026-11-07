//! The articles of the RSS feeds the top page lists.

use std::error::Error;

use chrono::{DateTime, FixedOffset, NaiveDate};

/// A site that publishes articles, and the RSS feed that lists them.
pub(crate) struct Source {
    pub(crate) name: &'static str,
    feed: &'static str,
}

pub(crate) const SOURCES: [Source; 2] = [
    Source {
        name: "Zenn",
        feed: "https://zenn.dev/imaimai17468/feed",
    },
    Source {
        name: "sizu",
        feed: "https://sizu.me/imaimai17468/rss",
    },
];

pub(crate) struct Article {
    pub(crate) title: String,
    pub(crate) link: String,
    /// The day it was published, in Japan time.
    pub(crate) date: NaiveDate,
    pub(crate) source: &'static str,
}

/// Fetches every source and returns their articles, newest first.
///
/// A source that cannot be fetched or read fails the whole run, so the page
/// is never written with a source's articles missing.
pub(crate) fn fetch_all() -> Result<Vec<Article>, Box<dyn Error>> {
    let mut articles = Vec::new();
    for source in &SOURCES {
        articles.extend(fetch(source).map_err(|e| format!("{}: {e}", source.feed))?);
    }
    articles.sort_by_key(|article| std::cmp::Reverse(article.date));
    Ok(articles)
}

fn fetch(source: &Source) -> Result<Vec<Article>, Box<dyn Error>> {
    let body = ureq::get(source.feed).call()?.body_mut().read_to_vec()?;
    let channel = rss::Channel::read_from(&body[..])?;
    let jst = FixedOffset::east_opt(9 * 3600).expect("+09:00 is a valid offset");
    channel
        .items()
        .iter()
        .map(|item| {
            let field = |value: Option<&str>, name: &str| {
                value
                    .map(str::to_owned)
                    .ok_or_else(|| format!("an item has no {name}"))
            };
            let published = field(item.pub_date(), "pubDate")?;
            Ok(Article {
                title: field(item.title(), "title")?,
                link: field(item.link(), "link")?,
                date: DateTime::parse_from_rfc2822(&published)?
                    .with_timezone(&jst)
                    .date_naive(),
                source: source.name,
            })
        })
        .collect()
}
