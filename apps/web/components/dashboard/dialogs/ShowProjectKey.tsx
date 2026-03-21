import ProjectKey from "@/components/ProjectKey";
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
import { Code } from "lucide-react";

export default function ShowProjectKey() {
    const {
        closeShowProjectKey,
        openConnectProject,
        showProjectKey: { isOpen, projectId },
    } = useDialog();
    const { getProject } = useProjects();
    const project = projectId ? getProject(projectId) : null;

    function handleConnect() {
        closeShowProjectKey();
        openConnectProject();
    }

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
                <Button variant="outline" className="w-full" onClick={handleConnect}>
                    <Code className="size-4" />
                    Connect to your site
                </Button>
            </DialogContent>
        </Dialog>
    );
}
