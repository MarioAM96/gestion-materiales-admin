"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  addToast,
} from "@heroui/react";
import { fetchData } from "@/services/apiService";
import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icons";
import { Skeleton } from "@heroui/react";

// Ajustar las columnas para que coincidan con la nueva estructura de datos de la API
export const columns = [
  { name: "ID Ticket", uid: "id_ticket" },
  { name: "ID Contrato", uid: "idContrato" },
  { name: "Fecha Incidencia", uid: "fecha_insidencia" },
  { name: "Fecha Informe", uid: "fecha_informe" },
  { name: "ID Causal Subcategoría", uid: "idcausal_subcategoria" },
  { name: "Solucionado", uid: "ticket_solucionado" },
  { name: "Usuario", uid: "usuario" },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<
  string,
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined
> = {
  solved: "success",
  pending: "danger",
};

export default function FPSinRegistroTable() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData("get-noregisteredfpoints");
        // Verificamos el status de la respuesta
        if (result.status === "success") {
          // Mapear los datos para agregar un estado de "ticket_solucionado"
          const modifiedData = result.data.map((item: any) => ({
            ...item,
            ticket_solucionado: item.ticket_solucionado ? "solved" : "pending",
          }));
          // addToast({
          //   title: "Ok",
          //   description: result.message || "Datos cargados correctamente",
          //   color: "success",
          // });
          setData(modifiedData);
        } else {
          throw new Error(
            result.message || "Error en la respuesta del servidor"
          );
        }
      } catch (error) {
        addToast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Error al cargar los datos",
          color: "danger",
        });
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const renderCell = React.useCallback(
    (item: any, columnKey: string | number) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "id_ticket":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );
        case "idContrato":
          return (
            <div className="flex flex-col">
              <p className="text-sm text-default-400">{cellValue}</p>
            </div>
          );
        case "fecha_insidencia":
        case "fecha_informe":
          return (
            <div className="flex flex-col">
              <p className="text-sm text-default-400">{cellValue}</p>
            </div>
          );
        case "idcausal_subcategoria":
          return (
            <div className="flex flex-col">
              <p className="text-sm text-default-400">{cellValue}</p>
            </div>
          );
        case "ticket_solucionado":
          return (
            <Chip
              className="capitalize"
              color={
                statusColorMap[
                  item.ticket_solucionado as keyof typeof statusColorMap
                ]
              }
              size="sm"
              variant="flat"
            >
              {cellValue === "solved" ? "Solucionado" : "Pendiente"}
            </Chip>
          );
        case "usuario":
          return (
            <div className="flex flex-col">
              <p className="text-sm text-default-400">{cellValue}</p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Edit item">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete item">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  if (data.length === 0) {
    return (
      <Table aria-label="Tabla de puntos no registrados - Cargando">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {/* Simulamos 5 filas de carga */}
          {[...Array(5)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.uid}>
                  {column.uid === "actions" ? (
                    <div className="relative flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                  ) : column.uid === "ticket_solucionado" ? (
                    <Skeleton className="h-6 w-16 rounded-md" />
                  ) : (
                    <Skeleton className="h-4 w-full rounded-md" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table aria-label="Tabla de puntos no registrados">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item) => (
          <TableRow key={item.id_ticket}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
