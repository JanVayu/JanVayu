#!/usr/bin/env python3
"""
Agent-Reach AQI Social Media Fetcher

Uses Agent-Reach tools (bird CLI for Twitter, yt-dlp for YouTube)
and Jina Reader for enhanced news extraction. Outputs JSON to stdout
for ingestion by the Netlify feed-ingest function.

Designed to run in GitHub Actions on a schedule.
"""

import json
import os
import shutil
import subprocess
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone

# ── AQI search configuration ──
TWITTER_HASHTAGS = [
    "#DelhiAirQuality", "#DelhiPollution", "#DelhiSmog",
    "#AirQualityIndex", "#DelhiAir", "#StubbleBurning", "#CleanAirIndia",
]
TWITTER_QUERIES = [
    "delhi air quality", "delhi pollution AQI", "india air quality PM2.5",
]

YOUTUBE_QUERIES = [
    "delhi air quality 2026", "india air pollution AQI",
    "delhi smog pollution", "clean air india",
]

NEWS_URLS = [
    "https://news.google.com/rss/search?q=delhi+air+quality&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=india+pollution+AQI&hl=en-IN&gl=IN&ceid=IN:en",
]

JINA_READER_BASE = "https://r.jina.ai/"


def run_cmd(args, timeout=30):
    """Run a command and return (stdout, success)."""
    try:
        result = subprocess.run(
            args, capture_output=True, text=True, timeout=timeout
        )
        return result.stdout.strip(), result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError, OSError) as e:
        return str(e), False


def fetch_twitter():
    """Fetch AQI tweets using bird CLI."""
    bird = shutil.which("bird") or shutil.which("birdx")
    if not bird:
        print("bird CLI not found, skipping Twitter", file=sys.stderr)
        return []

    # Check auth
    _, ok = run_cmd([bird, "check"])
    if not ok:
        print("bird CLI not authenticated, skipping Twitter", file=sys.stderr)
        return []

    posts = []
    seen_ids = set()

    # Search hashtags
    for tag in TWITTER_HASHTAGS[:5]:
        output, ok = run_cmd([bird, "search", tag, "--count", "10"], timeout=15)
        if ok and output:
            for item in parse_bird_output(output, tag):
                key = item.get("link", item.get("text", "")[:80])
                if key not in seen_ids:
                    seen_ids.add(key)
                    posts.append(item)

    # Search queries
    for query in TWITTER_QUERIES[:3]:
        output, ok = run_cmd([bird, "search", query, "--count", "10"], timeout=15)
        if ok and output:
            for item in parse_bird_output(output, query):
                key = item.get("link", item.get("text", "")[:80])
                if key not in seen_ids:
                    seen_ids.add(key)
                    posts.append(item)

    return posts[:50]


def parse_bird_output(output, query):
    """Parse bird CLI search output into structured posts."""
    posts = []
    # bird outputs JSON or text depending on version
    try:
        data = json.loads(output)
        if isinstance(data, list):
            for item in data:
                posts.append({
                    "text": item.get("text", item.get("full_text", "")),
                    "author": item.get("user", {}).get("screen_name", item.get("username", "")),
                    "link": item.get("url", item.get("link", "")),
                    "date": item.get("created_at", ""),
                    "likes": item.get("favorite_count", item.get("likes", 0)),
                    "retweets": item.get("retweet_count", item.get("retweets", 0)),
                    "source": "twitter",
                    "query": query,
                })
        return posts
    except json.JSONDecodeError:
        pass

    # Fallback: parse text output line by line
    lines = output.strip().split("\n")
    current = {}
    for line in lines:
        line = line.strip()
        if not line:
            if current.get("text"):
                current["source"] = "twitter"
                current["query"] = query
                posts.append(current)
            current = {}
            continue
        if line.startswith("@"):
            current["author"] = line.lstrip("@").split()[0] if line else ""
        elif line.startswith("http"):
            current["link"] = line
        elif not current.get("text"):
            current["text"] = line
    if current.get("text"):
        current["source"] = "twitter"
        current["query"] = query
        posts.append(current)
    return posts


def fetch_youtube():
    """Fetch AQI YouTube videos using yt-dlp."""
    ytdlp = shutil.which("yt-dlp")
    if not ytdlp:
        print("yt-dlp not found, skipping YouTube", file=sys.stderr)
        return []

    videos = []
    seen_ids = set()

    for query in YOUTUBE_QUERIES[:3]:
        search_url = f"ytsearch5:{query}"
        output, ok = run_cmd(
            [ytdlp, "--dump-json", "--no-download", "--flat-playlist", search_url],
            timeout=30,
        )
        if not ok or not output:
            continue

        for line in output.strip().split("\n"):
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                vid_id = data.get("id", "")
                if vid_id in seen_ids:
                    continue
                seen_ids.add(vid_id)

                videos.append({
                    "title": data.get("title", ""),
                    "url": data.get("webpage_url", data.get("url", f"https://www.youtube.com/watch?v={vid_id}")),
                    "channel": data.get("channel", data.get("uploader", "")),
                    "channel_url": data.get("channel_url", data.get("uploader_url", "")),
                    "thumbnail": data.get("thumbnail", ""),
                    "duration": data.get("duration", 0),
                    "view_count": data.get("view_count", 0),
                    "upload_date": data.get("upload_date", ""),
                    "description": (data.get("description", "") or "")[:300],
                    "source": "youtube",
                    "query": query,
                })
            except json.JSONDecodeError:
                continue

    return videos[:20]


def fetch_jina_enhanced_news():
    """Use Jina Reader to extract enhanced article content from news URLs."""
    articles = []
    # First, fetch RSS to get article URLs
    for rss_url in NEWS_URLS:
        try:
            req = urllib.request.Request(rss_url, headers={
                "User-Agent": "JanVayu/1.0 AirQualityMonitor"
            })
            with urllib.request.urlopen(req, timeout=10) as resp:
                xml = resp.read().decode("utf-8", errors="replace")
        except (urllib.error.URLError, OSError) as e:
            print(f"RSS fetch failed: {e}", file=sys.stderr)
            continue

        # Parse RSS items (simple regex)
        import re
        items = re.findall(r"<item>(.*?)</item>", xml, re.DOTALL)
        for item_xml in items[:5]:
            title_m = re.search(r"<title>(.*?)</title>", item_xml, re.DOTALL)
            link_m = re.search(r"<link/>\s*(.*?)(?=\s*<)", item_xml, re.DOTALL)
            if not link_m:
                link_m = re.search(r"<link>(.*?)</link>", item_xml, re.DOTALL)
            pub_m = re.search(r"<pubDate>(.*?)</pubDate>", item_xml, re.DOTALL)
            source_m = re.search(r"<source[^>]*>(.*?)</source>", item_xml, re.DOTALL)

            title = title_m.group(1).strip() if title_m else ""
            link = link_m.group(1).strip() if link_m else ""
            pub_date = pub_m.group(1).strip() if pub_m else ""
            source = source_m.group(1).strip() if source_m else ""

            # Clean CDATA
            for tag in [title, source]:
                tag = re.sub(r"<!\[CDATA\[|\]\]>", "", tag)

            if not link:
                continue

            # Try Jina Reader for enhanced snippet
            snippet = ""
            try:
                jina_url = f"{JINA_READER_BASE}{link}"
                jina_req = urllib.request.Request(jina_url, headers={
                    "User-Agent": "JanVayu/1.0 AirQualityMonitor",
                    "Accept": "text/plain",
                })
                with urllib.request.urlopen(jina_req, timeout=10) as jina_resp:
                    content = jina_resp.read().decode("utf-8", errors="replace")
                    # Take first 500 chars as snippet
                    snippet = content[:500].strip()
            except (urllib.error.URLError, OSError):
                pass  # Jina failed, use empty snippet

            articles.append({
                "title": re.sub(r"<!\[CDATA\[|\]\]>", "", title).strip(),
                "link": link,
                "date": pub_date,
                "source": re.sub(r"<!\[CDATA\[|\]\]>", "", source).strip(),
                "snippet": snippet,
                "enhanced": bool(snippet),
            })

    # Deduplicate by title
    seen = set()
    unique = []
    for a in articles:
        key = a["title"].lower()[:50]
        if key not in seen:
            seen.add(key)
            unique.append(a)
    return unique[:30]


def main():
    timestamp = datetime.now(timezone.utc).isoformat()
    results = {"fetched_at": timestamp, "source": "agent-reach"}

    print("Fetching Twitter via bird CLI...", file=sys.stderr)
    twitter_posts = fetch_twitter()
    results["twitter"] = {
        "posts": twitter_posts,
        "count": len(twitter_posts),
    }
    print(f"  Found {len(twitter_posts)} tweets", file=sys.stderr)

    print("Fetching YouTube via yt-dlp...", file=sys.stderr)
    youtube_videos = fetch_youtube()
    results["youtube"] = {
        "videos": youtube_videos,
        "count": len(youtube_videos),
    }
    print(f"  Found {len(youtube_videos)} videos", file=sys.stderr)

    print("Fetching enhanced news via Jina Reader...", file=sys.stderr)
    news_articles = fetch_jina_enhanced_news()
    results["news_enhanced"] = {
        "articles": news_articles,
        "count": len(news_articles),
    }
    print(f"  Found {len(news_articles)} articles", file=sys.stderr)

    # Output JSON to stdout for the workflow to POST
    json.dump(results, sys.stdout, indent=2, ensure_ascii=False)
    print(file=sys.stderr)
    print("Done!", file=sys.stderr)


if __name__ == "__main__":
    main()
