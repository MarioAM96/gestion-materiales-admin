import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image, Skeleton } from "@heroui/react";
import { fetchData } from "@/services/apiService";
import { addToast } from "@heroui/react";

type CausalSubcategoryCardProps = {
  idCausal: number;
};

export default function CausalSubcategoryCard({
  idCausal,
}: CausalSubcategoryCardProps): JSX.Element {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true; // Bandera para verificar si el componente está montado

    const getData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchData(`causalfp/${idCausal}`);
        if (isMounted) {
          if (result.status === "success") {
            setData(result.data);
          } else {
            throw new Error(result.message || "Error al cargar los detalles");
          }
        }
      } catch (error) {
        if (isMounted) {
          addToast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Error al cargar los detalles",
            color: "danger",
          });
          console.error("Error fetching details:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (idCausal) {
      getData();
    }
    return () => {
      isMounted = false;
    };
  }, [idCausal]);
  if (isLoading) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
          <div className="flex w-full justify-between items-center">
            <Skeleton className="h-5 w-1/4 rounded-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-12 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </div>
        </CardHeader>
        <CardBody className="grid grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-3 w-1/4 rounded-md mb-1" />
              <Skeleton className="h-4 w-1/6 rounded-md" />
            </div>
            <div>
              <Skeleton className="h-3 w-1/3 rounded-md mb-1" />
              <Skeleton className="h-4 w-1/5 rounded-md" />
            </div>
            <div>
              <Skeleton className="h-3 w-1/3 rounded-md mb-1" />
              <Skeleton className="h-4 w-1/5 rounded-md" />
            </div>
            <div>
              <Skeleton className="h-3 w-1/4 rounded-md mb-1" />
              <Skeleton className="h-4 w-1/6 rounded-md" />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full shadow-lg">
        <CardBody>
          <p className="text-center text-gray-500">
            No se pudieron cargar los datos.
          </p>
        </CardBody>
      </Card>
    );
  }

  const {
    nombre_causal,
    estado_causal,
    puntos,
    idcausal_subcategoria,
    idsubcategoria_incidencia,
    fecha_registro_causal,
    image_url,
  } = data;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <div className="flex w-full justify-between items-center">
          <h4 className="font-bold text-xl">{nombre_causal}</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Estado:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold ${
                estado_causal === "1"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {estado_causal === "1" ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardBody className="grid grid-cols-2 gap-4 p-4">
        <div className="space-y-2">
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">Puntos</p>
            <p className="text-sm font-medium">{puntos}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">
              ID Causal Subcategoría
            </p>
            <p className="text-sm font-medium">{idcausal_subcategoria}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">
              ID Subcategoría Incidencia
            </p>
            <p className="text-sm font-medium">{idsubcategoria_incidencia}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">
              Fecha Registro
            </p>
            <p className="text-sm font-medium">
              {fecha_registro_causal || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          {image_url ? (
            <Image
              alt="Card background"
              className="object-cover rounded-xl max-h-48 w-full"
              src={image_url}
            />
          ) : (
            <p className="text-sm text-gray-400">Sin imagen</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
