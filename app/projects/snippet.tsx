"use client";

import { Snippet } from "@heroui/react";

export default function SnippetAccount() {
  const accounts = [
    "gestionmaterialesfmax@gmail.com",
    "gestionmaterialesprod@gestionmaterialesprod.iam.gserviceaccount.com",
  ];

  return (
    <div className="flex flex-wrap gap-3 p-2">
      {accounts.map((account, index) => (
        <div className="flex items-center space-x-1 w-full sm:w-auto" key={index}>
          <span className="flex-shrink-0 w-4 text-gray-400 text-sm">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <Snippet symbol="" color="success" className="w-full truncate">
              {account}
            </Snippet>
          </div>
        </div>
      ))}
    </div>
  );
}