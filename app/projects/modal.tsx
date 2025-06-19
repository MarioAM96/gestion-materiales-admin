"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import { Form, Input, Select, SelectItem } from "@heroui/react";
import { postDataForm } from "@/services/apiService";
import { addToast } from "@heroui/toast";
import { fetchData } from "@/services/apiService";

export default function ModalForm() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [jsonFiles, setJsonFiles] = useState<string[]>([]);
  const [selectedFileContent, setSelectedFileContent] = useState<any>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Estado para controlar el spinner

  // Cargar lista de archivos JSON al montar el componente
  useEffect(() => {
    const fetchJsonFiles = async () => {
      try {
        const response = await fetchData("keys");
        setJsonFiles(response.files);
      } catch (error) {
        console.error("Error fetching JSON files:", error);
        addToast({
          title: "Error",
          description: "No se pudieron cargar los archivos JSON.",
          color: "danger",
        });
      }
    };
    fetchJsonFiles();
  }, []);

  // Manejar selección de archivo JSON y cargar su contenido
  const handleFileSelection = async (fileName: string) => {
    if (!fileName) return;
    setSelectedFileName(fileName);
    try {
      const response = await fetchData(`google-keys/${fileName}`);
      setSelectedFileContent(response.content);
      addToast({
        title: "Archivo Cargado",
        description: `Configuración de ${fileName} cargado correctamente.`,
        color: "success",
      });
    } catch (error) {
      console.error("Error fetching JSON file content:", error);
      setSelectedFileContent(null);
      addToast({
        title: "Error",
        description: "No se pudo cargar la configuración del archivo JSON.",
        color: "danger",
      });
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!selectedFileName || !selectedFileContent) {
      addToast({
        title: "Error",
        description:
          "Por favor, selecciona un archivo JSON válido y espera a que se cargue su contenido.",
        color: "danger",
      });
      return;
    }

    // Convertir el contenido JSON en un Blob para enviarlo como archivo
    const jsonBlob = new Blob([JSON.stringify(selectedFileContent)], {
      type: "application/json",
    });
    const jsonFile = new File([jsonBlob], selectedFileName, {
      type: "application/json",
    });
    formData.set("jsonFile", jsonFile);

    setIsSubmitting(true); // Mostrar spinner

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
    } catch (error) {
      console.error("Error posting data:", error);
      addToast({
        title: "Error",
        description: "Ocurrió un error inesperado. Inténtalo de nuevo.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false); // Ocultar spinner
    }
  };

  return (
    <>
      {/* Botón para abrir el modal con mejor accesibilidad */}
      <Button onPress={onOpen}>Nuevo Proyecto</Button>

      {/* Modal con animaciones y diseño mejorado */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="rounded-lg">
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
                  {/* Campos de entrada con mejor feedback visual */}
                  <Input
                    isRequired
                    errorMessage="Por favor, ingresa un nombre de usuario válido"
                    label="Nombre de usuario"
                    labelPlacement="outside"
                    name="email"
                    placeholder="Nombre de usuario"
                    type="text"
                    className="w-full"
                    variant="bordered"
                    aria-label="Nombre de usuario"
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
                    variant="bordered"
                    aria-label="Contraseña"
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
                    variant="bordered"
                    aria-label="Sheet ID"
                  />

                  {/* Select con indicador de carga */}
                  <Select
                    isRequired
                    errorMessage="Por favor, selecciona un archivo JSON"
                    label="Archivo JSON"
                    labelPlacement="outside"
                    name="jsonFileName"
                    placeholder="Selecciona un archivo JSON"
                    className="w-full"
                    variant="bordered"
                    onChange={(e) => handleFileSelection(e.target.value)}
                    aria-label="Archivo JSON"
                    isDisabled={jsonFiles.length === 0} // Deshabilitar si no hay archivos
                  >
                    {jsonFiles.map((file) => (
                      <SelectItem key={file}>{file}</SelectItem>
                    ))}
                  </Select>
                </Form>
              </ModalBody>
              <ModalFooter className="flex justify-end gap-2">
                {/* Botón de cerrar con mejor feedback */}
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="font-medium"
                  aria-label="Cerrar modal"
                >
                  Cerrar
                </Button>
                {/* Botón de guardar con spinner */}
                <Button
                  color="primary"
                  type="submit"
                  form="projectForm"
                  className="font-medium"
                  isDisabled={isSubmitting || !selectedFileContent} // Deshabilitar si está enviando o no hay archivo
                  aria-label="Guardar proyecto"
                  startContent={
                    isSubmitting ? <Spinner size="sm" color="white" /> : null
                  }
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}