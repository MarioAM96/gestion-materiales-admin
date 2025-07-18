"use client";

import FPSinProcesarTable from "./Tables/fpsinprocesar-table";
import AumentoVelocidadTable from "./Tables/aumentovelocidad-table";
import NumeroProcesados from "./Cards/NumeroProcesados";
import NumeroPendientes from "./Cards/NumeroPendientes";
import NumeroRechazados from "./Cards/NumeroRechazados";
import NumeroRegistrados from "./Cards/NumeroRegistrados";
import FibraPointstable from "./Tables/fibrapointstable";
import FPSinRegistroTable from "./Tables/fpsinregistro-table";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

export default function FibraPointsPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NumeroRegistrados />
        <NumeroProcesados />
        <NumeroPendientes />
        <NumeroRechazados />
      </div>

      {/* Sección de Tabs */}
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options">
          <Tab key="SinProcesar" title="Sin Procesar">
            <Card>
              <CardBody>
                <FPSinProcesarTable />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="SinRegistro" title="Sin Registro">
            <Card>
              <CardBody>
                <FPSinRegistroTable />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="Registros" title="Registros">
            <Card>
              <CardBody>
                <FibraPointstable />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="RegistrosAumentoVelocidad"
            title="Registros Aumento Velocidad"
          >
            <Card>
              <CardBody>
                <AumentoVelocidadTable />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
