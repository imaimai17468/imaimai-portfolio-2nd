"use client";

import { useState } from "react";
import { WORKS } from "./const";
import type { Work } from "./const";

export const Works: React.FC = () => {
  const [selectedWork, setSelectedWork] = useState<Work>(WORKS[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center my-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Works</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-4">
            {WORKS.map((work) => (
              <div
                key={work.title}
                onClick={() => setSelectedWork(work)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedWork(work);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedWork.title === work.title
                    ? "bg-white dark:bg-gray-800 shadow-lg ring-2 ring-blue-500"
                    : "bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
                }`}
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{work.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{work.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
              <img src={selectedWork.image} alt={selectedWork.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">{selectedWork.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{selectedWork.description}</p>
              {selectedWork.url && (
                <a
                  href={selectedWork.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <span>サイトを見る</span>
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
