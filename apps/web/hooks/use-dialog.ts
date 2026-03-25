"use client";

import { create } from "zustand";

interface DialogData {
    isOpen: boolean;
}

interface AddEditProjectData extends DialogData {
    projectId?: string;
}

interface ShowProjectKeyData extends DialogData {
    projectId?: string;
}

interface DeleteProjectData extends DialogData {
    projectId?: string;
}

interface UpgradeData extends DialogData {
    reason?: string;
}

interface DialogState {
    addEditProject: AddEditProjectData;
    openAddEditProject: (projectId?: string) => void;
    closeAddEditProject: () => void;

    showProjectKey: ShowProjectKeyData;
    openShowProjectKey: (projectKey: string) => void;
    closeShowProjectKey: () => void;

    deleteProject: DeleteProjectData;
    openDeleteProject: (projectId: string) => void;
    closeDeleteProject: () => void;

    connectProject: DialogData;
    openConnectProject: () => void;
    closeConnectProject: () => void;

    upgrade: UpgradeData;
    openUpgrade: (reason?: string) => void;
    closeUpgrade: () => void;
}

export const useDialog = create<DialogState>((set) => ({
    addEditProject: {
        isOpen: false,
    },
    openAddEditProject: (projectId) =>
        set({ addEditProject: { isOpen: true, projectId } }),
    closeAddEditProject: () =>
        set({ addEditProject: { isOpen: false, projectId: undefined } }),

    showProjectKey: {
        isOpen: false,
    },
    openShowProjectKey: (projectId) =>
        set({ showProjectKey: { isOpen: true, projectId } }),
    closeShowProjectKey: () =>
        set({ showProjectKey: { isOpen: false, projectId: undefined } }),

    deleteProject: {
        isOpen: false,
    },
    openDeleteProject: (projectId) =>
        set({ deleteProject: { isOpen: true, projectId } }),
    closeDeleteProject: () =>
        set({ deleteProject: { isOpen: false, projectId: "" } }),

    connectProject: {
        isOpen: false,
    },
    openConnectProject: () => set({ connectProject: { isOpen: true } }),
    closeConnectProject: () => set({ connectProject: { isOpen: false } }),

    upgrade: {
        isOpen: false,
    },
    openUpgrade: (reason) => set({ upgrade: { isOpen: true, reason } }),
    closeUpgrade: () => set({ upgrade: { isOpen: false, reason: undefined } }),
}));
