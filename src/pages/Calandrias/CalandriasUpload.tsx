import { useState } from "react";
import * as XLSX from "xlsx";

export default function CalandriasUpload() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMsg(null);

    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

      console.log("📄 Datos leídos del Excel:", rows);

      setMsg(`Archivo cargado correctamente (${rows.length} filas leídas).`);
    } catch (error: any) {
      console.error(error);
      setMsg("Error al procesar el archivo. Verifica el formato.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label
        className={`cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileChange}
          className="hidden"
          disabled={loading}
        />
        <span>📤 Subir Excel</span>
      </label>

      {msg && (
        <p className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
          {msg}
        </p>
      )}
    </div>
  );
}
