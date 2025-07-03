
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Added useParams
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShoppingBag, MessageSquare, Users, BarChart3, PieChartIcon, LineChartIcon, Briefcase, Loader2 } from "lucide-react";
import type { Service, Testimonial, Project, ClientInquiry, ClientInquiryStatus } from "@/lib/placeholder-data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Bar, BarChart, Pie, PieChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { format, parseISO, startOfMonth, compareAsc } from 'date-fns';
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";
import { useAuth } from '@/contexts/AuthContext'; // Added useAuth
import type { Locale } from '@/lib/i18n/i18n-config'; // Added Locale

interface DashboardStats {
  totalServices: number;
  totalTestimonials: number;
  totalProjects: number;
  newInquiries: number;
  totalInquiries: number;
  serviceRequestChartData: Array<{name: string; count: number; fill: string}>;
  statusChartData: Array<{status: string; count: number; fill: string}>;
  inquiriesTimeChartData: Array<{month: string; count: number}>;
  recentInquiries: ClientInquiry[];
}

const serviceSpecificColors = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-5))",
];

const statusColors = [
  "hsl(var(--chart-1))", 
  "hsl(var(--chart-2))", 
  "hsl(var(--chart-3))", 
  "hsl(var(--chart-4))", 
];

const statusChartConfig = {
    New: { label: "New", color: statusColors[0] },
    Contacted: { label: "Contacted", color: statusColors[1] },
    Quoted: { label: "Quoted", color: statusColors[2] },
    Closed: { label: "Closed", color: statusColors[3] },
  } satisfies ChartConfig;

const inquiriesTimeChartConfig = {
    count: {
      label: "Inquiries",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;


async function getDashboardData(): Promise<DashboardStats> {
  const dbRef = ref(db);
  let servicesArray: Service[] = [];
  let testimonialsArray: Testimonial[] = [];
  let projectsArray: Project[] = [];
  let clientInquiries: ClientInquiry[] = [];

  try {
    const servicesSnapshot = await get(child(dbRef, 'services'));
    if (servicesSnapshot.exists()) {
        const servicesData = servicesSnapshot.val();
        servicesArray = Object.keys(servicesData).map(key => ({id: key, ...servicesData[key]}));
    }
  } catch (e) { console.error("Error fetching services for dashboard:", e); }

  try {
    const testimonialsSnapshot = await get(child(dbRef, 'testimonials'));
    if (testimonialsSnapshot.exists()) {
        const testimonialsData = testimonialsSnapshot.val();
        testimonialsArray = Object.keys(testimonialsData).map(key => ({id: key, ...testimonialsData[key]}));
    }
  } catch (e) { console.error("Error fetching testimonials for dashboard:", e); }
  
  try {
    const projectsSnapshot = await get(child(dbRef, 'projects'));
    if (projectsSnapshot.exists()) {
        const projectsData = projectsSnapshot.val();
        projectsArray = Object.keys(projectsData).map(key => ({id: key, ...projectsData[key]}));
    }
  } catch (e) { console.error("Error fetching projects for dashboard:", e); }

  try {
    const inquiriesSnapshot = await get(child(dbRef, 'inquiries'));
    if (inquiriesSnapshot.exists()) {
        const inquiriesData = inquiriesSnapshot.val();
        clientInquiries = Object.keys(inquiriesData).map(key => ({id:key, ...inquiriesData[key]}));
    }
  } catch (e) { console.error("Error fetching inquiries for dashboard:", e); }


  const serviceRequestCounts: { [key: string]: number } = {};
  clientInquiries.forEach(inquiry => {
    serviceRequestCounts[inquiry.serviceRequested] = (serviceRequestCounts[inquiry.serviceRequested] || 0) + 1;
  });

  const serviceRequestChartData = Object.entries(serviceRequestCounts)
    .map(([name, count], index) => ({
        name,
        count,
        fill: serviceSpecificColors[index % serviceSpecificColors.length]
    }))
    .sort((a, b) => b.count - a.count);

  const statusCounts: { [key in ClientInquiryStatus]: number } = { New: 0, Contacted: 0, Quoted: 0, Closed: 0 };
  clientInquiries.forEach(inquiry => {
    statusCounts[inquiry.status] = (statusCounts[inquiry.status] || 0) + 1;
  });
  const statusChartData = Object.entries(statusCounts).map(([name, value], index) => ({
    status: name,
    count: value,
    fill: statusColors[index % statusColors.length],
  }));

  const inquiriesByMonth: { [key: string]: { date: Date, count: number } } = {};
  clientInquiries.forEach(inquiry => {
    try {
      const inquiryDate = parseISO(inquiry.date);
      const monthKey = format(startOfMonth(inquiryDate), 'yyyy-MM-dd'); 
      if (!inquiriesByMonth[monthKey]) {
        inquiriesByMonth[monthKey] = { date: startOfMonth(inquiryDate), count: 0 };
      }
      inquiriesByMonth[monthKey].count += 1;
    } catch (e) { console.warn(`Could not parse date for inquiry: ${inquiry.id}`, e); }
  });

  const inquiriesTimeChartData = Object.values(inquiriesByMonth)
    .sort((a, b) => compareAsc(a.date, b.date)) 
    .map(item => ({
      month: format(item.date, 'MMM yyyy'),
      count: item.count,
    }));

  const recentInquiries = clientInquiries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,5);

  return {
    totalServices: servicesArray.length,
    totalTestimonials: testimonialsArray.length,
    totalProjects: projectsArray.length,
    newInquiries: clientInquiries.filter(inq => inq.status === 'New').length,
    totalInquiries: clientInquiries.length,
    serviceRequestChartData,
    statusChartData,
    inquiriesTimeChartData,
    recentInquiries
  };
}


export default function AdminDashboardPage() {
  const router = useRouter();
  const params = useParams(); // Get params
  const lang = params.lang as Locale || 'en'; // Get lang
  const { user } = useAuth(); // Get user for conditional fetching
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) { // Only fetch if user is authenticated
        setIsLoading(false); // Stop loading if no user
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error: any) {
        console.error("Failed to fetch dashboard data from Firebase:", error);
        setError(error.message || "Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    // router.refresh(); // Re-enable if data seems stale after actions
  }, [user, router]); // Depend on user to re-fetch if auth state changes

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!dashboardData) {
     return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">No dashboard data available or user not authenticated.</p>
      </div>
    );
  }

  const { 
    totalServices, totalTestimonials, totalProjects, newInquiries, totalInquiries,
    serviceRequestChartData, statusChartData, inquiriesTimeChartData, recentInquiries
  } = dashboardData;

  const stats = [
    { title: "Total Services", value: totalServices, icon: ShoppingBag, href: `/${lang}/admin/services` },
    { title: "Total Testimonials", value: totalTestimonials, icon: Users, href: `/${lang}/admin/testimonials` },
    { title: "Total Projects", value: totalProjects, icon: Briefcase, href: `/${lang}/admin/projects` },
    { title: "New Inquiries", value: newInquiries, icon: MessageSquare, href: `/${lang}/admin/inquiries?statusFilter=New` },
    { title: "Total Inquiries", value: totalInquiries, icon: MessageSquare, href: `/${lang}/admin/inquiries` },
  ];
  
  const serviceRequestChartConfig = serviceRequestChartData.reduce((acc, item) => {
    acc[item.name] = {
      label: item.name,
      color: item.fill,
    };
    return acc;
  }, {} as ChartConfig);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <Button variant="link" asChild className="px-0 text-sm text-accent hover:text-accent/80">
                <Link href={stat.href}>
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <BarChart3 className="h-6 w-6" /> Service Request Distribution
            </CardTitle>
            <CardDescription>Number of inquiries per service requested.</CardDescription>
          </CardHeader>
          <CardContent>
            {serviceRequestChartData.length > 0 ? (
              <ChartContainer config={serviceRequestChartConfig} className="min-h-[250px] w-full">
                <BarChart
                    accessibilityLayer
                    data={serviceRequestChartData}
                    layout="vertical"
                    margin={{left: 20, right: 20, top: 5, bottom: 5}}
                    isAnimationActive={true}
                    animationDuration={700}
                >
                  <CartesianGrid vertical={true} horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="count" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} strokeWidth={1} width={120} interval={0} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={{fill: 'hsl(var(--muted))'}} />
                  <Bar dataKey="count" radius={[0, 5, 5, 0]} isAnimationActive={true} barSize={25}>
                     {serviceRequestChartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                      ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-center py-4">No inquiry data to display service distribution.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <PieChartIcon className="h-6 w-6" /> Inquiry Status Overview
            </CardTitle>
            <CardDescription>Distribution of inquiries by current status.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {totalInquiries > 0 && statusChartData.some(s => s.count > 0) ? (
              <ChartContainer config={statusChartConfig} className="min-h-[250px] w-full max-w-[300px] aspect-square">
                <PieChart isAnimationActive={true} animationDuration={700}>
                  <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} cursor={{fill: 'hsl(var(--muted))'}} />
                  <Pie
                    data={statusChartData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    isAnimationActive={true}
                    labelLine={false}
                    label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5 + 15;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return percent > 0.05 ? ( 
                          <text
                            x={x}
                            y={y}
                            fill="hsl(var(--foreground))"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            className="text-xs"
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        ) : null;
                      }}
                  >
                    {statusChartData.map((entry) => (
                      <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="status" />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-center py-4">No inquiry data to display status overview.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center gap-2">
            <LineChartIcon className="h-6 w-6" /> Inquiries Over Time
          </CardTitle>
          <CardDescription>Number of inquiries received per month.</CardDescription>
        </CardHeader>
        <CardContent>
          {inquiriesTimeChartData.length > 0 ? (
            <ChartContainer config={inquiriesTimeChartConfig} className="min-h-[300px] w-full">
              <LineChart
                accessibilityLayer
                data={inquiriesTimeChartData}
                margin={{
                  left: 12,
                  right: 20, 
                  top: 5,
                  bottom: 5,
                }}
                isAnimationActive={true}
                animationDuration={700}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis allowDecimals={false} />
                <ChartTooltip cursor={{strokeDasharray: '3 3', fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent indicator="line" />} />
                <Line
                  dataKey="count"
                  type="monotone" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{
                    fill: "hsl(var(--primary))",
                    r: 4, 
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))" 
                  }}
                  activeDot={{
                    r: 6, 
                    fill: "hsl(var(--primary))",
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2,
                  }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <p className="text-muted-foreground text-center py-4">No inquiry data to display trend over time.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Recent Inquiries</CardTitle>
          <CardDescription>Top 5 most recent client inquiries.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentInquiries.length > 0 ? recentInquiries.map((inquiry) => (
            <div key={inquiry.id} className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-muted/30 -mx-6 px-6 transition-colors">
              <div>
                <p className="font-medium">{inquiry.name} <span className="text-xs text-muted-foreground">({inquiry.serviceRequested})</span></p>
                <p className="text-sm text-muted-foreground">{inquiry.email}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${lang}/admin/inquiries?id=${inquiry.id}`}>View Details</Link>
              </Button>
            </div>
          )) : (
            <p className="text-muted-foreground">No recent inquiries.</p>
          )}
           <div className="mt-6 text-center">
             <Button variant="default" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href={`/${lang}/admin/inquiries`}>View All Inquiries</Link>
             </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
