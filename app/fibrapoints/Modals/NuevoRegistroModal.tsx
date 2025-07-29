import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { Form, Input, Select, SelectItem } from "@heroui/react";
import { fetchData, postData } from "@/services/apiService";

// Define a type for the product data to ensure type safety
type Product = {
  idcausal_subcategoria: number;
  nombre_causal: string;
};

type NuevoRegistroModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data?: { idCausal: number } | null;
};

const NuevoRegistroModal: React.FC<NuevoRegistroModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [idTicket, setIdTicket] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await fetchData("get-activeproducts/33");
          setProducts(response as Product[]);
        } catch (error) {
          console.error("Error al obtener productos:", error);
          setError("No se pudieron cargar los productos. Intente nuevamente.");
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen]);

  const handleProductSelection = (value: string) => {
    setSelectedProduct(value);
    console.log("Producto seleccionado:", value);
  };

  const handleIdTicketChange = (value: string) => {
    setIdTicket(value);
  };

  const handleSubmit = async () => {
    // Validar que los campos estén completos
    if (!idTicket || !selectedProduct) {
      setError("Por favor, complete todos los campos requeridos.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await postData("insert-fibrapoints-event", {
        idcausal_subcategoria: selectedProduct,
        idTicket: parseInt(idTicket, 10),
      });

      addToast({
        title: "Éxito",
        description: response.message || "Ítem registrado correctamente",
        color: "success",
      });

      onClose();
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al procesar el registro",
        color: "danger",
      });
      setError("No se pudo insertar el registro. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-label="Nuevo Registro"
      size="lg"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Nuevo Registro</h2>
          </ModalHeader>
          <ModalBody>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <Form id="projectForm" className="w-full flex flex-col gap-6">
              <Input
                isRequired
                errorMessage="Por favor, ingresa un ID de Ticket válido"
                label="ID de Ticket"
                labelPlacement="outside"
                name="idTicket"
                placeholder="ID de Ticket"
                type="number"
                className="w-full"
                variant="bordered"
                aria-label="ID de Ticket"
                value={idTicket}
                onChange={(e) => handleIdTicketChange(e.target.value)}
              />
              <Select
                isRequired
                label="Producto Activo"
                labelPlacement="outside"
                placeholder="Selecciona un producto"
                variant="bordered"
                isLoading={loading}
                aria-label="Producto Activo"
                onChange={(e) => handleProductSelection(e.target.value)}
                selectedKeys={selectedProduct ? [selectedProduct] : []}
              >
                {products.map((product) => (
                  <SelectItem
                    key={product.idcausal_subcategoria}
                    value={product.idcausal_subcategoria.toString()}
                  >
                    {product.nombre_causal}
                  </SelectItem>
                ))}
              </Select>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={onClose}>
              Cerrar
            </Button>
            <Button
              color="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!idTicket || !selectedProduct || isSubmitting}
            >
              Insertar
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default NuevoRegistroModal;
