"use client";

export function IncidentTimeline({ events = [], className = "" }) {
  return (
    <div className={className}>
      <ul className="space-y-0">
        {events.map((ev, i) => (
          <li key={ev.id ?? i} className="relative flex gap-3 border-l-2 border-indigo-500/30 pl-4 pb-4">
            <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-indigo-500" />
            <div className="flex-1 text-sm">
              <div className="font-medium text-slate-100">{ev.title ?? ev.eventType}</div>
              <div className="text-xs text-slate-400">{ev.timestamp ?? ev.createdAt}</div>
              {ev.details ? <pre className="mt-1 overflow-auto rounded text-xs text-slate-400">{typeof ev.details === "string" ? ev.details : JSON.stringify(ev.details, null, 2)}</pre> : null}
            </div>
          </li>
        ))}
      </ul>
      {events.length === 0 ? <p className="text-sm text-slate-400">No incidents.</p> : null}
    </div>
  );
}
