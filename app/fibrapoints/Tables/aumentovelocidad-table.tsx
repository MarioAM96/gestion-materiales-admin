"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import CausalSubcategoryModal from "../Modals/modalcausal";
import { DetailsDropdown } from "../Actions/Dropdown";
import debounce from "lodash.debounce"; // Add lodash for debouncing search

// Status color mapping for consistent visual feedback (original unchanged)
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

// Table column definitions (original unchanged)
const columns = [
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
  { name: "Fecha Creación", uid: "created_at", sortable: true },
  { name: "Estado Ticket", uid: "estado_ticket", sortable: false },
  { name: "Acciones", uid: "actions", sortable: false },
];

// Status filter options (original unchanged)
const statusOptions = [
  { name: "Solucionado", uid: "Solucionado" },
  { name: "Visita Aprobada", uid: "Visita Aprobada" },
  { name: "En Visita", uid: "En Visita" },
  { name: "Abierto", uid: "Abierto" },
  { name: "Pendiente", uid: "PENDIENTE" },
];

export default function AumentoVelocidadTable() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = useState<number>(1);
  const [isCausalModalOpen, setIsCausalModalOpen] = useState<boolean>(false);
  const [causalModalData, setCausalModalData] = useState<any>(null);
  const rowsPerPage = 10;

  // Debounce search input to prevent excessive filtering
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Pusher setup for real-time updates
  useEffect(() => {
    const pusher = new Pusher("1d159ac153a09a146938", {
      cluster: "us2",
    });
    const channel = pusher.subscribe("my-channel");
    channel.bind("my-event", (eventData: any) => {
      setData((prevData) => {
        if (!prevData.some((item) => item.idTicket === eventData.idTicket)) {
          setPage(1); // Reset to first page on new data
          addToast({
            title: "Nuevo Elemento",
            description: `Ticket ${eventData.idTicket} agregado (${eventData.estado_ticket})`,
            color: "success",
          });
          return [...prevData, eventData];
        }
        return prevData;
      });
    });
    return () => {
      channel.unbind();
      pusher.unsubscribe("my-channel");
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchData("get-regfpointsaumentovel");
        if (result.status === "success") {
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

  // Process item handler with confirmation
  const handleProcessItem = useCallback(async (id: string) => {
    try {
      const result = await postData("procesar-fp", { idFibrapoint: id });
      addToast({
        title: "Éxito",
        description: result.message || "Ticket procesado correctamente",
        color: "success",
      });
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al procesar el ticket",
        color: "danger",
      });
      console.error("Error procesando el ticket:", error);
    }
  }, []);

  // Memoized filtering and sorting
  const filteredData = useMemo(() => {
    let filtered = [...data];
    if (debouncedSearchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value
            ?.toString()
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
        )
      );
    }
    if (selectedStatus) {
      filtered = filtered.filter(
        (item) => item.estado_ticket === selectedStatus
      );
    }
    return filtered;
  }, [data, debouncedSearchTerm, selectedStatus]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredData, sortDescriptor]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Memoized renderCell for performance
  const renderCell = useCallback(
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
              <Tooltip content="Ver detalles de la subcategoría">
                <button
                  className="text-lg text-default-400 cursor-pointer active:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => {
                    setCausalModalData({ idCausal: cellValue });
                    setIsCausalModalOpen(true);
                  }}
                  aria-label={`Ver detalles de subcategoría ${cellValue}`}
                >
                  <EyeIcon />
                </button>
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
        case "created_at":
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
              <Tooltip content="Detalles">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <DetailsDropdown item={item} />
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
                  onClick={() => handleProcessItem(item.id)}
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
    [handleProcessItem]
  );

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Buscar en cualquier campo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<SearchIcon className="w-4 h-4 text-gray-400" />}
            className="w-full sm:max-w-xs focus:ring-2 focus:ring-primary"
            aria-label="Buscar tickets"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="w-full sm:w-auto">
                {selectedStatus || "Filtrar por Estado"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtro por estado de ticket"
              onAction={(key) => setSelectedStatus((key as string) || null)}
            >
              <DropdownItem key="">Todos los estados</DropdownItem>
              <>
                {statusOptions.map((option) => (
                  <DropdownItem key={option.uid}>{option.name}</DropdownItem>
                ))}
              </>
            </DropdownMenu>
          </Dropdown>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedStatus(null);
            }}
            className="w-full sm:w-auto"
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Table with responsive and hover effects */}
      <div className="overflow-x-auto">
        <Table
          aria-label="Tabla de puntos registrados para aumento de velocidad"
          className="min-w-full"
          isStriped
          removeWrapper
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                onClick={() =>
                  column.sortable &&
                  setSortDescriptor((prev) => ({
                    column: column.uid,
                    direction:
                      prev.column === column.uid &&
                      prev.direction === "ascending"
                        ? "descending"
                        : "ascending",
                  }))
                }
                className={`${column.sortable ? "cursor-pointer" : ""} text-sm font-medium`}
              >
                <div className="flex items-center gap-1">
                  {column.name}
                  {sortDescriptor.column === column.uid && (
                    <span className="text-xs">
                      {sortDescriptor.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={paginatedData}
            emptyContent={
              <div className="py-6 text-center text-gray-500">
                <p>No se encontraron datos que coincidan con los filtros.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus(null);
                  }}
                >
                  Limpiar Filtros
                </Button>
              </div>
            }
            loadingContent={
              <div className="py-6 text-center">
                <Skeleton className="h-6 w-1/4 mx-auto mb-2" />
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col.uid}>
                        <Skeleton className="h-4 w-full rounded-md" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </div>
            }
            isLoading={isLoading}
          >
            {(item) => (
              <TableRow key={item.id} className="transition-colors">
                {(columnKey) => (
                  <TableCell className="py-3">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination with enhanced UX */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
          <p className="text-sm text-gray-500">
            Mostrando {paginatedData.length} de {sortedData.length} resultados
          </p>
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
            className="mx-auto sm:mx-0"
            variant="light"
          />
        </div>
      )}

      {/* Modal for Causal Subcategory */}
      <CausalSubcategoryModal
        isOpen={isCausalModalOpen}
        onClose={() => setIsCausalModalOpen(false)}
        data={causalModalData}
      />
    </div>
  );
}
