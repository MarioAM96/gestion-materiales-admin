import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Skeleton,
} from "@heroui/react";
import TicketCard from "../Cards/TicketInfo";

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  data: any | null;
}

export default function TicketDetailsModal({
  isOpen,
  onClose,
  isLoading,
  data,
}: TicketDetailsModalProps) {
  return (
    <Modal
      scrollBehavior="inside"
      size="5xl"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
    >
      <ModalContent>
        <ModalHeader>
          {isLoading || !data ? "Cargando..." : `Detalles del Ticket ${data.idTicket || data.id_ticket}`}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {isLoading || !data ? (
              // Display a loading skeleton or placeholder while data is loading or null
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
              <TicketCard idTicket={data.idTicket ? data.idTicket : data.id_ticket} />
            )}
            {/* Puedes agregar más campos según los datos disponibles */}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}