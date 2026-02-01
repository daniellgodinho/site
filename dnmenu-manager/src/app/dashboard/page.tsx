"use client"

export const dynamic = 'force-dynamic'

import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const chartData = [
    { date: "Jun 23", mobile: 186, desktop: 80 },
    { date: "Jun 24", mobile: 305, desktop: 200 },
    { date: "Jun 25", mobile: 237, desktop: 120 },
    { date: "Jun 26", mobile: 273, desktop: 190 },
    { date: "Jun 27", mobile: 209, desktop: 130 },
    { date: "Jun 28", mobile: 314, desktop: 140 },
    { date: "Jun 29", mobile: 493, desktop: 443 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} as ChartConfig

export default function PaginaDashboard() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="min-h-screen bg-background text-foreground">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 bg-card/0">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Documents</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="ml-auto flex items-center gap-2">
                            <Button size="sm" className="h-8">
                                <ArrowUpRight className="mr-2 h-4 w-4" />
                                Quick Create
                            </Button>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        {/* Stats Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$1,250.00</div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <span className="text-green-600 flex items-center">
                                            <ArrowUpRight className="h-3 w-3" />
                                            +12.5%
                                        </span>
                                        <span>Trending up this month</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Visitors for the last 6 months
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1,234</div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <span className="text-red-600 flex items-center">
                                            <ArrowDownRight className="h-3 w-3" />
                                            -2.5%
                                        </span>
                                        <span>Down 2.5% this period</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Acquisition needs attention
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">45,678</div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <span className="text-green-600 flex items-center">
                                            <ArrowUpRight className="h-3 w-3" />
                                            +12.5%
                                        </span>
                                        <span>Strong user retention</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Engagement across targets
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">4.5%</div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <span className="text-green-600 flex items-center">
                                            <ArrowUpRight className="h-3 w-3" />
                                            +4.2%
                                        </span>
                                        <span>Steady performance increase</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Meets growth projections
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Chart Section */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Total Visitors</CardTitle>
                                    <CardDescription>Total for the last 3 months</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline">Last 3 months</Badge>
                                    <Badge variant="outline">Last 30 days</Badge>
                                    <Badge variant="outline">Last 7 days</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => String(v).slice(0, 6)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                        <Area dataKey="mobile" type="natural" fill="var(--color-mobile)" fillOpacity={0.4} stroke="var(--color-mobile)" stackId="a" />
                                        <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a" />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 font-medium leading-none">Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /></div>
                                        <div className="flex items-center gap-2 leading-none text-muted-foreground">June 23 - June 29, 2024</div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>

                        {/* Tabs Section */}
                        <div className="flex gap-2 border-b">
                            <Button variant="ghost" className="border-b-2 border-primary rounded-none">Outline</Button>
                            <Button variant="ghost" className="rounded-none">Past Performance <Badge variant="secondary" className="ml-2">3</Badge></Button>
                            <Button variant="ghost" className="rounded-none">Key Personnel <Badge variant="secondary" className="ml-2">6</Badge></Button>
                            <Button variant="ghost" className="rounded-none">Focus Documents</Button>
                            <div className="ml-auto flex gap-2">
                                <Button variant="outline" size="sm">Customize Columns</Button>
                                <Button variant="outline" size="sm">+ Add Section</Button>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="bg-muted/50"><CardContent className="flex aspect-video items-center justify-center p-6"><span className="text-sm text-muted-foreground">Content Block</span></CardContent></Card>
                            <Card className="bg-muted/50"><CardContent className="flex aspect-video items-center justify-center p-6"><span className="text-sm text-muted-foreground">Content Block</span></CardContent></Card>
                            <Card className="bg-muted/50"><CardContent className="flex aspect-video items-center justify-center p-6"><span className="text-sm text-muted-foreground">Content Block</span></CardContent></Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
