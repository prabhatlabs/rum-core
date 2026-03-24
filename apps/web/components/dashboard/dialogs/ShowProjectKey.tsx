import ProjectKey from "@/components/ProjectKey";
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
import { Code } from "lucide-react";
import Image from "next/image";

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
            <DialogContent className="overflow-hidden block! p-0">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 lg:shrink-0 overflow-hidden">
                        <Image
                            src="/dialog-project-key.webp"
                            alt="Project Key"
                            width={300}
                            height={600}
                            className="w-full h-48 lg:h-full object-cover"
                        />
                    </div>
                    <div className="w-full lg:w-2/3 min-w-0 p-6 flex flex-col">
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
                        <DialogFooter className="mt-auto pt-4">
                            <Button variant="outline" className="w-full" onClick={handleConnect}>
                                <Code className="size-4" />
                                Connect to your site
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
