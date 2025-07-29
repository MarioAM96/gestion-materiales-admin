import { fetchData } from "@/services/apiService";
import { SlArrowRightCircle } from "react-icons/sl";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  addToast,
} from "@heroui/react";
import { Input } from "@heroui/react";
import { useState, useEffect, useCallback } from "react";
import { LuBadgeX } from "react-icons/lu";
import { updateData } from "@/services/apiService";


export default function FibraPointstable() {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTableData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchData(`searchfpregister/${searchValue}`);

        if (result.success) {
          setTableData(result.data);
        } else {
          setTableData([]);
        }
      } catch (err: any) {
        if (err.status === 404) {
          setTableData([]);
        } else {
          setError("Error al realizar la búsqueda");
          setTableData([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (searchValue.trim() !== "") {
      fetchTableData();
    } else {
      setTableData([]);
      setIsLoading(false);
      setError(null);
    }
  }, [searchValue]);

  const handleActualizarStatusItem = useCallback(async (id: number, status: string) => {
    try {
      const result = await updateData("update-status/" + id, {
        status: status,
      });
      addToast({
        title: "Éxito",
        description: result.message || "Ítem actualizado correctamente",
        color: "success",
      });
      // Actualizamos el ítem en tableData con los datos devueltos por la API
      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === id ? result.data : item
        )
      );
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al procesar el ítem",
        color: "danger",
      });
    }
  }, []);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar por número de contrato..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="max-w-md"
      />

      <Table aria-label="Tabla de puntos fibra">
        <TableHeader>
          <TableColumn>ID CONTRATO</TableColumn>
          <TableColumn>ID TICKET</TableColumn>
          <TableColumn>PUNTOS ANTES</TableColumn>
          <TableColumn>PUNTOS CANJEADOS</TableColumn>
          <TableColumn>PUNTOS DESPUÉS</TableColumn>
          <TableColumn>ID CAUSAL SUBCATEGORIA</TableColumn>
          <TableColumn>FECHA DE CREACIÓN</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>VALOR REAL</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : tableData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center">
                No se encontraron resultados
              </TableCell>
            </TableRow>
          ) : (
            tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.idContrato}</TableCell>
                <TableCell>{row.idTicket}</TableCell>
                <TableCell>{row.puntos_antes_canje}</TableCell>
                <TableCell>{row.puntos_canjeados}</TableCell>
                <TableCell>{row.puntos_despues_canje}</TableCell>
                <TableCell>{row.idcausal_subcategoria}</TableCell>
                <TableCell>{row.created_at}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.valor_real}</TableCell>
                <TableCell>
                  <Tooltip color="danger" content="Rechazar ítem">
                    <span
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => handleActualizarStatusItem(row.id, "RECHAZADO")}
                    >
                      <LuBadgeX />
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip color="success" content="Procesar ítem">
                    <span
                      className="text-lg text-success cursor-pointer active:opacity-50"
                      onClick={() => handleActualizarStatusItem(row.id, "PROCESADO")}
                    >
                      <SlArrowRightCircle />
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
