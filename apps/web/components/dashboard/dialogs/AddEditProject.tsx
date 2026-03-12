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
import { ProjectInput, useProjects } from "@/hooks/api/use-projects";
import { useDialog } from "@/hooks/use-dialog";
import { Plus, Save } from "lucide-react";

export function AddEditProject() {
    const {
        closeAddEditProject,
        addEditProject: { isOpen, projectId },
    } = useDialog();
    const isEdit = !!projectId;

    const { isMutating, getProject, createProject, updateProject } =
        useProjects();

    const [fields, setFields] = useState<ProjectInput>({
        name: "",
        origin: "",
    });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            try {
                new URL(fields.origin);
            } catch (error) {
                console.error("Invalid URL");
                return;
            }
            const isSuccess = isEdit
                ? await updateProject(projectId, fields)
                : await createProject(fields);
            if (isSuccess) closeAddEditProject();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && closeAddEditProject()}
        >
            <DialogContent>
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
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4">
                        <Field
                            inputProps={{
                                id: "name",
                                placeholder: "My Project",
                                value: fields.name,
                                onChange: handleFieldChange,
                                required: true,
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
                            }}
                            labelProps={{
                                children: "Origin",
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeAddEditProject}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isMutating}>
                            {isMutating ? (
                                <LoadingSpinner />
                            ) : isEdit ? (
                                <Save />
                            ) : (
                                <Plus />
                            )}
                            <span>{isEdit ? "Save Changes" : "Create"}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
