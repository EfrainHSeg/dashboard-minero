import { useState, useEffect } from "react";
import { TrendingUp, FileUp, Download, Droplet, FlaskConical } from "lucide-react";
import CalandriasUpload from "../Calandrias/CalandriasUpload";
import ExportReport from "../Calandrias/ExportReport";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Calandrias() {
  const [data, setData] = useState<any[]>([]);

  // 🔹 Simulación de datos (como si vinieran del Excel o Supabase)
  useEffect(() => {
    const simulated = [
      { fecha: "2025-10-01", oro_teorico_oz: 100, oro_real_oz: 95, riego_pad_m3: 1200, cianuro_kg: 18, toneladas: 800 },
      { fecha: "2025-10-02", oro_teorico_oz: 110, oro_real_oz: 105, riego_pad_m3: 1180, cianuro_kg: 20, toneladas: 850 },
      { fecha: "2025-10-03", oro_teorico_oz: 108, oro_real_oz: 101, riego_pad_m3: 1220, cianuro_kg: 19, toneladas: 830 },
      { fecha: "2025-10-04", oro_teorico_oz: 115, oro_real_oz: 112, riego_pad_m3: 1210, cianuro_kg: 18, toneladas: 870 },
    ];
    setData(simulated);
  }, []);

  // Cálculos resumen
  const totalOroTeorico = data.reduce((a, b) => a + b.oro_teorico_oz, 0);
  const totalOroReal = data.reduce((a, b) => a + b.oro_real_oz, 0);
  const eficiencia = ((totalOroReal / totalOroTeorico) * 100).toFixed(1);
  const totalToneladas = data.reduce((a, b) => a + b.toneladas, 0);
  const totalAgua = data.reduce((a, b) => a + b.riego_pad_m3, 0);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Calandrias</h1>
        <div className="flex gap-3">
          <CalandriasUpload />
          <ExportReport />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Oro Teórico"
          value={`${totalOroTeorico.toFixed(0)} oz`}
          icon={<FlaskConical />}
          color="from-yellow-400 to-yellow-500"
        />
        <KpiCard
          title="Oro Real"
          value={`${totalOroReal.toFixed(0)} oz`}
          icon={<TrendingUp />}
          color="from-amber-500 to-amber-600"
        />
        <KpiCard
          title="Eficiencia"
          value={`${eficiencia}%`}
          icon={<TrendingUp />}
          color="from-green-500 to-green-600"
        />
        <KpiCard
          title="Riego Total"
          value={`${totalAgua.toLocaleString()} m³`}
          icon={<Droplet />}
          color="from-blue-500 to-blue-600"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox title="Producción de Oro (oz)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="oro_teorico_oz" fill="#facc15" name="Oro Teórico" />
              <Bar dataKey="oro_real_oz" fill="#f59e0b" name="Oro Real" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Eficiencia Diaria (%)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data.map((d) => ({
                ...d,
                eficiencia: (d.oro_real_oz / d.oro_teorico_oz) * 100,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="eficiencia" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalle Diario</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Oro Teórico</th>
                <th className="px-4 py-2">Oro Real</th>
                <th className="px-4 py-2">Eficiencia</th>
                <th className="px-4 py-2">Toneladas</th>
                <th className="px-4 py-2">Riego (m³)</th>
                <th className="px-4 py-2">Cianuro (kg)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{d.fecha}</td>
                  <td className="px-4 py-2">{d.oro_teorico_oz}</td>
                  <td className="px-4 py-2">{d.oro_real_oz}</td>
                  <td className="px-4 py-2">
                    {((d.oro_real_oz / d.oro_teorico_oz) * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-2">{d.toneladas}</td>
                  <td className="px-4 py-2">{d.riego_pad_m3}</td>
                  <td className="px-4 py-2">{d.cianuro_kg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Componentes auxiliares ---
function KpiCard({ title, value, icon, color }: any) {
  return (
    <div
      className={`bg-gradient-to-r ${color} text-white rounded-2xl p-6 shadow-md flex flex-col justify-between`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        <div className="bg-white/20 p-2 rounded-lg">{icon}</div>
      </div>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
}

function ChartBox({ title, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
