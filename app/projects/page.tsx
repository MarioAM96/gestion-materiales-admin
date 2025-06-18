import ProjectsTable from "./projects-table";
import ModalForm from "./modal";
import SnippetAccount from "./snippet";
import MonitorMobileIcon from "./accordion"; // Adjust the path as needed

export default function ProjectsPage() {
  return (
    <div className="w-full px-4 py-6">
      {/* Header actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex justify-center sm:justify-start">
          <MonitorMobileIcon />
        </div>
        <div className="flex justify-end sm:justify-end">
          <ModalForm />
        </div>
      </div>

      <br></br>

      {/* Table */}
      <div className="overflow-x-auto">
        <ProjectsTable />
      </div>
    </div>
  );
}
