import type { DashboardPage } from "./pages";

export default function PageRenderer({ page }: { page: DashboardPage }) {
    return (
        <div className="max-w-375 w-full mx-auto">
            <h1 className="text-2xl font-bold mb-2 lg:mb-4">{page.title}</h1>
            <div>{page.component()}</div>
        </div>
    );
}
