import {
  Dropdown,
  DropdownSection,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import React, { useState } from "react";
import {
  AddNoteBulkIcon,
  CopyDocumentBulkIcon,
  EditDocumentBulkIcon,
  DeleteDocumentBulkIcon,
  EyeIcon,
} from "@heroui/shared-icons";
import clsx from "clsx";
import TicketDetailsModal from "../Modals/TicketDetailsModal";

// Define una interfaz para el tipo de datos de `item` (ajusta según tu estructura de datos)
interface TicketItem {
  idTicket: string;
  idContrato: string;
  estado_ticket: string;
  // otros campos relevantes
}

const iconClasses =
  "text-2xl text-default-500 pointer-events-none flex-shrink-0";

export const DetailsDropdown = ({ item }: { item: TicketItem }) => {
  console.log("Item recibido:", item);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [ticketModalData, setTicketModalData] = useState<TicketItem | null>(null);

  const handleViewTicketDetails = (item: TicketItem) => {
    setTicketModalData(item);
    setIsTicketModalOpen(true);
  };

  return (
    <>
      <Dropdown className="shadow-xl" placement="bottom">
        <DropdownTrigger>
          <EyeIcon />
        </DropdownTrigger>
        <DropdownMenu
          closeOnSelect
          aria-label="Actions"
          color="default"
          variant="flat"
        >
          <DropdownSection title="Detalles">
            <DropdownItem
              key="new"
              onClick={() => handleViewTicketDetails(item)}
              description="Ver detalles del ticket"
              startContent={<AddNoteBulkIcon className={iconClasses} />}
            >
              Ticket
            </DropdownItem>
            <DropdownItem
              key="copy"
              description="Copiar enlace del archivo"
              startContent={<CopyDocumentBulkIcon className={iconClasses} />}
            >
              FibraPoints
            </DropdownItem>
            <DropdownItem
              key="edit"
              description="Editar el archivo"
              startContent={<EditDocumentBulkIcon className={iconClasses} />}
            >
              Edit file
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Danger zone">
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              description="Eliminar permanentemente el archivo"
              startContent={
                <DeleteDocumentBulkIcon
                  className={clsx(iconClasses, "!text-danger")}
                />
              }
            >
              Delete file
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <TicketDetailsModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        isLoading={false}
        data={ticketModalData}
      />
    </>
  );
};