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
} from "@heroui/react";
import { fetchData } from "@/services/apiService";
import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icons";
import { Skeleton } from "@heroui/react";

// Ajustamos las columnas para que coincidan con la nueva estructura de datos
export const columns = [
  { name: "ID", uid: "id" },
  { name: "Nombre del Documento", uid: "document_name" },
  { name: "Nombre del Archivo", uid: "filename" },
  { name: "SheetID asociado", uid: "sheetid" },
  { name: "STATUS", uid: "status" },
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
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function ProjectsTable() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData("get-keys");
        const modifiedData = result.map((item: any) => ({
          ...item,
          status: "active",
        }));
        setData(modifiedData);
      } catch (error) {
        //console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const renderCell = React.useCallback(
    (item: any, columnKey: string | number) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "document_name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );
        case "filename":
          return (
            <div className="flex flex-col">
              <p className="text-sm text-default-400">{cellValue}</p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[item.status as keyof typeof statusColorMap]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
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
      <Table aria-label="Tabla de proyectos - Cargando">
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
                  ) : column.uid === "status" ? (
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
    <Table aria-label="Tabla de proyectos">
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
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}