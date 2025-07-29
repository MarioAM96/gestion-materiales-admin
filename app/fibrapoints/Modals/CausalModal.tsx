import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import CausalSubcategoryCard from "../Cards/CausalInfo";

type CausalSubcategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data?: { idCausal: number } | null;
};

const CausalSubcategoryModal: React.FC<CausalSubcategoryModalProps> = ({
  isOpen,
  onClose,
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
        <>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Detalles de Causal</h2>
          </ModalHeader>
          <ModalBody>
            {data ? (
              <CausalSubcategoryCard idCausal={data.idCausal} />
            ) : (
              <p>No se encontraron datos para mostrar.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default CausalSubcategoryModal;