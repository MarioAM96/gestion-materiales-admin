import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { Calendar, User, AlertTriangle, CheckCircle, MapPin, ChevronDown, ChevronUp, Copy } from "lucide-react";

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
        const response = await fetch(`http://127.0.0.1:8000/api/inforegistronegativo/${idTicket}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del ticket");
        }
        const result = await response.json();
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
      <Card className="shadow-md">
        <CardBody className="py-4">
          <span className="text-base text-gray-600 dark:text-gray-300 animate-pulse">Cargando datos del ticket...</span>
        </CardBody>
      </Card>
    );
  }

  if (error || !ticketData) {
    return (
      <Card className="shadow-md">
        <CardBody className="py-4">
          <span className="text-base text-red-600 dark:text-red-400">⚠ {error || "No se pudo cargar la información del ticket"}</span>
        </CardBody>
      </Card>
    );
  }

  const getPriorityTextColor = () => {
    switch (ticketData.prioridad.toLowerCase()) {
      case "alta":
        return "text-red-700 dark:text-red-400 font-semibold";
      case "media":
        return "text-yellow-700 dark:text-yellow-300 font-semibold";
      default:
        return "text-green-700 dark:text-green-400 font-semibold";
    }
  };

  const getVisitStatusTextColor = () => {
    return ticketData.estado_visita === "Exitoso"
      ? "text-green-700 dark:text-green-400 font-semibold"
      : "text-orange-700 dark:text-orange-400 font-semibold";
  };

  return (
    <Card className="shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700 px-6 py-3">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-800 dark:text-blue-400">Ticket ID:   {ticketData.id_ticket}</span>
          <span className={`text-sm font-medium px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 ${getPriorityTextColor()}`}>
            Prioridad: {ticketData.prioridad}
          </span>
        </div>
      </CardHeader>
      <CardBody className="p-6 space-y-5">
        {/* Información Principal */}
        <div className="transition-all duration-300">
          <button
            className="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => toggleSection("details")}
            aria-expanded={expandedSections.details}
            aria-controls="details-section"
          >
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Detalles Principales</span>
            {expandedSections.details ? <ChevronUp size={22} className="text-gray-600 dark:text-gray-400" /> : <ChevronDown size={22} className="text-gray-600 dark:text-gray-400" />}
          </button>
          {expandedSections.details && (
            <div id="details-section" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Fecha Incidencia:</strong> <span className="text-indigo-700 dark:text-indigo-400">{ticketData.fecha_insidencia}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Contrato:</strong> {ticketData.idContrato}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Prioridad:</strong> <span className={getPriorityTextColor()}>{ticketData.prioridad}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Zona:</strong> {ticketData.zona}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Observaciones */}
        <div className="transition-all duration-300">
          <button
            className="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => toggleSection("observations")}
            aria-expanded={expandedSections.observations}
            aria-controls="observations-section"
          >
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Observaciones</span>
            {expandedSections.observations ? <ChevronUp size={22} className="text-gray-600 dark:text-gray-400" /> : <ChevronDown size={22} className="text-gray-600 dark:text-gray-400" />}
          </button>
          {expandedSections.observations && (
            <p id="observations-section" className="text-sm text-gray-700 dark:text-gray-300 mt-3 leading-relaxed max-h-40 overflow-y-auto animate-fade-in">
              {ticketData.observaciones}
            </p>
          )}
        </div>

        {/* Solución */}
        <div className="transition-all duration-300">
          <button
            className="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => toggleSection("solution")}
            aria-expanded={expandedSections.solution}
            aria-controls="solution-section"
          >
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Solución</span>
            {expandedSections.solution ? <ChevronUp size={22} className="text-gray-600 dark:text-gray-400" /> : <ChevronDown size={22} className="text-gray-600 dark:text-gray-400" />}
          </button>
          {expandedSections.solution && (
            <p id="solution-section" className="text-sm text-gray-700 dark:text-gray-300 mt-3 leading-relaxed max-h-40 overflow-y-auto animate-fade-in">
              {ticketData.solucion}
            </p>
          )}
        </div>

        {/* Información Técnica */}
        {/* <div className="transition-all duration-300">
          <button
            className="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => toggleSection("technical")}
            aria-expanded={expandedSections.technical}
            aria-controls="technical-section"
          >
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Información Técnica</span>
            {expandedSections.technical ? <ChevronUp size={22} className="text-gray-600 dark:text-gray-400" /> : <ChevronDown size={22} className="text-gray-600 dark:text-gray-400" />}
          </button>
          {expandedSections.technical && (
            <div id="technical-section" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>OLT:</strong> {ticketData.olt}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Estado Visita:</strong>{" "}
                  <span className={getVisitStatusTextColor()}>{ticketData.estado_visita}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Login FTTH:</strong> {ticketData.login_ftth}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(ticketData.login_ftth)}
                  title="Copiar al portapapeles"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Copy size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Clave FTTH:</strong> {ticketData.clave_ftth}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(ticketData.clave_ftth)}
                  title="Copiar al portapapeles"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Copy size={16} />
                </Button>
              </div>
            </div>
          )}
        </div> */}

        {/* Observaciones de Cierre */}
        {ticketData.observaciones_cierre && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 block mb-2">Observaciones de Cierre</span>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-h-32 overflow-y-auto">
              {ticketData.observaciones_cierre}
            </p>
          </div>
        )}

        {/* Pago al Técnico */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <CheckCircle size={18} className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Pago Técnico:</strong> <span className="text-green-700 dark:text-green-400 font-medium">${ticketData.pago_tecnico}</span>
          </span>
        </div>
      </CardBody>
    </Card>
  );
}