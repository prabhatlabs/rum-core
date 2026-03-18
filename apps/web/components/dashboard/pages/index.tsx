import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
    FaChartBar,
    FaChartLine,
    FaCreditCard,
    FaFolder,
    FaGlobe,
    FaServer,
    FaTable,
} from "react-icons/fa";
import { FaShieldHalved } from "react-icons/fa6";
import { BillingPage } from "./BillingPage";
import { EndpointsPage } from "./EndpointsPage";
import { EnvironmentPage } from "./EnvironmentPage";
import { GeographyPage } from "./GeographyPage";
import { OverviewPage } from "./OverviewPage";
import { PagesPage } from "./PagesPage";
import { ProjectsPage } from "./ProjectsPage";
import { UsagePage } from "./UsagePage";

export type TabType =
    | "overview"
    | "pages"
    | "endpoints"
    | "geography"
    | "environment"
    | "usage"
    | "billing"
    | "projects";

export type DashboardPage = {
    component: ReactNode;
    tab: TabType;
    title: string;
    icon: IconType;
    grp: "user" | "projects";
};

export const dashboardPagesObj: Record<TabType, DashboardPage> = {
    overview: {
        component: <OverviewPage />,
        tab: "overview",
        title: "Overview",
        icon: FaChartLine,
        grp: "projects",
    },
    pages: {
        component: <PagesPage />,
        tab: "pages",
        title: "Pages",
        icon: FaServer,
        grp: "projects",
    },
    endpoints: {
        component: <EndpointsPage />,
        tab: "endpoints",
        title: "Endpoints",
        icon: FaShieldHalved,
        grp: "projects",
    },
    geography: {
        component: <GeographyPage />,
        tab: "geography",
        title: "Geography",
        icon: FaGlobe,
        grp: "projects",
    },
    environment: {
        component: <EnvironmentPage />,
        tab: "environment",
        title: "Environment",
        icon: FaTable,
        grp: "projects",
    },
    projects: {
        component: <ProjectsPage />,
        tab: "projects",
        title: "Projects",
        icon: FaFolder,
        grp: "user",
    },
    usage: {
        component: <UsagePage />,
        tab: "usage",
        title: "Usage",
        icon: FaChartBar,
        grp: "user",
    },
    billing: {
        component: <BillingPage />,
        tab: "billing",
        title: "Billing",
        icon: FaCreditCard,
        grp: "user",
    },
};

export const dashboardPagesArray = Object.values(dashboardPagesObj);

export const tabTables: Record<
    Exclude<TabType, "projects" | "billing" | "usage">,
    string[]
> = {
    overview: [
        "re_hourly_summary",
        "re_daily_summary",
        "pv_hourly_summary",
        "pv_daily_summary",
    ],
    pages: [
        "pv_hourly_pages",
        "pv_daily_pages",
        "pv_hourly_page_geo",
        "pv_daily_page_geo",
        "pv_hourly_page_env",
        "pv_daily_page_env",
    ],
    endpoints: [
        "re_hourly_endpoints",
        "re_daily_endpoints",
        "re_hourly_endpoint_geo",
        "re_daily_endpoint_geo",
        "re_hourly_endpoint_env",
        "re_daily_endpoint_env",
    ],
    geography: [
        "re_hourly_geo",
        "re_daily_geo",
        "re_hourly_geo_detail",
        "re_daily_geo_detail",
        "pv_hourly_geo",
        "pv_daily_geo",
        "pv_hourly_geo_detail",
        "pv_daily_geo_detail",
        "re_hourly_endpoint_geo",
        "re_daily_endpoint_geo",
        "pv_hourly_page_geo",
        "pv_daily_page_geo",
    ],
    environment: [
        "re_hourly_env",
        "re_daily_env",
        "re_hourly_env_geo",
        "re_daily_env_geo",
        "pv_hourly_env",
        "pv_daily_env",
        "pv_hourly_env_geo",
        "pv_daily_env_geo",
        "re_hourly_endpoint_env",
        "re_daily_endpoint_env",
        "pv_hourly_page_env",
        "pv_daily_page_env",
    ],
};

export const tableNames: Record<string, string> = {
    "re_hourly_summary": "Requests Overview",
    "re_daily_summary": "Requests Overview",
    "pv_hourly_summary": "Page Performance Overview",
    "pv_daily_summary": "Page Performance Overview",
    "pv_hourly_pages": "Top Pages",
    "pv_daily_pages": "Top Pages",
    "pv_hourly_page_geo": "Top Pages by Country",
    "pv_daily_page_geo": "Top Pages by Country",
    "pv_hourly_page_env": "Top Pages by Environment",
    "pv_daily_page_env": "Top Pages by Environment",
    "re_hourly_endpoints": "Top API Endpoints",
    "re_daily_endpoints": "Top API Endpoints",
    "re_hourly_endpoint_geo": "Top Endpoints by Country",
    "re_daily_endpoint_geo": "Top Endpoints by Country",
    "re_hourly_endpoint_env": "Top Endpoints by Environment",
    "re_daily_endpoint_env": "Top Endpoints by Environment",
    "re_hourly_geo": "Requests by Country",
    "re_daily_geo": "Requests by Country",
    "re_hourly_geo_detail": "Requests by City",
    "re_daily_geo_detail": "Requests by City",
    "pv_hourly_geo": "Page Views by Country",
    "pv_daily_geo": "Page Views by Country",
    "pv_hourly_geo_detail": "Page Views by City",
    "pv_daily_geo_detail": "Page Views by City",
    "re_hourly_env": "Requests by Device/Browser",
    "re_daily_env": "Requests by Device/Browser",
    "re_hourly_env_geo": "Requests by Device/Browser & Country",
    "re_daily_env_geo": "Requests by Device/Browser & Country",
    "pv_hourly_env": "Page Performance by Device/Browser",
    "pv_daily_env": "Page Performance by Device/Browser",
    "pv_hourly_env_geo": "Page Perf. by Device/Browser & Country",
    "pv_daily_env_geo": "Page Perf. by Device/Browser & Country",
};
