"use client";

import { Snippet } from "@heroui/react";

export default function SnippetAccount() {
  const accounts = [
    {
      email: "gestionmaterialesprod@gestionmaterialesprod.iam.gserviceaccount.com",
      file: "gestionmaterialesprod-76ca7da29363.json"
    },
    {
      email: "service-account@materiales-fibramax.iam.gserviceaccount.com",
      file: "materiales-fibramax-65bb0c225f90.json"
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 p-2">
      {accounts.map((account, index) => (
        <div className="flex items-center space-x-1 w-full sm:w-auto" key={index}>
          <div className="flex-1 min-w-0">
            <Snippet symbol="" color="success" className="w-full truncate">
              {account.email}
            </Snippet>
            <p className="text-sm text-gray-500 mt-1">
              Archivo asociado: <span className="font-medium">{account.file}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}