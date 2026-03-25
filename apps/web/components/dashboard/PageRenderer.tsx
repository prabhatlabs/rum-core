import type { DashboardPage } from "./pages";

export default function PageRenderer({ page }: { page: DashboardPage }) {
    return <div className="max-w-375 w-full mx-auto">{page.component}</div>;
}
