"use client";

import React, { useMemo } from "react";
import Chart, { Props as ApexProps } from "react-apexcharts";
import Box from "apps/admin-ui/src/shared/components/box"; 
type OrderPoint = {
    month: string;
    count: number;
};

type SalesChartProps = {
    ordersData?: OrderPoint[];
    height?: number | string;
};

const DEFAULT_DATA: OrderPoint[] = [
    { month: "Jan", count: 31 },
    { month: "Feb", count: 40 },
    { month: "Mar", count: 28 },
    { month: "Apr", count: 51 },
    { month: "May", count: 42 },
    { month: "Jun", count: 50 },
    { month: "Jul", count: 70 },
    { month: "Aug", count: 80 },
    { month: "Sep", count: 90 },
    { month: "Oct", count: 100 },
    { month: "Nov", count: 109 },
    { month: "Dec", count: 130 },
];

const SalesChart: React.FC<SalesChartProps> = ({ ordersData = DEFAULT_DATA, height = 320 }) => {
    // x-axis labels and series prepared from incoming data
    const categories = useMemo(() => ordersData.map((d) => d.month), [ordersData]);
    const series = useMemo<
        ApexProps["series"]
    >(
        () => [
            {
                name: "Sales",
                data: ordersData.map((d) => d.count),
            },
        ],
        [ordersData]
    );

    const options: ApexProps["options"] = useMemo(
        () => ({
            chart: {
                id: "sales-area",
                type: "area",
                toolbar: { show: false },
                zoom: { enabled: false },
                background: "#0f172a", // dark background
                animations: { enabled: true, easing: "easeout", speed: 400 },
            },
            stroke: {
                curve: "smooth",
                width: 3,
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    type: "vertical",
                    shadeIntensity: 1,
                    gradientToColors: ["#3b82f6"], // lighter blue at top
                    inverseColors: false,
                    opacityFrom: 0.7,
                    opacityTo: 0.05,
                    stops: [0, 90, 100],
                },
            },
            colors: ["#60a5fa"], // line color (blue)
            xaxis: {
                categories,
                labels: {
                    rotate: 0,
                    style: { fontSize: "12px", colors: "#cbd5e1" }, // light gray
                },
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: {
                labels: {
                    formatter: (val: number) => `${Math.round(val)}`,
                    style: { fontSize: "12px", colors: "#cbd5e1" },
                },
            },
            grid: {
                show: true,
                borderColor: "#1e293b",
                strokeDashArray: 4,
            },
            tooltip: {
                theme: "dark",
                x: { show: true },
                y: {
                    formatter: (val: number) => `${val} orders`,
                },
            },
            legend: { show: false },
            dataLabels: { enabled: false },
            markers: {
                size: 4,
                colors: "#60a5fa",
                strokeColors: "#0f172a",
                strokeWidth: 2,
            },
            responsive: [
                {
                    breakpoint: 640,
                    options: {
                        chart: { height: 260 },
                        xaxis: { labels: { rotate: -45 } },
                    },
                },
            ],
        }),
        [categories]
    );

    const total = ordersData.reduce((s, p) => s + p.count, 0);
    const latest = ordersData[ordersData.length - 1]?.count ?? 0;

    return (
        <Box className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-lg font-medium text-slate-900">Sales</h3>
                    <p className="text-sm text-slate-500">Monthly orders overview</p>
                </div>

                <div className="text-right">
                    <div className="text-sm text-slate-500">Total</div>
                    <div className="text-lg font-semibold text-slate-900">{total}</div>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full">
                <Chart options={options} series={series} type="area" height={height} />
            </div>

            {/* Footer / small stats */}
            <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
                <div>Last month: <span className="font-medium text-slate-900 ml-1">{latest}</span></div>
                <div className="text-xs text-slate-400">Updated just now</div>
            </div>
        </Box>
    );
};

export default SalesChart;
