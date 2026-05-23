import { useEffect, useMemo, useState, useDeferredValue } from "react";
import { pancocoApi, type PanCoco } from "../api/pan-coco";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export default function PanCocoPage() {
  const [rows, setRows] = useState<PanCoco[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const debouncedQ = useDebouncedValue(q, 250);
  const deferredQ = useDeferredValue(debouncedQ);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await pancocoApi.list();
        setRows(data);
      } catch (e) {
        setErr(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = deferredQ.trim().toLowerCase();

    if (!term) return rows;

    return rows.filter((p) =>
      `${p.nombre} ${p.precio} ${p.stock}`.toLowerCase().includes(term)
    );
  }, [rows, deferredQ]);

  // =========================
  // CREATE / REGISTRAR
  // =========================
  async function onCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
      const nuevo = await pancocoApi.create({
        nombre,
        precio: Number(precio),
        stock: Number(stock),
      });

      setRows((prev) => [...prev, nuevo]);

      setNombre("");
      setPrecio("");
      setStock("");

    } catch (error) {
      console.error(error);
    }
  }

  // =========================
  // UPDATE / EDITAR
  // =========================
  async function onEdit(p: PanCoco) {

    const nombre = prompt(
      "Nuevo nombre",
      p.nombre
    );

    if (!nombre) return;

    const precio = prompt(
      "Nuevo precio",
      String(p.precio)
    );

    if (!precio) return;

    const stock = prompt(
      "Nuevo stock",
      String(p.stock)
    );

    if (!stock) return;

    try {

      const updated = await pancocoApi.update(
        p.id,
        {
          nombre,
          precio: Number(precio),
          stock: Number(stock),
        }
      );

      setRows((prev) =>
        prev.map((item) =>
          item.id === p.id ? updated : item
        )
      );

    } catch (error) {
      console.error(error);
    }
  }

  // =========================
  // DELETE / BORRAR
  // =========================
  async function onDelete(id: number) {

    if (!confirm("¿Seguro que deseas borrar este Pan Coco?"))
      return;

    try {

      await pancocoApi.remove(id);

      setRows((prev) =>
        prev.filter((p) => p.id !== id)
      );

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            MiniPOS — Pan Coco
          </h1>

          <span className="text-sm text-slate-500">
            Backend: /pan-coco
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">

        {/* =========================
         FORMULARIO CREAR
    ========================= */}

        <form
          onSubmit={onCreate}
          className="rounded-xl border bg-white p-4 space-y-4"
        >

          <h2 className="text-lg font-semibold">
            Registrar Pan Coco
          </h2>

          <div className="grid gap-3 md:grid-cols-3">

            <div>
              <label className="block text-sm mb-1">
                Nombre
              </label>

              <input
                className="w-full rounded-lg border px-3 py-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Precio
              </label>

              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Stock
              </label>

              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>

          </div>

          <button
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Crear
          </button>

        </form>

        {/* =========================
         BUSCADOR
    ========================= */}

        <div className="rounded-xl border bg-white p-4">
          <label className="block text-sm font-medium mb-2">
            Buscar
          </label>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nombre, precio o stock…"
            className="w-full rounded-lg border bg-white px-3 py-2"
          />

          <p className="mt-2 text-xs text-slate-500">
            Debounce + Deferred: reduce recálculos y mejora la fluidez.
          </p>
        </div>

        {/* =========================
         TABLA
    ========================= */}

        <div className="rounded-xl border bg-white">

          <div className="p-4 border-b">

            {loading && (
              <p className="text-sm text-slate-600">
                Cargando…
              </p>
            )}

            {err && (
              <p className="text-sm text-red-600">
                Error: {err}
              </p>
            )}

            {!loading && !err && (
              <p className="text-sm text-slate-600">
                {filtered.length} registro(s)
              </p>
            )}

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 w-40">Acción</th>
                </tr>
              </thead>

              <tbody>

                {filtered.map((p) => (

                  <tr key={p.id} className="border-t">

                    <td className="p-3">
                      {p.nombre}
                    </td>

                    <td className="p-3">
                      ${p.precio}
                    </td>

                    <td className="p-3">
                      {p.stock}
                    </td>

                    <td className="p-3">

                      <button
                        className="rounded-md border px-2 py-1 mr-2 hover:bg-slate-50"
                        onClick={() => onEdit(p)}
                      >
                        Editar
                      </button>

                      <button
                        className="rounded-md border px-2 py-1 hover:bg-slate-50"
                        onClick={() => onDelete(p.id)}
                      >
                        Borrar
                      </button>

                    </td>

                  </tr>

                ))}

                {!loading &&
                  !err &&
                  filtered.length === 0 && (
                    <tr>
                      <td
                        className="p-6 text-center text-slate-500"
                        colSpan={4}
                      >
                        No hay datos. Crea algunos con Postman (POST /pan-coco).
                      </td>
                    </tr>
                  )}

              </tbody>

            </table>

          </div>

        </div>

      </main>
    </div>
  );
}