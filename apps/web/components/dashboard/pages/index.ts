import type { ReactNode } from 'react'
import { FaChartBar, FaChartLine, FaCreditCard, FaFolder, FaGlobe, FaServer, FaTable } from 'react-icons/fa'
import { FaShieldHalved } from 'react-icons/fa6'
import { BillingPage } from './BillingPage'
import { EnvironmentPage } from './EnvironmentPage'
import { ErrorsPage } from './ErrorsPage'
import { GeographyPage } from './GeographyPage'
import { OverviewPage } from './OverviewPage'
import { PerformancePage } from './PerformancePage'
import { ProjectsPage } from './ProjectsPage'
import { UsagePage } from './UsagePage'

export type TabType = "overview" | "performance" | "errors" | "geography" | "environment" | "usage" | "billing" | "projects"

export type DashboardPage = {
    component: () => ReactNode
    tab: TabType
    title: string
    icon: any
}

export const dashboardPagesObj: Record<TabType, DashboardPage> = {
    overview: { component: OverviewPage, tab: "overview", title: "Overview", icon: FaChartLine },
    performance: { component: PerformancePage, tab: "performance", title: "Performance", icon: FaServer },
    errors: { component: ErrorsPage, tab: "errors", title: "Errors", icon: FaShieldHalved },
    geography: { component: GeographyPage, tab: "geography", title: "Geography", icon: FaGlobe },
    environment: { component: EnvironmentPage, tab: "environment", title: "Environment", icon: FaTable },
    projects: { component: ProjectsPage, tab: "projects", title: "Projects", icon: FaFolder },
    usage: { component: UsagePage, tab: "usage", title: "Usage", icon: FaChartBar },
    billing: { component: BillingPage, tab: "billing", title: "Billing", icon: FaCreditCard },
}

export const dashboardPagesArray = Object.values(dashboardPagesObj);