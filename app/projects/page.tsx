import ProjectsTable from "./projects-table";
import ModalForm from "./modal";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 w-full p-0 md:p-0">
      <div className="w-full">
        <div className="flex justify-end">
          <ModalForm />
        </div>
        <br />
        <ProjectsTable />
      </div>
    </div>
  );
}