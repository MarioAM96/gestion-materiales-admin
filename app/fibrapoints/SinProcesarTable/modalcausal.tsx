import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Skeleton,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";

import { Image } from "@heroui/react";
import { Icon } from "@iconify/react";

type CausalSubcategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  data?: {
    nombre_causal: string;
    estado_causal: string;
    puntos: number;
    idcausal_subcategoria: number | string;
    idsubcategoria_incidencia: number | string;
    fecha_registro_causal?: string;
    image_url?: string;
  } | null;
};

const CausalSubcategoryModal: React.FC<CausalSubcategoryModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  data,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-label="Detalles de Causal Subcategoría"
      size="lg"
    >
      <ModalContent>
        {isLoading ? (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <Skeleton className="h-6 w-1/3 rounded-md" />
            </ModalHeader>
            <ModalBody>
              <Card className="w-full shadow-lg">
                <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                  <div className="flex w-full justify-between items-center">
                    <Skeleton className="h-5 w-1/4 rounded-md" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-12 rounded-md" />
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="grid grid-cols-2 gap-4 p-4">
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="h-3 w-1/4 rounded-md mb-1" />
                      <Skeleton className="h-4 w-1/6 rounded-md" />
                    </div>
                    <div>
                      <Skeleton className="h-3 w-1/3 rounded-md mb-1" />
                      <Skeleton className="h-4 w-1/5 rounded-md" />
                    </div>
                    <div>
                      <Skeleton className="h-3 w-1/3 rounded-md mb-1" />
                      <Skeleton className="h-4 w-1/5 rounded-md" />
                    </div>
                    <div>
                      <Skeleton className="h-3 w-1/4 rounded-md mb-1" />
                      <Skeleton className="h-4 w-1/6 rounded-md" />
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <Skeleton className="h-48 w-full rounded-xl" />
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Skeleton className="h-10 w-20 rounded-md" />
            </ModalFooter>
          </>
        ) : data ? (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">Detalles de Causal</h2>
            </ModalHeader>
            <ModalBody>
              <Card className="w-full shadow-lg">
                <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                  <div className="flex w-full justify-between items-center">
                    <h4 className="font-bold text-xl">{data.nombre_causal}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">Estado:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          data.estado_causal === "1"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {data.estado_causal === "1" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="grid grid-cols-2 gap-4 p-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs uppercase font-bold text-gray-500">
                        Puntos
                      </p>
                      <p className="text-sm font-medium">{data.puntos}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold text-gray-500">
                        ID Causal Subcategoría
                      </p>
                      <p className="text-sm font-medium">
                        {data.idcausal_subcategoria}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold text-gray-500">
                        ID Subcategoría Incidencia
                      </p>
                      <p className="text-sm font-medium">
                        {data.idsubcategoria_incidencia}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold text-gray-500">
                        Fecha Registro
                      </p>
                      <p className="text-sm font-medium">
                        {data.fecha_registro_causal || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    {data.image_url && (
                      <Image
                        alt="Card background"
                        className="object-cover rounded-xl max-h-48 w-full"
                        src={data.image_url}
                      />
                    )}
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="flat" onClick={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        ) : (
          <ModalBody>
            <p>No se encontraron datos para mostrar.</p>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CausalSubcategoryModal;