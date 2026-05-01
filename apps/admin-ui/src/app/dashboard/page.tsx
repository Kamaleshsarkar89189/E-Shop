"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import GeographicalMap from "../../shared/components/charts/geographicalMap";
import SalesChart from "../../shared/components/charts/sale-chart";
import axiosInstance from "../../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

//Fetch all orders
const fetchOrders = async () => {
  const res = await axiosInstance.get("/order/api/get-admin-orders");
  return res.data.orders;
};

// Fetch user analytics
// const fetchUserAnalytics = async () => {
//   const res = await axiosInstance.get("/analytics/api/get-user-analytics");
//   return res.data.analytics;
// };

const DUMMY_ANALYTICS = [
  {
    device: "Desktop - Windows 10 - Chrome 142.0.0.0",
  },
  {
    device: "Android Phone - Chrome",
  },
  {
    device: "iPhone - Safari",
  },
  {
    device: "iPad - Safari",
  },
  {
    device: "Desktop - macOS - Chrome",
  },
];

const fetchUserAnalytics = async () => {
  try {
    const res = await axiosInstance.get("/analytics/api/get-user-analytics"); //Api creation due

    // if API returns empty array → fallback
    if (!res.data?.analytics?.length) {
      return DUMMY_ANALYTICS;
    }

    return res.data.analytics;
  } catch (error) {
    console.warn("Using dummy analytics data");
    return DUMMY_ANALYTICS;
  }
};



const COLORS = ["#4ade80", "#facc15", "#60a5fa"];

// Orders table columns
const columns = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  }, {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }: any) => {
      const value = getValue();
      const color =
        value === "Paid"
          ? "text-green-400"
          : value === "Pending"
            ? "text-yellow-400"
            : "text-red-400";

      return <span className={`font-medium ${color}`}>{value}</span>;
    },
  },
];

const OrdersTable = () => {
  const { data: formattedOrders = [], isLoading, isError } = useQuery({
    queryKey: ["admin-orders", "latest-7"],
    queryFn: fetchOrders,
    select: (orders: any[]) =>
      orders
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 7)
        .map((order) => ({
          id: order.id,
          customer: order.user?.name ?? "N/A",
          amount: `₹${order.total}`,
          status: order.status,
        })),
  });

  const table = useReactTable({
    data: formattedOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <p className="text-white">Loading orders...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Failed to load orders</p>;
  }


  return (
    <div className="mt-6">
      <h2 className="text-white text-xl font-semibold mb-4">
        Recent Orders
        <span className="block text-sm text-slate-400 font-normal">
          A quick snapshot of your latest transactions.
        </span>
      </h2>
      <div className="!rounded shadow-xl overflow-hidden border border-slate-700">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-slate-900 text-slate-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-transparent">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-slate-600 hover:bg-slate-800 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Dashboard Layout
const DashboardPage = () => {
  const buildDeviceData = (analytics: any[]) => {
    const counts = {
      Phone: 0,
      Tablet: 0,
      Computer: 0,
    };

    analytics.forEach((item) => {
      const device = item.device?.toLowerCase() || "";

      if (device.includes("android") || device.includes("iphone") || device.includes("mobile")) {
        counts.Phone += 1;
      } else if (device.includes("tablet") || device.includes("ipad")) {
        counts.Tablet += 1;
      } else {
        counts.Computer += 1; // default → desktop/laptop
      }
    });

    return [
      { name: "Phone", value: counts.Phone },
      { name: "Tablet", value: counts.Tablet },
      { name: "Computer", value: counts.Computer },
    ];
  };

  const { data: deviceData = [] } = useQuery({
    queryKey: ["device-analytics"],
    queryFn: fetchUserAnalytics,
    select: (analytics) => buildDeviceData(analytics),
  });

  return (
    <div className="p-8">
      {/* Top Charts */}
      <div className="w-full flex gap-8">
        {/* Revenue Chart */}
        <div className="w-[65%]">
          <div className="rounded-2xl shadow-xl">
            <h2 className="text-white text-xl font-semibold">
              Revenue
              <span className="block text-sm text-slate-400 font-normal">
                Last 6 months performance
              </span>
            </h2>
            <SalesChart />
          </div>
        </div>

        {/* Device Usage */}
        <div className="w-[35%] rounded-2xl shadow-xl">
          <h2 className="text-white text-xl font-semibold mb-2">
            Device Usage
            <span className="block text-sm text-slate-400 font-normal">
              How users access your platform
            </span>
          </h2>
          <div className="mt-14">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <defs>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#000" />
                  </filter>
                </defs>

                <Pie
                  data={deviceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  stroke="#0f172a"
                  strokeWidth={2}
                  isAnimationActive
                  filter="url(#shadow)"
                >
                  {deviceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />

                {/* External Legend */}
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-white text-sm ml-1">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Geo Map + Orders */}
      <div className="w-full flex gap-8">
        {/* Map */}
        <div className="w-[60%]">
          <h2 className="text-white text-xl font-semibold mt-6">
            User & Seller Distribution
            <span className="block text-sm text-slate-400 font-normal">
              Visual breakdown of global user & seller activity.
            </span>
          </h2>
          <GeographicalMap />
        </div>
        {/* Orders Table */}
        <div className="w-[40%]">
          <OrdersTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;