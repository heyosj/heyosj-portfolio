import React from "react";

type DataRow = {
  label: string;
  value: React.ReactNode;
};

export default function DataTable({
  rows,
  headers,
}: {
  rows: DataRow[];
  headers?: [string, string];
}) {
  const showHeader = Array.isArray(headers) && headers.length === 2;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/70 p-4 sm:p-5">
      <div className="hidden sm:block">
        <table className="data-table w-full table-fixed text-sm text-left">
          <colgroup>
            <col style={{ width: "30%" }} />
            <col />
          </colgroup>
        {showHeader && (
          <thead>
            <tr>
              <th className="text-left text-xs uppercase tracking-wide muted py-2 px-4">
                {headers[0]}
              </th>
              <th className="text-left text-xs uppercase tracking-wide muted py-2 px-4">
                {headers[1]}
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-[var(--border)] last:border-0">
              <th
                scope="row"
                className="data-table__label py-3 px-4 font-semibold text-sm whitespace-nowrap break-normal [overflow-wrap:normal]"
              >
                {row.label}
              </th>
              <td className="data-table__value py-3 px-4 text-sm break-words [overflow-wrap:anywhere] [&_code]:font-mono [&_code]:break-words [&_code]:[overflow-wrap:anywhere]">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <div className="data-table block sm:hidden text-left">
        {rows.map((row) => (
          <div key={row.label} className="border-b border-[var(--border)] last:border-0 px-4 py-3">
            <div className="data-table__label text-xs font-semibold muted whitespace-nowrap break-normal [overflow-wrap:normal]">
              {row.label}
            </div>
            <div className="data-table__value mt-1 text-sm break-words [overflow-wrap:anywhere] [&_code]:font-mono [&_code]:break-words [&_code]:[overflow-wrap:anywhere]">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
