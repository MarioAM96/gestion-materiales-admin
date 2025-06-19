import FPSinProcesarTable from "./fpsinprocesar-table";
import FPSinRegistroTable from "./fpsinregistro-table";

export default function FibraPointsPage() {
  return (
    <div className="flex flex-col justify-between gap-6 w-full p-0">
      <div className="w-full">
        <h2 className="text-left text-lg font-semibold mb-2">Sin Procesar</h2>
        <FPSinProcesarTable />
      </div>
      <div className="w-full">
        <h2 className="text-left text-lg font-semibold mb-2">Sin registro</h2>
        <FPSinRegistroTable />
      </div>
    </div>
  );
}
