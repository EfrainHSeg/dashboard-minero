import { useState } from "react";
import * as XLSX from "xlsx";

export default function ExportReport() {
  const [loading, setLoading] = useState(false);

  async function exportar() {
    setLoading(true);
    try {
      // Datos simulados para el ejemplo
      const rows = [
        { fecha: "2025-10-01", oroTeoricoOz: 100, oroRealOz: 95, eficiencia: 95, toneladas: 800 },
        { fecha: "2025-10-02", oroTeoricoOz: 110, oroRealOz: 104, eficiencia: 94, toneladas: 850 },
        { fecha: "2025-10-03", oroTeoricoOz: 115, oroRealOz: 111, eficiencia: 97, toneladas: 870 },
      ];

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Calandrias");
      XLSX.writeFile(wb, "informe_calandrias.xlsx");
    } catch (err) {
      console.error("Error al generar informe:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={exportar}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-60"
    >
      {loading ? "Generando..." : "⬇️ Descargar Informe"}
    </button>
  );
}
