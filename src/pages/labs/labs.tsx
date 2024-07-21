import { Page } from '@/components/page/page';
import { Link } from 'react-router-dom';
import { experiments, githubBaseUrl } from './constants';

export const Labs = () => {
  return (
    <Page name="Labs" description="Some experiments I've been working on" repo={`${githubBaseUrl}/pages/labs/labs.tsx`}>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 justify-items-center text-center">
        {experiments.sort((a, b) => a.title.localeCompare(b.title)).sort().map(item => (
          <div
            key={item.title}
            className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex flex-col items-center pt-4 pb-10">
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {item.title}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </span>
              <div className="flex mt-4 md:mt-6">
                <Link
                  to={item.link}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  View
                </Link>
                <Link
                  to={item.repo}
                  className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Code
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};
