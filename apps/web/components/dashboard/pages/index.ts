import type { ReactNode } from 'react'
import { FaChartLine, FaGlobe, FaServer, FaTable } from 'react-icons/fa'
import { FaShieldHalved } from 'react-icons/fa6'
import { EnvironmentPage } from './EnvironmentPage'
import { ErrorsPage } from './ErrorsPage'
import { GeographyPage } from './GeographyPage'
import { OverviewPage } from './OverviewPage'
import { PerformancePage } from './PerformancePage'

export type TabType = "overview" | "performance" | "errors" | "geography" | "environment"

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
}

export const dashboardPagesArray = Object.values(dashboardPagesObj);