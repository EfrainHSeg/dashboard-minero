export default function Summary() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-slate-900">Summary</h1>
        <p className="text-sm text-slate-500">Consolidado general (placeholder).</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 bg-slate-50/60">
          Aquí mostraremos totales y comparativas por áreas cuando conectemos datos.
        </div>
      </div>
    </div>
  );
}
