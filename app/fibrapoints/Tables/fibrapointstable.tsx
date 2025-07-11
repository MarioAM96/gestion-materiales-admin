import { fetchData } from "@/services/apiService";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Input } from "@heroui/react";
import { useState, useEffect } from "react";

export default function FibraPointstable() {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
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
          // Si success es false, no lo tratamos como error, solo vaciamos los datos
          setTableData([]);
        }
      } catch (err: any) {
        // Manejo del error según el código de estado
        if (err.status === 404) {
          setTableData([]); // Caso de "no encontrado" no es un error crítico
        } else {
          setError("Error al realizar la búsqueda");
          setTableData([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Solo realizamos la búsqueda si searchValue no está vacío
    if (searchValue.trim() !== "") {
      fetchTableData();
    } else {
      // Si está vacío, limpiamos los datos y no hacemos búsqueda
      setTableData([]);
      setIsLoading(false);
      setError(null);
    }
  }, [searchValue]);

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
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : tableData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                No se encontraron resultados
              </TableCell>
            </TableRow>
          ) : (
            tableData.map((row: any) => (
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
