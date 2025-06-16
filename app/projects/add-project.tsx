"use client";

import React from "react";
import { Form, Input, Button } from "@heroui/react";
import { postDataForm } from "@/services/apiService";
import { addToast } from "@heroui/toast";

export default function NewProjectForm() {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = formData.get("jsonFile") as File;
    if (!fileInput || fileInput.size === 0) {
      return;
    }

    try {
      const response = await postDataForm("insert-keys", formData);
      if (response.statusCode === 200) {
        addToast({
          title: "Proyecto creado",
          description: response.message,
          color: "success",
        });
      } else {
        addToast({
          title: "Error al crear el proyecto",
          description: response.message,
          color: "danger",
        });
      }
      console.log(response);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <Input
        isRequired
        errorMessage="Por favor, ingresa un nombre de usuario válido"
        label="Nombre de usuario"
        labelPlacement="outside"
        name="email"
        placeholder="Nombre de usuario"
        type="text"
      />

      <Input
        isRequired
        errorMessage="Por favor, ingresa una contraseña válida"
        label="Contraseña"
        labelPlacement="outside"
        name="password"
        placeholder="Contraseña"
        type="password"
      />

      <Input
        isRequired
        errorMessage="Por favor, ingresa un Sheet ID válido"
        label="Sheet ID"
        labelPlacement="outside"
        name="sheetid"
        placeholder="Sheet ID"
        type="text"
      />

      <Input
        isRequired
        errorMessage="Por favor, sube el archivo JSON"
        label="Archivo JSON"
        labelPlacement="outside"
        name="jsonFile"
        placeholder="Archivo JSON"
        type="file"
        accept=".json"
      />

      <div className="flex gap-2 mt-4">
        <Button color="primary" type="submit">
          Guardar
        </Button>
      </div>
    </Form>
  );
}
