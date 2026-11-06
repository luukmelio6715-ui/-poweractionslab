import React, { useState } from 'react';
import { HistoricalTask, TaskCategory } from '../types';
import { Database, Plus, Search, Filter, Clock, CheckCircle } from 'lucide-react';

interface HistoricalDataViewProps {
  tasks: HistoricalTask[];
  onAddTask: (task: HistoricalTask) => void;
}

export const HistoricalDataView: React.FC<HistoricalDataViewProps> = ({ tasks, onAddTask }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form
  const [titel, setTitel] = useState('');
  const [categorie, setCategorie] = useState<TaskCategory>('Complexe Metric / DAX / SQL');
  const [beschrijving, setBeschrijving] = useState('');
  const [geschatteUren, setGeschatteUren] = useState<number>(8);
  const [werkelijkeUren, setWerkelijkeUren] = useState<number>(8.5);
  const [complexiteit, setComplexiteit] = useState<'Laag' | 'Gemiddeld' | 'Hoog'>('Gemiddeld');

  const filtered = tasks.filter((t) => {
    const matchesSearch =
      t.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.beschrijving.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Alle' || t.categorie === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titel.trim()) return;

    const newTask: HistoricalTask = {
      id: `hist-${Date.now()}`,
      titel: titel.trim(),
      categorie,
      beschrijving: beschrijving.trim(),
      geschatteUren,
      werkelijkeUren,
      complexiteit,
      datum: new Date().toISOString().split('T')[0]
    };

    onAddTask(newTask);
    setShowAddModal(false);
    setTitel('');
    setBeschrijving('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Historische Data & Benchmark Catalogus
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Deze historische dashboard-taken worden gebruikt door Gemini om nieuwe ad-hoc
            klantvragen razendsnel en realistisch te kwantificeren.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition flex items-center space-x-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Voeg Benchmark Taak Toe</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Zoek op titel of omschrijving (bijv. API, RLS, DAX)..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          <option value="Alle">Alle Categorieën</option>
          <option value="Data Koppeling & ETL">Data Koppeling & ETL</option>
          <option value="Complexe Metric / DAX / SQL">Complexe Metric / DAX / SQL</option>
          <option value="Nieuwe Dashboard Pagina">Nieuwe Dashboard Pagina</option>
          <option value="Autorisatie & RLS">Autorisatie & RLS</option>
          <option value="Automatisering & Export">Automatisering & Export</option>
          <option value="UI/UX & Interactief Redesign">UI/UX & Interactief Redesign</option>
        </select>
      </div>

      {/* Benchmark Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const variance = item.werkelijkeUren - item.geschatteUren;
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {item.categorie}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1.5">{item.titel}</h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.complexiteit === 'Laag'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.complexiteit === 'Gemiddeld'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.complexiteit}
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{item.beschrijving}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center space-x-3">
                  <span>
                    Geschat: <strong className="text-slate-800">{item.geschatteUren}u</strong>
                  </span>
                  <span>
                    Werkelijk: <strong className="text-slate-900">{item.werkelijkeUren}u</strong>
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    variance > 0 ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {variance > 0 ? `+${variance.toFixed(1)}u uitloop` : `${variance.toFixed(1)}u sneller`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Benchmark */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">
              Nieuwe Benchmark Dashboardtaak Toevoegen
            </h3>

            <form onSubmit={handleSaveNew} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Taaktitel / Functionaliteit
                </label>
                <input
                  type="text"
                  required
                  value={titel}
                  onChange={(e) => setTitel(e.target.value)}
                  placeholder="Bijv. Koppeling met Teamleader CRM"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Categorie</label>
                <select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value as TaskCategory)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Complexe Metric / DAX / SQL">Complexe Metric / DAX / SQL</option>
                  <option value="Data Koppeling & ETL">Data Koppeling & ETL</option>
                  <option value="Nieuwe Dashboard Pagina">Nieuwe Dashboard Pagina</option>
                  <option value="Autorisatie & RLS">Autorisatie & RLS</option>
                  <option value="Automatisering & Export">Automatisering & Export</option>
                  <option value="UI/UX & Interactief Redesign">UI/UX & Interactief Redesign</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Korte Omschrijving
                </label>
                <textarea
                  rows={2}
                  value={beschrijving}
                  onChange={(e) => setBeschrijving(e.target.value)}
                  placeholder="Wat hield het in en welke uitdagingen waren er?"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Geschat (u)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={geschatteUren}
                    onChange={(e) => setGeschatteUren(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Werkelijk (u)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={werkelijkeUren}
                    onChange={(e) => setWerkelijkeUren(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Complexiteit
                  </label>
                  <select
                    value={complexiteit}
                    onChange={(e) => setComplexiteit(e.target.value as any)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Laag">Laag</option>
                    <option value="Gemiddeld">Gemiddeld</option>
                    <option value="Hoog">Hoog</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  Opslaan in Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
