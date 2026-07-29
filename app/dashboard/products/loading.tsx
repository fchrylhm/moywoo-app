export default function ProductListLoading() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-pulse">
      {/* Skeleton Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="h-9 flex-1 sm:w-28 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-9 flex-1 sm:w-36 bg-blue-600/30 dark:bg-blue-600/20 rounded-md"></div>
        </div>
      </div>

      {/* A. SKELETON TABLE (DESKTOP) */}
      <div className="hidden md:block border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
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

      {/* B. SKELETON CARDS (MOBILE) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 shadow-sm space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <div className="h-4 w-14 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                  <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                </div>
                <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                <div className="h-3 w-1/2 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center">
              <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            </div>
            <div className="flex gap-2 pt-1">
              <div className="h-7 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-7 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-7 flex-1 bg-red-100 dark:bg-red-950/40 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}