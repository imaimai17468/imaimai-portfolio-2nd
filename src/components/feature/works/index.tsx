"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Background } from "./background";
import type { Work } from "./const";
import { WORKS } from "./const";

export const Works: React.FC = () => {
  const [selectedWork, setSelectedWork] = useState<Work>(WORKS[0]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleWorkClick = (work: Work) => {
    setSelectedWork(work);
    setDialogOpen(true);
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <Background />
      </div>
      <div className="container mx-auto px-6 py-12">
        <div className="text-center my-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Works</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-4">
            {WORKS.map((work) => (
              <button
                key={work.title}
                onClick={() => handleWorkClick(work)}
                type="button"
                className={`w-full text-left p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedWork.title === work.title
                    ? "bg-white dark:bg-gray-800 shadow-lg ring-2 ring-blue-500"
                    : "bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
                }`}
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{work.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{work.description}</p>
              </button>
            ))}
          </div>

          {/* PC表示: 右側に固定表示 */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
              <Image src={selectedWork.image} alt={selectedWork.title} fill className="object-cover" />
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

      {/* SP表示: Dialogで表示 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto lg:hidden">
          <DialogHeader>
            <DialogTitle>{selectedWork.title}</DialogTitle>
            <DialogDescription>{selectedWork.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden rounded-lg">
              <Image src={selectedWork.image} alt={selectedWork.title} fill className="object-cover" />
            </div>
            {selectedWork.url && (
              <a
                href={selectedWork.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <span>サイトを見る</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
        </DialogContent>
      </Dialog>
    </div>
  );
};
