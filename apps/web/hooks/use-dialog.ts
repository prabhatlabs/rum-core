"use client"

import { create } from "zustand"

interface AddEditProjectData {
    isOpen: boolean
    projectId?: string
}

interface DialogState {
    addEditProject: AddEditProjectData
    openAddEditProject: (projectId?: string) => void
    closeAddEditProject: () => void
}

export const useDialog = create<DialogState>((set) => ({
    addEditProject: {
        isOpen: false,
    },
    openAddEditProject: (projectId) =>
        set({ addEditProject: { isOpen: true, projectId } }),
    closeAddEditProject: () =>
        set({ addEditProject: { isOpen: false, projectId: undefined } }),
}))

