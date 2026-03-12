import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useProjects } from "@/hooks/api/use-projects";
import { useDialog } from "@/hooks/use-dialog";
import { TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";

export default function DeleteProject() {
    const {
        closeDeleteProject,
        deleteProject: { isOpen, projectId },
    } = useDialog();
    const { deleteProject } = useProjects();
    const [isLoading, setLoading] = useState<boolean>(false);

    async function handleDelete() {
        if (!projectId) return;
        setLoading(true);
        const isDeleted = await deleteProject(projectId);
        if (isDeleted) closeDeleteProject();
        setLoading(false);
    }
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && closeDeleteProject()}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{"Delete Project"}</DialogTitle>
                    <DialogDescription>
                        {
                            "Are you sure you want to delete this project? This action cannot be undone!"
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={closeDeleteProject}
                        disabled={isLoading}
                        variant={"ghost"}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={isLoading}
                        variant={"destructive"}
                    >
                        {isLoading ? <LoadingSpinner /> : <TrashIcon />}
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
