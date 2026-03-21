"use client"

import AddEditProject from "./AddEditProject"
import DeleteProject from "./DeleteProject"
import ConnectProject from "./ConnectProject"
import ShowProjectKey from "./ShowProjectKey"

export function DashboardDialogs() {
    return (
        <>
            <AddEditProject />
            <ShowProjectKey />
            <DeleteProject />
            <ConnectProject />
        </>
    )
}
