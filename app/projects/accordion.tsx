"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import {
  InvalidCardIcon,
  MonitorMobileIcon,
  ShieldSecurityIcon,
  InfoIcon,
} from "@/components/icons";
import SnippetAccount from "./snippet";

export default function App() {
  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };

  const defaultContent = "Lorem ipsum dolor sit amet,";

  return (
    <Accordion
      className="p-2 flex flex-col gap-1 w-full max-w-[600px]"
      itemClasses={itemClasses}
      showDivider={false}
      variant="shadow"
    >
      <AccordionItem
        key="1"
        aria-label="Compartir Documento"
        classNames={{ subtitle: "text-warning" }}
        startContent={<InfoIcon className="text-warning" />}
        subtitle="Ver cuentas"
        title="Compartir Documento"
      >
        <p className="text-justify">
  El documento debe estar compartido con estas dos cuentas de correo con permisos de edición:
</p>

        <SnippetAccount />
      </AccordionItem>

      {/* <AccordionItem
        key="2"
        aria-label="Apps Permissions"
        startContent={<ShieldSecurityIcon />}
        subtitle="3 apps have read permissions"
        title="Apps Permissions"
      >
        {defaultContent}
      </AccordionItem> */}
      {/* <AccordionItem
        key="3"
        aria-label="Pending tasks"
        classNames={{ subtitle: "text-warning" }}
        startContent={<InfoIcon className="text-warning" />}
        subtitle="Complete your profile"
        title="Pending tasks"
      >
        {defaultContent}
      </AccordionItem> */}
      {/* <AccordionItem
        key="4"
        aria-label="Card expired"
        classNames={{ subtitle: "text-danger" }}
        startContent={<InvalidCardIcon className="text-danger" />}
        subtitle="Please, update now"
        title={
          <p className="flex gap-1 items-center">
            Card expired
            <span className="text-default-400 text-small">*4812</span>
          </p>
        }
      >
        {defaultContent}
      </AccordionItem> */}
    </Accordion>
  );
}
