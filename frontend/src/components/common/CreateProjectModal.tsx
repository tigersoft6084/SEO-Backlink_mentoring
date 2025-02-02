import { useState } from "react";
import Modal from "./Modal";

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectCreated: (projectName: string) => void;
    userEmail: string;
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated, userEmail }: CreateProjectModalProps) {
    const [newProjectName, setNewProjectName] = useState<string>("");
    const [newDomainName, setNewDomainName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!newProjectName.trim() || !newDomainName.trim()) {
            setErrorMessage("Please enter a project name and a domain name.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/post-project", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    projectName: newProjectName,
                    domainName: newDomainName,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onProjectCreated(newProjectName);
                setNewProjectName("");
                setNewDomainName("");
                onClose(); // Close modal after successful creation
            } else {
                setErrorMessage(data.message || "Error creating project.");
            }
        } catch (error) {
            console.error("Error creating project:", error);
            setErrorMessage("An error occurred while creating the project.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Enter Project Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Domain Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
                    value={newDomainName}
                    onChange={(e) => setNewDomainName(e.target.value)}
                />

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <button
                    className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600"
                    onClick={handleCreate}
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : "Create Project"}
                </button>
            </div>
        </Modal>
    );
}
