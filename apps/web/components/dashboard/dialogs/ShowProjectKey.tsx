import ProjectKey from "@/components/ProjectKey";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useProjects } from "@/hooks/api/use-projects";
import { useDialog } from "@/hooks/use-dialog";

export default function ShowProjectKey() {
    const {
        closeShowProjectKey,
        showProjectKey: { isOpen, projectId },
    } = useDialog();
    const { getProject } = useProjects();
    const project = projectId ? getProject(projectId) : null;

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && closeShowProjectKey()}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{"Project Key"}</DialogTitle>
                    <DialogDescription>
                        {"Copy the project key and save it somewhere safe."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center">
                    {!project ? (
                        "Project not found!"
                    ) : (
                        <ProjectKey projectKey={project?.project_key} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
