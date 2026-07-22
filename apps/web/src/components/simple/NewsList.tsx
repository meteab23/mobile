"use client";

interface NewsItem {
  title: string;
  url: string;
  time: string;
  sentiment?: string;
}

export function NewsList({ news }: { news: NewsItem[] }) {
  if (news.length === 0) {
    return <p className="text-sm text-zinc-600">No recent news available.</p>;
  }

  return (
    <div className="space-y-2">
      {news.map((n, i) => (
        <a
          key={i}
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2 hover:border-zinc-700"
        >
          <p className="text-sm text-zinc-300 line-clamp-2">{n.title}</p>
          <div className="mt-1 flex gap-2 text-xs text-zinc-600">
            {n.sentiment && (
              <span
                className={
                  n.sentiment === "positive"
                    ? "text-emerald-500"
                    : n.sentiment === "negative"
                      ? "text-red-500"
                      : ""
                }
              >
                {n.sentiment}
              </span>
            )}
            <span>{new Date(n.time).toLocaleDateString()}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
