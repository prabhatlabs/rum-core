"use client";

import { useEffect, useState } from "react";

import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { type ProjectInput, useProjects } from "@/hooks/api/use-projects";
import { useAuth } from "@/hooks/use-auth";
import { useDialog } from "@/hooks/use-dialog";
import { Plus, Save } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const MAX_NAME_LENGTH = 100;
const MAX_ORIGIN_LENGTH = 150;
const initialState: ProjectInput = {
    name: "",
    origin: "",
};

export default function AddEditProject() {
    const {
        closeAddEditProject,
        addEditProject: { isOpen, projectId },
        openShowProjectKey,
        openUpgrade,
    } = useDialog();
    const isEdit = !!projectId;

    const { getProject, createProject, updateProject, projects } = useProjects();
    const { user } = useAuth();

    const [fields, setFields] = useState<ProjectInput>(initialState);
    const [isLoading, setIsLoading] = useState(false);

    function handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFields((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }

    useEffect(() => {
        if (!isOpen || !projectId) return;

        const project = getProject(projectId);
        if (!project) return;

        setFields({
            name: project.name,
            origin: project.origin,
        });
    }, [isOpen, projectId]);

    function validateInput() {
        const isValidName =
            fields.name.length > 0 &&
            fields.name.length <= MAX_NAME_LENGTH &&
            fields.origin.length > 0 &&
            fields.origin.length <= MAX_ORIGIN_LENGTH;
        let isValidUrl = false;
        try {
            new URL(fields.origin);
            isValidUrl = true;
        } catch (error) {}

        if (isValidName && isValidUrl) return;

        let description = "";
        if (!isValidName)
            description += "Name must be between 1 and 100 characters\n";
        if (!isValidUrl) description += "Origin must be a valid URL.";

        toast.error("Invalid input", {
            description,
        });
        throw new Error("Invalid input");
    }

    const handleSubmit = async () => {
        try {
            validateInput();

            if (!isEdit) {
                const maxProjects = user?.plan_limits.projects ?? 0;
                const currentCount = projects?.length ?? 0;
                if (currentCount >= maxProjects) {
                    openUpgrade(`You have reached the maximum of ${maxProjects} projects on your current plan.`);
                    return;
                }
            }

            setIsLoading(true);
            const isSuccess = isEdit
                ? await updateProject(projectId, fields)
                : await createProject(fields);
            if (isSuccess) {
                setFields(initialState);
                closeAddEditProject();
                if (!isEdit) openShowProjectKey(isSuccess.id);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && closeAddEditProject()}
        >
            <DialogContent className="overflow-hidden block! p-0">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 lg:shrink-0 overflow-hidden">
                        <Image
                            src="/dialog-add-edit.webp"
                            alt="Add Project"
                            width={300}
                            height={600}
                            className="w-full h-48 lg:h-full object-cover"
                        />
                    </div>
                    <div className="w-full lg:w-2/3 min-w-0 p-6 flex flex-col">
                        <DialogHeader>
                            <DialogTitle>
                                {isEdit ? "Edit Project" : "Add Project"}
                            </DialogTitle>
                            <DialogDescription>
                                {isEdit
                                    ? "Update your project details below."
                                    : "Create a new project to start tracking."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 my-4">
                            <Field
                                inputProps={{
                                    id: "name",
                                    placeholder: "My Project",
                                    value: fields.name,
                                    onChange: handleFieldChange,
                                    required: true,
                                    maxLength: MAX_NAME_LENGTH,
                                }}
                                labelProps={{
                                    children: "Name",
                                }}
                            />
                            <Field
                                inputProps={{
                                    id: "origin",
                                    placeholder: "https://example.com",
                                    value: fields.origin,
                                    onChange: handleFieldChange,
                                    required: true,
                                    maxLength: MAX_ORIGIN_LENGTH,
                                }}
                                labelProps={{
                                    children: "Origin",
                                }}
                            />
                        </div>
                        <DialogFooter className="mt-auto pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeAddEditProject}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? (
                                    <LoadingSpinner />
                                ) : isEdit ? (
                                    <Save />
                                ) : (
                                    <Plus />
                                )}
                                <span>{isEdit ? "Save Changes" : "Create"}</span>
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
