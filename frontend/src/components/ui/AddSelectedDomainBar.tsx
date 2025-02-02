import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useUser } from "../../context/UserContext";
import LoadingButton from "../forms/LoadingButton";
import Modal from '../common/Modal';
import CreateProjectModal from "../common/CreateProjectModal";

export function AddSelectedDomainBar({ selectedDomains }: { selectedDomains: Set<number> }) {

    const { user } = useUser();
    const [projects, setProjects] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string | null>(null); // Manage modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!user?.email) return; // Prevents unnecessary fetch calls

        fetch(`/api/get-projects?email=${user?.email}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    setProjects(data.map((project: { projectName: string }) => project.projectName) || []);
                    setSelectedProject(data[0].projectName); // Automatically select first project
                }
            })
            .catch(error => console.error("Error fetching projects:", error));
    }, [user?.email]);

    const handleSave = async () => {

        setIsSaving(true);

        if (!selectedProject || selectedDomains.size === 0) {
            setModalMessage("Please select a project and domains to add.");
            setIsSaving(false);
            return;
        }

        const domains = Array.from(selectedDomains);

        try {
            const response = await fetch("/api/put-project", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user?.email,
                    projectName: selectedProject,
                    favourites: domains,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setIsSaving(false);
                setModalMessage(data.message);
            } else {
                setModalMessage("Error: " + data.error);
            }
        } catch (error) {
            setModalMessage("An error occurred while updating the project.");
            console.error("Error updating project:", error);
        }finally {
            setIsSaving(false);
        }
    };

    const handleProjectCreated = (newProject: { name: string }) => {
        setProjects(prev => [...prev, newProject.name]); // Add project to dropdown
        setSelectedProject(newProject.name); // Auto-select new project
        setIsCreateModalOpen(false);
    };

    if (selectedDomains.size === 0) return null;

    return (
        <div className="flex items-center justify-between w-fit mx-auto my-10 px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-t-3xl bg-white dark:bg-slate-700">
            <span className="text-gray-700 dark:text-gray-200">
                Add {selectedDomains.size} selected domain{selectedDomains.size > 1 ? "s" : ""} to
            </span>
            <div className="flex items-center space-x-4 ml-4">
                <select className="px-2 py-2 w-80 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-800 dark:text-gray-200"
                    onChange={(e) => setSelectedProject(e.target.value)}
                    value={selectedProject}
                >
                    {projects.length === 0 ? (
                        <option disabled>No projects available</option>
                    ) : (
                        projects.map((project, index) => (
                            <option key={index} value={project}>{project}</option>
                        ))
                    )}
                </select>
                {isSaving ? (
                    <LoadingButton content = "saving"/>
                ) : (
                    <button
                        className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl hover:bg-blue-600"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                )}
                <button
                    className="px-3 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl hover:bg-blue-600"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <MdAdd />
                    Create New Project
                </button>
            </div>

            {/* Modal for success/error messages */}
            <Modal
                isOpen={!!modalMessage}
                onClose={() => setModalMessage(null)}
                title="Projects with your favorite domains"
                hideOKBUtton={false}
            >
                {modalMessage}
            </Modal>

            {/* Create Project Modal */}
            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onProjectCreated={handleProjectCreated}
                userEmail={user?.email || ""}
            />
        </div>
    );
}