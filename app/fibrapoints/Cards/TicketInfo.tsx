import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { Calendar, User, AlertTriangle, CheckCircle, MapPin, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { fetchData } from "@/services/apiService";

interface TicketData {
  id_ticket: number;
  zona: string;
  idContrato: string;
  fecha_insidencia: string;
  usuario: string;
  tecnico: string;
  prioridad: string;
  insidencia: string;
  observaciones: string;
  solucion: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  fecha_informe: string;
  fecha_asignacion: string;
  estado_visita: string;
  observaciones_cierre: string;
  tipo_servicio: string;
  olt: string;
  login_ftth: string;
  clave_ftth: string;
  pago_tecnico: string;
}

export default function TicketCard({ idTicket }: { idTicket: number }) {
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    details: true,
    observations: false,
    solution: false,
    technical: false,
  });

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const result = await fetchData(`inforegistronegativo/${idTicket}`);
        if (result.status === "success" && result.data.length > 0) {
          setTicketData(result.data[0]);
        } else {
          setError("No se encontraron datos para este ticket");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [idTicket]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copiado: ${text}`);
  };

  if (loading) {
    return (
      <Card className="shadow-sm rounded-lg border border-gray-100 dark:border-gray-800 max-w-4xl mx-auto">
        <CardBody className="py-6 px-6">
          <span className="text-base text-gray-600 dark:text-gray-300 animate-pulse">Cargando datos del ticket...</span>
        </CardBody>
      </Card>
    );
  }

  if (error || !ticketData) {
    return (
      <Card className="shadow-sm rounded-lg border border-gray-100 dark:border-gray-800 max-w-4xl mx-auto">
        <CardBody className="py-6 px-6">
          <span className="text-base text-red-600 dark:text-red-400">⚠ {error || "No se pudo cargar la información del ticket"}</span>
        </CardBody>
      </Card>
    );
  }

  const getPriorityTextColor = () => {
    switch (ticketData.prioridad.toLowerCase()) {
      case "alta":
        return "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded-full";
      case "media":
        return "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 px-2 py-1 rounded-full";
      default:
        return "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded-full";
    }
  };

  const getVisitStatusTextColor = () => {
    return ticketData.estado_visita === "Exitoso"
      ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded-full"
      : "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10 px-2 py-1 rounded-full";
  };

  // Componente reutilizable para los encabezados de las secciones colapsables
  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      className="flex justify-between items-center w-full text-left focus:outline-none focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
      onClick={() => toggleSection(section)}
      aria-expanded={expandedSections[section]}
      aria-controls={`${section}-section`}
    >
      <span className="text-base font-medium text-gray-900 dark:text-gray-100">{title}</span>
      {expandedSections[section] ? (
        <ChevronUp size={20} className="text-gray-600 dark:text-gray-300 transition-transform duration-200" />
      ) : (
        <ChevronDown size={20} className="text-gray-600 dark:text-gray-300 transition-transform duration-200" />
      )}
    </button>
  );

  return (
    <Card className="shadow-sm rounded-xl border border-gray-100 dark:border-gray-800 max-w-4xl mx-auto">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-black-800 dark:text-blue-300 tracking-tight">
            Ticket ID: {ticketData.id_ticket}
          </span>
          <span className={`text-sm font-medium border-none ${getPriorityTextColor()}`}>
            {ticketData.prioridad}
          </span>
        </div>
      </CardHeader>

      <CardBody className="p-6 space-y-4">
        {/* Detalles Principales */}
        <div className="transition-all duration-300 ease-in-out">
          <SectionHeader title="Detalles Principales" section="details" />
          {expandedSections.details && (
            <div
              id="details-section"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 px-2 animate-fade-in"
              style={{ animation: "fadeIn 0.3s ease-in forwards" }}
            >
              <div className="flex items-center gap-2.5 min-h-[24px]">
                <Calendar size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-800 dark:text-gray-200 overflow-visible">
                  <strong className="text-gray-900 dark:text-gray-100">Fecha:</strong>{" "}
                  <span className="text-indigo-700 dark:text-indigo-400">{ticketData.fecha_insidencia}</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5 min-h-[24px]">
                <User size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-800 dark:text-gray-200 overflow-visible">
                  <strong className="text-gray-900 dark:text-gray-100">Contrato:</strong> {ticketData.idContrato}
                </span>
              </div>
              <div className="flex items-center gap-2.5 min-h-[24px]">
                <AlertTriangle size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-800 dark:text-gray-200 overflow-visible">
                  <strong className="text-gray-900 dark:text-gray-100">Prioridad:</strong>{" "}
                  <span className={getPriorityTextColor().split(" ")[0]}>{ticketData.prioridad}</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5 min-h-[24px]">
                <MapPin size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-800 dark:text-gray-200 overflow-visible">
                  <strong className="text-gray-900 dark:text-gray-100">Zona:</strong> {ticketData.zona}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Observaciones */}
        <div className="transition-all duration-300 ease-in-out">
          <SectionHeader title="Observaciones" section="observations" />
          {expandedSections.observations && (
            <div
              id="observations-section"
              className="text-sm text-gray-800 dark:text-gray-200 mt-3 px-2 leading-relaxed min-h-[50px] overflow-y-auto animate-fade-in"
              style={{ animation: "fadeIn 0.3s ease-in forwards" }}
            >
              {ticketData.observaciones || <span className="text-gray-500 dark:text-gray-400 italic">Sin observaciones</span>}
            </div>
          )}
        </div>

        {/* Solución */}
        <div className="transition-all duration-300 ease-in-out">
          <SectionHeader title="Solución" section="solution" />
          {expandedSections.solution && (
            <div
              id="solution-section"
              className="text-sm text-gray-800 dark:text-gray-200 mt-3 px-2 leading-relaxed min-h-[50px] overflow-y-auto animate-fade-in"
              style={{ animation: "fadeIn 0.3s ease-in forwards" }}
            >
              {ticketData.solucion || <span className="text-gray-500 dark:text-gray-400 italic">Sin solución registrada</span>}
            </div>
          )}
        </div>

        {/* Observaciones de Cierre */}
        {ticketData.observaciones_cierre && (
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-base font-medium text-gray-900 dark:text-gray-100 block mb-2">Observaciones de Cierre</span>
            <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed min-h-[50px] overflow-y-auto px-2">
              {ticketData.observaciones_cierre}
            </div>
          </div>
        )}

        {/* Pago al Técnico */}
        <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-700 min-h-[24px]">
          <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
          <span className="text-sm text-gray-800 dark:text-gray-200 overflow-visible">
            <strong className="text-gray-900 dark:text-gray-100">Pago Técnico:</strong>{" "}
            <span className="text-green-700 dark:text-green-400 font-medium">${ticketData.pago_tecnico}</span>
          </span>
        </div>
      </CardBody>
    </Card>
  );
}

const styles = `
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
`;