export default function ProductListLoading() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-pulse">
      {/* Skeleton Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-9 w-36 bg-blue-600/30 dark:bg-blue-600/20 rounded-md"></div>
        </div>
      </div>

      {/* Skeleton Table Container */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-800/50">
                <th className="p-4"><div className="h-3 w-12 bg-zinc-300 dark:bg-zinc-700 rounded"></div></th>
                <th className="p-4"><div className="h-3 w-24 bg-zinc-300 dark:bg-zinc-700 rounded"></div></th>
                <th className="p-4"><div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700 rounded"></div></th>
                <th className="p-4"><div className="h-3 w-20 bg-zinc-300 dark:bg-zinc-700 rounded"></div></th>
                <th className="p-4"><div className="h-3 w-14 bg-zinc-300 dark:bg-zinc-700 rounded"></div></th>
                <th className="p-4 text-right"><div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700 rounded ml-auto"></div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {/* Generate 5 baris skeleton palsu untuk simulasi POV profesional */}
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="p-4"><div className="w-12 h-12 rounded bg-zinc-200 dark:bg-zinc-800"></div></td>
                  <td className="p-4 space-y-1.5">
                    <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
                  </td>
                  <td className="p-4"><div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                  <td className="p-4"><div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div></td>
                  <td className="p-4"><div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div></td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                      <div className="h-6 w-12 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                      <div className="h-6 w-14 bg-red-100 dark:bg-red-950/40 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}