import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Gasto {
  id: string;
  data: string; // yyyy-mm-dd
  descricao: string;
  valor: number;
  categoria: string;
}

interface Filtro {
  data: string;
  categoria: string;
}

const CATEGORIAS_DEFAULT = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Educação",
  "Saúde",
  "Investimentos",
  "Outros",
];

const App = () => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [novoGasto, setNovoGasto] = useState<Omit<Gasto, "id">>({
    data: "",
    descricao: "",
    valor: 0,
    categoria: "",
  });
  const [categorias, setCategorias] = useState<string[]>(CATEGORIAS_DEFAULT);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [filtro, setFiltro] = useState<Filtro>({ data: "", categoria: "" });
  const [mounted, setMounted] = useState(false);

  // Animação de entrada
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  const handleAddGasto = () => {
    if (!novoGasto.data || !novoGasto.descricao || !novoGasto.valor || !novoGasto.categoria) {
      alert("Preencha todos os campos do gasto antes de adicionar.");
      return;
    }

    const valorNumber = Number(novoGasto.valor);
    if (isNaN(valorNumber) || valorNumber <= 0) {
      alert("Informe um valor válido maior que zero.");
      return;
    }

    const novo: Gasto = {
      id: uuidv4(),
      ...novoGasto,
      valor: valorNumber,
    };

    setGastos((prev) => [novo, ...prev]);
    setNovoGasto({
      data: "",
      descricao: "",
      valor: 0,
      categoria: "",
    });
  };

  const handleRemoveGasto = (id: string) => {
    setGastos((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddCategoria = () => {
    const nome = novaCategoria.trim();
    if (!nome) return;
    if (categorias.includes(nome)) {
      alert("Esta categoria já existe.");
      return;
    }

    setCategorias((prev) => [...prev, nome]);
    setNovaCategoria("");
  };

  const handleLimparFiltros = () => {
    setFiltro({ data: "", categoria: "" });
  };

  const gastosFiltrados = useMemo(
    () =>
      gastos.filter((g) => {
        const matchData = !filtro.data || g.data === filtro.data;
        const matchCategoria =
          !filtro.categoria || g.categoria === filtro.categoria;
        return matchData && matchCategoria;
      }),
    [gastos, filtro]
  );

  const totalFiltrado = useMemo(
    () => gastosFiltrados.reduce((acc, curr) => acc + curr.valor, 0),
    [gastosFiltrados]
  );

  const totalGeral = useMemo(
    () => gastos.reduce((acc, curr) => acc + curr.valor, 0),
    [gastos]
  );

  const categoriaMaisCara = useMemo(() => {
    if (!gastos.length) return "-";

    const mapa = new Map<string, number>();
    gastos.forEach((g) => {
      mapa.set(g.categoria, (mapa.get(g.categoria) ?? 0) + g.valor);
    });

    let maiorCategoria = "";
    let maiorValor = 0;

    mapa.forEach((valor, categoria) => {
      if (valor > maiorValor) {
        maiorValor = valor;
        maiorCategoria = categoria;
      }
    });

    return maiorCategoria || "-";
  }, [gastos]);

  const dadosGraficoCategorias = useMemo(
    () =>
      categorias.map((cat) => ({
        categoria: cat,
        total: gastos
          .filter((g) => g.categoria === cat)
          .reduce((acc, cur) => acc + cur.valor, 0),
      })),
    [categorias, gastos]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent text-white px-4 py-8 md:px-10">
      <div
        className={`mx-auto max-w-6xl rounded-3xl bg-background/70 shadow-soft backdrop-blur-xl border border-white/10 transition-all duration-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Cabeçalho */}
        <header className="border-b border-white/10 px-6 py-6 md:px-10 md:py-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted">
              Dashboard financeiro
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
              Controle de Gastos
            </h1>
            <p className="mt-2 text-sm text-muted md:text-base">
              Registre, visualize e analise seus gastos por categoria e data em
              um painel moderno e intuitivo.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-right text-xs md:text-sm text-muted">
            <span className="inline-flex items-center justify-end gap-2 rounded-full bg-white/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Dados locais no navegador
            </span>
            <span>Feito com React + TypeScript + Vite + Tailwind</span>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="px-6 py-6 md:px-10 md:py-8 space-y-8">
          {/* Cards de resumo */}
          <section className="grid gap-4 md:grid-cols-4">
            <div className="card hover:translate-y-[-2px] hover:shadow-xl transition-all">
              <p className="text-xs text-muted">Total geral</p>
              <p className="mt-2 text-2xl font-semibold">
                R$ {totalGeral.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-emerald-400">
                Soma de todos os lançamentos
              </p>
            </div>

            <div className="card hover:translate-y-[-2px] hover:shadow-xl transition-all">
              <p className="text-xs text-muted">Total filtrado</p>
              <p className="mt-2 text-2xl font-semibold">
                R$ {totalFiltrado.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-cyan-400">
                Considerando filtros aplicados
              </p>
            </div>

            <div className="card flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-xl transition-all">
              <div>
                <p className="text-xs text-muted">Lançamentos</p>
                <p className="mt-2 text-2xl font-semibold">{gastos.length}</p>
              </div>
              <p className="mt-1 text-xs text-orange-400">
                Quantidade total de gastos cadastrados
              </p>
            </div>

            <div className="card flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-xl transition-all">
              <div>
                <p className="text-xs text-muted">Categoria mais cara</p>
                <p className="mt-2 text-lg font-semibold break-words">
                  {categoriaMaisCara}
                </p>
              </div>
              <p className="mt-1 text-xs text-pink-400">
                Com maior soma de gastos
              </p>
            </div>
          </section>

          {/* Formulário + filtros */}
          <section className="grid gap-6 lg:grid-cols-[2fr,1.4fr]">
            {/* Adicionar gasto */}
            <div className="card space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary text-sm">
                    +
                  </span>
                  Adicionar gasto
                </h2>
                <span className="text-xs text-muted">
                  Preencha os campos e clique em &quot;Adicionar&quot;
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-5">
                <input
                  type="date"
                  className="input md:col-span-1"
                  value={novoGasto.data}
                  onChange={(e) =>
                    setNovoGasto({ ...novoGasto, data: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Descrição"
                  className="input md:col-span-2"
                  value={novoGasto.descricao}
                  onChange={(e) =>
                    setNovoGasto({ ...novoGasto, descricao: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Valor"
                  className="input md:col-span-1"
                  value={Number(novoGasto.valor) || ""}
                  onChange={(e) =>
                    setNovoGasto({
                      ...novoGasto,
                      valor: Number(e.target.value),
                    })
                  }
                />
                <select
                  className="select md:col-span-1"
                  value={novoGasto.categoria}
                  onChange={(e) =>
                    setNovoGasto({
                      ...novoGasto,
                      categoria: e.target.value,
                    })
                  }
                >
                  <option value="">Categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                <button
                  className="button-secondary md:w-auto w-full"
                  onClick={handleAddGasto}
                >
                  Adicionar gasto
                </button>
              </div>
            </div>

            {/* Filtros + categorias */}
            <div className="space-y-4">
              <div className="card space-y-3">
                <h2 className="text-lg font-semibold text-cyan-400">
                  Filtros
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    type="date"
                    className="input"
                    value={filtro.data}
                    onChange={(e) =>
                      setFiltro((prev) => ({ ...prev, data: e.target.value }))
                    }
                  />
                  <select
                    className="select"
                    value={filtro.categoria}
                    onChange={(e) =>
                      setFiltro((prev) => ({
                        ...prev,
                        categoria: e.target.value,
                      }))
                    }
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    className="button text-sm bg-transparent border border-white/20 hover:bg-white/10"
                    onClick={handleLimparFiltros}
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>

              <div className="card space-y-3">
                <h2 className="text-lg font-semibold text-lime-400">
                  Categorias
                </h2>
                <div className="flex flex-wrap gap-2">
                  {categorias.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-lime-500/20 px-3 py-1 text-xs font-semibold text-lime-300 border border-lime-400/30"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Nova categoria"
                    className="input flex-1"
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                  />
                  <button
                    className="button-secondary whitespace-nowrap"
                    onClick={handleAddCategoria}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Tabela + gráfico */}
          <section className="grid gap-6 lg:grid-cols-[1.6fr,1.2fr]">
            {/* Tabela */}
            <div className="card overflow-hidden">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-orange-400">
                  Lançamentos
                </h2>
                <span className="text-xs text-muted">
                  {gastosFiltrados.length} resultado
                  {gastosFiltrados.length !== 1 && "s"} encontrado
                  {gastosFiltrados.length !== 1 && "s"}
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 pr-1">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-muted">
                      <th className="py-2 pr-2">Data</th>
                      <th className="py-2 pr-2">Descrição</th>
                      <th className="py-2 pr-2">Categoria</th>
                      <th className="py-2 pr-2 text-right">Valor (R$)</th>
                      <th className="py-2 pl-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastosFiltrados.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 text-center text-xs text-muted"
                        >
                          Nenhum gasto encontrado. Adicione um gasto ou ajuste
                          os filtros.
                        </td>
                      </tr>
                    ) : (
                      gastosFiltrados.map((gasto) => (
                        <tr
                          key={gasto.id}
                          className="border-b border-white/5 last:border-none hover:bg-white/5 transition-colors"
                        >
                          <td className="py-2 pr-2 align-top">
                            {new Date(gasto.data).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="py-2 pr-2 align-top">
                            <p className="font-medium">{gasto.descricao}</p>
                          </td>
                          <td className="py-2 pr-2 align-top">
                            <span className="rounded-full bg-primary/20 px-2 py-1 text-[0.7rem] font-medium text-primary">
                              {gasto.categoria}
                            </span>
                          </td>
                          <td className="py-2 pr-2 text-right align-top font-semibold text-emerald-300">
                            R$ {gasto.valor.toFixed(2)}
                          </td>
                          <td className="py-2 pl-2 text-right align-top">
                            <button
                              className="text-xs text-red-300 hover:text-red-200 hover:underline"
                              onClick={() => handleRemoveGasto(gasto.id)}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gráfico */}
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold text-blue-400">
                Gastos por categoria
              </h2>
              {dadosGraficoCategorias.every((d) => d.total === 0) ? (
                <p className="text-sm text-muted">
                  O gráfico será exibido assim que você adicionar gastos às
                  categorias.
                </p>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosGraficoCategorias}>
                      <XAxis dataKey="categoria" stroke="#e5e7eb" />
                      <YAxis stroke="#e5e7eb" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          borderRadius: 12,
                          border: "1px solid rgba(148, 163, 184, 0.3)",
                        }}
                        labelStyle={{ color: "#e5e7eb" }}
                      />
                      <Bar dataKey="total" fill="#22c55e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 px-6 py-4 md:px-10 md:py-5 text-xs text-muted flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-black/20 rounded-b-3xl">
          <span>
            Controle de Gastos · Interface criada para estudos e portfólio.
          </span>
          <span className="opacity-75">
            Dados armazenados apenas no seu navegador · Nenhum backend conectado
          </span>
        </footer>
      </div>
    </div>
  );
};

export default App;
