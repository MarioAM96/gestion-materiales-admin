import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Skeleton } from "@heroui/react";
import { fetchData } from "@/services/apiService";
import { LuFileText } from "react-icons/lu";
import { usePusher } from "@/services/usePusher";
import { motion } from "framer-motion";

type DataType = {
  status: string;
  message: string;
  count: number;
  type?: string;
};

export default function NumeroRegistrados() {
  const [data, setData] = useState<DataType | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Función para cargar los datos
  const cargarData = async () => {
    // Si es la carga inicial, no cambiamos el estado de initialLoading aún
    if (!initialLoading) {
      setUpdating(true); // Indicamos que estamos actualizando (para eventos de Pusher)
    }
    try {
      const result = await fetchData("resumen-fp/registrados");
      setData(result);
    } catch (error) {
      setData({
        status: "error",
        message: "No se pudieron cargar los datos",
        count: 0,
      });
    } finally {
      if (initialLoading) {
        setInitialLoading(false); // Finalizamos la carga inicial
      } else {
        setUpdating(false); // Finalizamos la actualización
      }
    }
  };

  // useEffect para cargar datos iniciales
  useEffect(() => {
    cargarData();
  }, []);

  // Usar el hook de Pusher para escuchar eventos
  usePusher("canal-registros", "evento-registros", cargarData);

  return (
    <Card className="py-4">
      {initialLoading ? (
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          {/* Skeletons solo durante la carga inicial */}
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-20 h-3 mb-2" />
          <Skeleton className="w-36 h-6 mb-2" />
        </CardHeader>
      ) : (
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold text-primary">
            {data?.type ?? "Tipo Desconocido"}
          </p>
          <small className="text-default-500">
            {data?.message ?? "Información no disponible"}
          </small>
        </CardHeader>
      )}

      <CardBody className="overflow-visible py-2 flex items-center justify-between px-4">
        {initialLoading ? (
          <div className="flex items-center gap-2">
            <Skeleton className="w-16 h-8" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full justify-between">
            {/* Número prominente con animación */}
            <motion.h4
              key={data?.count} // Forzamos la animación en cada cambio
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-bold text-2xl text-foreground"
            >
              {data?.count ?? 0}
            </motion.h4>
            {/* Ícono representativo */}
            <LuFileText size={35} />
          </div>
        )}
      </CardBody>
    </Card>
  );
}