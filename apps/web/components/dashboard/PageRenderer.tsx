import type { DashboardPage } from "./pages";

export default function PageRenderer({ page }: { page: DashboardPage }) {
    return (
        <>
            <h1 className="text-2xl font-bold mb-6">{page.title}</h1>
            <div>{page.component()}</div>
        </>
    );
}
