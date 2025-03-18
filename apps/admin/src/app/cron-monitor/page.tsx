"use client";

import { useState, useEffect } from "react";

interface CronLog {
  id: string;
  endpoint: string;
  created_at: string;
  success: boolean;
  duration_ms: number;
  source: string;
  error?: string;
  data_snapshot?: string;
}

interface EndpointStat {
  endpoint: string;
  count: number;
  last_execution: string;
}

interface CronStats {
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  last_24h_executions: number;
  avg_duration_ms: number;
  endpoints: EndpointStat[];
}

export default function CronMonitor() {
  const [logs, setLogs] = useState<CronLog[]>([]);
  const [stats, setStats] = useState<CronStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const endpoint = `/api/cron/logs${selectedEndpoint ? `?endpoint=${selectedEndpoint}` : ""}`;
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch logs: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        setLogs(data.logs || []);
        setStats(data.stats || null);
        setError(null);
      } catch (err) {
        console.error("Error fetching cron logs:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [selectedEndpoint]);

  const setupMonitoring = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cron/setup", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(
          `Setup failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      alert(data.message || "Setup completed successfully");

      // Refresh logs
      window.location.reload();
    } catch (err) {
      console.error("Error setting up monitoring:", err);
      setError(err instanceof Error ? err.message : String(err));
      alert(
        `Setup failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const testPing = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cron/ping?source=manual_test");

      if (!response.ok) {
        throw new Error(
          `Ping failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      alert(`Ping successful in ${data.duration}`);

      // Refresh logs after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Error pinging database:", err);
      setError(err instanceof Error ? err.message : String(err));
      alert(`Ping failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const handleEndpointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEndpoint(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cron Job Monitoring</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={setupMonitoring}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Setup Monitoring
        </button>

        <button
          onClick={testPing}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Test Database Ping
        </button>

        <select
          value={selectedEndpoint}
          onChange={handleEndpointChange}
          className="border rounded px-2 py-2"
        >
          <option value="">All Endpoints</option>
          <option value="admin/api/cron/ping">Admin Ping</option>
          <option value="store/api/cron/ping">Store Ping</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow rounded p-4">
            <h3 className="font-semibold text-lg">Total Executions</h3>
            <p className="text-2xl">{stats.total_executions || 0}</p>
            <div className="mt-2 text-sm">
              <span className="text-green-600">
                Success: {stats.successful_executions || 0}
              </span>{" "}
              /
              <span className="text-red-600">
                {" "}
                Failed: {stats.failed_executions || 0}
              </span>
            </div>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="font-semibold text-lg">Last 24 Hours</h3>
            <p className="text-2xl">{stats.last_24h_executions || 0}</p>
            <p className="text-sm mt-2">
              Average Duration: {Math.round(stats.avg_duration_ms || 0)}ms
            </p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="font-semibold text-lg">Endpoints</h3>
            <ul className="text-sm mt-2">
              {stats.endpoints &&
                stats.endpoints.map((endpoint, index) => (
                  <li key={index} className="mb-1">
                    <span className="font-medium">{endpoint.endpoint}</span>:{" "}
                    {endpoint.count} runs, last:{" "}
                    {formatDate(endpoint.last_execution)}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-100">
          Execution Logs
        </h2>

        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="p-4 text-center">
            No logs found. Set up monitoring first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.endpoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {log.success ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.duration_ms}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.error ? (
                        <span className="text-red-600">{log.error}</span>
                      ) : (
                        <span className="text-gray-500">
                          {log.data_snapshot || "-"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
