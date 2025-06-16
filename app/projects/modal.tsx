"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Form, Input } from "@heroui/react";
import { postDataForm } from "@/services/apiService";
import { addToast } from "@heroui/toast";

export default function ModalForm() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = formData.get("jsonFile") as File;
    if (!fileInput || fileInput.size === 0) {
      addToast({
        title: "Error",
        description: "Por favor, sube un archivo JSON válido",
        color: "danger",
      });
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
        onClose(); // Cierra el modal al éxito
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
      addToast({
        title: "Error",
        description: "Ocurrió un error inesperado. Inténtalo de nuevo.",
        color: "danger",
      });
    }
  };

  return (
    <>
      <Button onPress={onOpen}>Nuevo Proyecto</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="max-w-md w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Nuevo Proyecto
              </ModalHeader>
              <ModalBody className="flex justify-center">
                <Form
                  id="projectForm"
                  className="w-full flex flex-col gap-6"
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
                    className="w-full"
                  />

                  <Input
                    isRequired
                    errorMessage="Por favor, ingresa una contraseña válida"
                    label="Contraseña"
                    labelPlacement="outside"
                    name="password"
                    placeholder="Contraseña"
                    type="password"
                    className="w-full"
                  />

                  <Input
                    isRequired
                    errorMessage="Por favor, ingresa un Sheet ID válido"
                    label="Sheet ID"
                    labelPlacement="outside"
                    name="sheetid"
                    placeholder="Sheet ID"
                    type="text"
                    className="w-full"
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
                    className="w-full"
                  />
                </Form>
              </ModalBody>
              <ModalFooter className="flex justify-end gap-2">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" type="submit" form="projectForm">
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}