import { fetcher } from '@/lib/fetcher'
import type { Project } from '@/types/api'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import useSWR from 'swr'

export type ProjectInput = {
    origin: string
    name: string
}

export function useProjects() {
    const { data, isLoading, error, mutate } = useSWR<Project[] | null>('/projects')
    const { projectId, setProjectId } = useCurrentProject();

    async function createProject(body: ProjectInput) {
        let created: Project | null = null;
        try {
            created = await fetcher<Project>('/projects', { method: 'POST', body: body })
            mutate([...(data ?? []), created], { revalidate: false })
        } catch (e) {
            console.error(e);
        }
        return created;
    }

    async function updateProject(id: string, body: ProjectInput) {
        let updated: Project | null = null;
        try {
            updated = await fetcher<Project>(`/projects/${id}`, {
                method: 'PATCH', body: body
            })
            if (updated) mutate(data?.map(p => updated && p.id === updated.id ? updated : p), { revalidate: false })
        } catch (e) {
            console.error(e);
        }
        return updated;
    }

    async function deleteProject(id: string) {
        let isDeleted = false;
        try {
            await fetcher(`/projects/${id}`, { method: 'DELETE' })
            mutate(data?.filter(p => p.id !== id), { revalidate: false })
            isDeleted = true
        } catch (e) {
            console.error(e);
        }
        return isDeleted
    }

    function getProject(id: string) {
        return data?.find(p => p.id === id) || null;
    }

    useEffect(() => {
        if (projectId) return;
        if (data && data.length > 0) {
            setProjectId(data[0].id);
        }
    }, [data, projectId]);

    return {
        projects: data,
        isLoading,
        error,
        currentProject: getProject(projectId ?? ""),
        setCurrentProject: setProjectId,
        mutate,
        getProject,
        createProject,
        updateProject,
        deleteProject
    }
}

export function useCurrentProject() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const projectId = searchParams.get('project_id')

    const setProjectId = (id: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (id) {
            params.set('project_id', id)
        } else {
            params.delete('project_id')
        }
        router.replace(`${pathname}?${params.toString()}`)
    }

    return { projectId, setProjectId }
}

export function useKeepCurrentProjectInSync() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const { getProject, currentProject, setCurrentProject, projects } = useProjects()

    // URL -> state
    useEffect(() => {
        if (!projects) return;
        
        const projectId = searchParams.get('project_id')
        if (!projectId || projectId === currentProject?.id) return

        if (getProject(projectId)) setCurrentProject(projectId)
    }, [searchParams]);

    // state -> URL
    useEffect(() => {
        if (!projects) return;

        const project_id = searchParams.get('project_id')
        if (currentProject?.id === project_id) return;

        const params = new URLSearchParams(searchParams.toString())
        if (currentProject) {
            params.set('project_id', currentProject.id)
        } else {
            params.delete('project_id')
        }
        router.replace(`${pathname}?${params.toString()}`)
    }, [currentProject]);
}