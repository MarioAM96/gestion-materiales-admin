"use client";

import React, { useEffect, useState, useMemo } from "react";
import { SlArrowRightCircle } from "react-icons/sl";
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
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@heroui/react";
import { fetchData, postData } from "@/services/apiService";
import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icons";
import { Skeleton } from "@heroui/react";
import { SearchIcon } from "lucide-react";
import Pusher from "pusher-js";

// Column definitions for the table
export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "ID Contrato", uid: "idContrato", sortable: true },
  { name: "ID Ticket", uid: "idTicket", sortable: true },
  {
    name: "ID Causal Subcategoría",
    uid: "idcausal_subcategoria",
    sortable: true,
  },
  { name: "Fecha Informe", uid: "fecha_informe", sortable: true },
  { name: "Puntos Después Canje", uid: "puntos_despues_canje", sortable: true },
  { name: "Estado Ticket", uid: "estado_ticket", sortable: false },
  { name: "ACTIONS", uid: "actions", sortable: false },
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
  Solucionado: "success",
  "Visita Aprobada": "primary",
  "En Visita": "warning",
  Abierto: "danger",
  PENDIENTE: "default",
};

// Status filter options
const statusOptions = [
  { name: "Solucionado", uid: "Solucionado" },
  { name: "Visita Aprobada", uid: "Visita Aprobada" },
  { name: "En Visita", uid: "En Visita" },
  { name: "Abierto", uid: "Abierto" },
  { name: "Pendiente", uid: "PENDIENTE" },
];

export default function FPRegistradosTable() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10;

  // Configuración de Pusher para escuchar eventos en tiempo real
  useEffect(() => {
    const pusher = new Pusher("1d159ac153a09a146938", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("my-channel");
    channel.bind("my-event", (eventData: any) => {
      //console.log("Evento recibido:", eventData);
      // Actualizar los datos de la tabla
      setData(
        (prevData) =>
          prevData
            .map((item) =>
              item.idTicket === eventData.idTicket
                ? { ...item, status: eventData.status }
                : item
            )
            .filter((item) => item.status === "PENDIENTE") // Opcional: Filtrar los procesados
      );
      addToast({
        title: "Actualización",
        description: `Estado del ticket ${eventData.idTicket} actualizado a ${eventData.status}`,
        color: "success",
      });
    });

    return () => {
      channel.unbind();
      pusher.unsubscribe("my-channel");
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchData("get-regfpoints");
        if (result.status === "success") {
          // addToast({
          //   title: "Ok",
          //   description: result.message || "Datos cargados correctamente",
          //   color: "success",
          // });
          setData(result.data);
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
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  const handleProcessItem = async (idTicket: string) => {
    try {
      const result = await postData("reproceso_fibrapoints", {
        id_ticket: idTicket,
      });

      addToast({
        title: "Éxito",
        description: result.message || "Ítem procesado correctamente",
        color: "success",
      });

      // Opcional: Actualizar la tabla después del procesamiento, por ejemplo, eliminando la fila o actualizando el estado.
      // setData((prevData) =>
      //   prevData.filter((item) => item.idTicket !== idTicket)
      // );
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al procesar el ítem",
        color: "danger",
      });
      //console.error("Error procesando el ítem:", error);
    }
  };

  // Filtering data based on search term and selected status
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (item) => item.estado_ticket === selectedStatus
      );
    }

    return filtered;
  }, [data, searchTerm, selectedStatus]);

  // Sorting data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredData, sortDescriptor]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSortChange = (column: string) => {
    setSortDescriptor((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: string | number) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "id":
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
        case "idTicket":
          return (
            <div className="flex flex-col">
              <p className="text-sm text-default-400">{cellValue}</p>
            </div>
          );
        case "idcausal_subcategoria":
          return (
            <div className="flex items-center gap-2">
              <p className="text-sm text-default-400">{cellValue}</p>
              <Tooltip content="Ver detalles">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() =>
                    console.log(
                      `Ver detalles de ID Causal Subcategoría: ${cellValue}`
                    )
                  }
                >
                  <EyeIcon />
                </span>
              </Tooltip>
            </div>
          );
        case "fecha_informe":
          return (
            <div className="flex flex-col">
              <p className="text-sm text-default-400">{cellValue || "N/A"}</p>
            </div>
          );
        case "puntos_despues_canje":
          return (
            <div className="flex flex-col">
              <p className="text-sm text-default-400">{cellValue}</p>
            </div>
          );
        case "estado_ticket":
          return (
            <Chip
              className="capitalize"
              color={
                statusColorMap[
                  item.estado_ticket as keyof typeof statusColorMap
                ]
              }
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
              <Tooltip color="success" content="Procesar ítem">
                <span
                  className="text-lg text-success cursor-pointer active:opacity-50"
                  onClick={() => handleProcessItem(item.idTicket)}
                >
                  <SlArrowRightCircle />
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

  if (isLoading) {
    return (
      <Table aria-label="Tabla de puntos registrados - Cargando">
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
          {[...Array(5)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.uid}>
                  {column.uid === "actions" ? (
                    <div className="relative flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                  ) : column.uid === "estado_ticket" ? (
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
    <div className="flex flex-col gap-4">
      {/* Search and Filter Controls */}
      <div className="flex justify-between gap-3 items-center">
        <Input
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<SearchIcon className="w-4 h-4" />}
          className="max-w-xs"
        />
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">{selectedStatus || "Estado"}</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Filtro de estado"
            onAction={(key) => setSelectedStatus(key as string)}
          >
            <>
              <DropdownItem key="">Todos</DropdownItem>
              {statusOptions.map((option) => (
                <DropdownItem key={option.uid}>{option.name}</DropdownItem>
              ))}
            </>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Table */}
      <Table aria-label="Tabla de puntos registrados">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              onClick={() => column.sortable && handleSortChange(column.uid)}
              className={column.sortable ? "cursor-pointer" : ""}
            >
              {column.name}
              {sortDescriptor.column === column.uid && (
                <span>
                  {sortDescriptor.direction === "ascending" ? " ↑" : " ↓"}
                </span>
              )}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={paginatedData} emptyContent="No se encontraron datos">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          total={totalPages}
          page={page}
          onChange={setPage}
          showControls
        />
      </div>
    </div>
  );
}
