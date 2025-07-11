"use client";

import FPSinProcesarTable from "./Tables/fpsinprocesar-table";
import AumentoVelocidadTable from "./Tables/aumentovelocidad-table";
import FibraPointstable from "./Tables/fibrapointstable";
import FPSinRegistroTable from "./Tables/fpsinregistro-table";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

export default function FibraPointsPage() {
  return (
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
        <Tab key="RegistrosAumentoVelocidad" title="Registros Aumento Velocidad">
          <Card>
            <CardBody>
              <AumentoVelocidadTable />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
