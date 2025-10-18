import React from 'react';
import { router } from '@inertiajs/react';

export default function KycPagination({ kycs }) {
  if (!kycs || kycs.data.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {kycs.from} to {kycs.to} of {kycs.total} results
        </div>
        <div className="flex gap-2">
          {kycs.links.map((link, index) => (
            <button
              key={index}
              onClick={() => link.url && router.get(link.url)}
              disabled={!link.url}
              className={`px-3 py-1 rounded text-sm ${link.active
                ? 'bg-indigo-600 text-white'
                : link.url
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}