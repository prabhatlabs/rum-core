"use client";

import AddEditProject from "./AddEditProject";
import ConnectProject from "./ConnectProject";
import DeleteProject from "./DeleteProject";
import ShowProjectKey from "./ShowProjectKey";
import UpgradeDialog from "./UpgradeDialog";

export function DashboardDialogs() {
    return (
        <>
            <AddEditProject />
            <ShowProjectKey />
            <DeleteProject />
            <ConnectProject />
            <UpgradeDialog />
        </>
    );
}
