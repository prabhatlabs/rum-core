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
import { useProjects } from "@/hooks/api/use-projects";
import { useDialog } from "@/hooks/use-dialog";
import { TrashIcon } from "@phosphor-icons/react";
import Image from "next/image";
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
            <DialogContent className="overflow-hidden block! p-0">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 lg:shrink-0 overflow-hidden">
                        <Image
                            src="/dialog-delete.webp"
                            alt="Delete Project"
                            width={300}
                            height={600}
                            className="w-full h-48 lg:h-full object-cover"
                        />
                    </div>
                    <div className="w-full lg:w-2/3 min-w-0 p-6 flex flex-col">
                        <DialogHeader>
                            <DialogTitle>{"Delete Project"}</DialogTitle>
                            <DialogDescription>
                                {
                                    "Are you sure you want to delete this project? This action cannot be undone!"
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-auto pt-4">
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
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
