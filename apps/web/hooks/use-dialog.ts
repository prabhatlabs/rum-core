"use client"

import { create } from "zustand"

interface DialogData {
    isOpen: boolean
}

interface AddEditProjectData extends DialogData {
    projectId?: string
}

interface ShowProjectKeyData extends DialogData {
    projectId?: string
}

interface DeleteProjectData extends DialogData {
    projectId?: string
}

interface DialogState {
    addEditProject: AddEditProjectData
    openAddEditProject: (projectId?: string) => void
    closeAddEditProject: () => void

    showProjectKey: ShowProjectKeyData
    openShowProjectKey: (projectKey: string) => void
    closeShowProjectKey: () => void

    deleteProject: DeleteProjectData
    openDeleteProject: (projectId: string) => void
    closeDeleteProject: () => void
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
}))

