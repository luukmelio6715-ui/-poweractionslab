import React, { useState } from 'react';
import { Project, TaskCategory, HistoricalTask, ChangeRequest } from '../types';
import { estimateCustomerRequest } from '../services/geminiService';
import { 
  Sparkles, 
  X, 
  HelpCircle, 
  Clock, 
  Layers, 
  AlertTriangle, 
  Send,
  Database
} from 'lucide-react';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  defaultProjectId: string;
  historicalTasks: HistoricalTask[];
  onSaveRequest: (newReq: ChangeRequest, sendDirectly: boolean) => void;
}

const CATEGORIES: TaskCategory[] = [
  'Complexe Metric / DAX / SQL',
  'Data Koppeling & ETL',
  'Nieuwe Dashboard Pagina',
  'Autorisatie & RLS',
  'Automatisering & Export',
  'UI/UX & Interactief Redesign',
  'Overig Meerwerk'
];

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  projects,
  defaultProjectId,
  historicalTasks,
  onSaveRequest
}) => {
  if (!isOpen) return null;

  const [projectId, setProjectId] = useState<string>(defaultProjectId || projects[0]?.id || '');
  const [titel, setTitel] = useState('');
  const [categorie, setCategorie] = useState<TaskCategory>('Complexe Metric / DAX / SQL');
  const [klantVraagRuweTekst, setKlantVraagRuweTekst] = useState('');
  
  // Estimation State
  const [isEstimating, setIsEstimating] = useState(false);
  const [hasEstimated, setHasEstimated] = useState(false);
  const [geschatteUren, setGeschatteUren] = useState<number>(8);
  const [onderbouwing, setOnderbouwing] = useState('');
  const [faseItems, setFaseItems] = useState<{ fase: string; omschrijving: string; uren: number }[]>([]);
  const [historischeReferenties, setHistorischeReferenties] = useState<string[]>([]);
  const [risicoFactor, setRisicoFactor] = useState<'Laag' | 'Gemiddeld' | 'Hoog'>('Gemiddeld');
  const [doorlooptijdDagen, setDoorlooptijdDagen] = useState<number>(3);

  const selectedProject = projects.find((p) => p.id === projectId) || projects[0];

  const handleRunEstimation = async () => {
    if (!klantVraagRuweTekst.trim()) {
      alert('Vul a.u.b. de vraag van de klant in.');
      return;
    }

    setIsEstimating(true);
    try {
      const result = await estimateCustomerRequest(
        klantVraagRuweTekst,
        categorie,
        selectedProject.beschrijvingScope,
        historicalTasks
      );

      setGeschatteUren(result.geschatteUren);
      setOnderbouwing(result.onderbouwing);
      setFaseItems(result.takenUitsplitsing);
      setHistorischeReferenties(result.relevanteHistorischeReferenties);
      setRisicoFactor(result.risicoFactor);
      setDoorlooptijdDagen(result.doorlooptijdDagen);
      setHasEstimated(true);

      if (!titel) {
        // Generate quick title from the question
        setTitel(klantVraagRuweTekst.slice(0, 45) + (klantVraagRuweTekst.length > 45 ? '...' : ''));
      }
    } catch (err) {
      console.error(err);
      alert('Er is een fout opgetreden bij de urenschatting.');
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSave = (sendDirectly: boolean) => {
    if (!titel.trim()) {
      alert('Geef het meerwerkverzoek een korte titel.');
      return;
    }

    const calculatedTotaal = Math.round(geschatteUren * selectedProject.uurtarief);

    const newRequest: ChangeRequest = {
      id: `cr-${Date.now()}`,
      projectId: selectedProject.id,
      titel: titel.trim(),
      klantVraagRuweTekst: klantVraagRuweTekst.trim(),
      categorie,
      status: sendDirectly ? 'verzonden' : 'concept',
      datumAangemaakt: new Date().toISOString().split('T')[0],
      geschatteUren,
      uurtarief: selectedProject.uurtarief,
      totaalBedrag: calculatedTotaal,
      onderbouwing: onderbouwing || 'Inschatting gebaseerd op historische projectdata.',
      takenUitsplitsing: faseItems.length > 0 ? faseItems : [
        { fase: 'Uitvoering & Testen', omschrijving: 'Realisatie van de klantwens in het dashboard', uren: geschatteUren }
      ],
      relevanteHistorischeReferenties: historischeReferenties,
      risicoFactor,
      doorlooptijdDagen,
      klantContactpersoon: selectedProject.contactpersoon,
      klantEmail: selectedProject.email
    };

    onSaveRequest(newRequest, sendDirectly);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Nieuwe Klantvraag Omzetten naar Meerwerk</h3>
              <p className="text-xs text-slate-400">
                Urenberekening op basis van historische data en direct verzoek naar klant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Input details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Betrokken Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.naam} ({p.klant})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Categorie Dashboard Wijziging
              </label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value as TaskCategory)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Wat vraagt de klant letterlijk? (E-mail, Teams of Telefoongesprek)</span>
              <span className="text-[11px] text-slate-400 font-normal">Kopieer gerust ruwe tekst</span>
            </label>
            <textarea
              rows={3}
              value={klantVraagRuweTekst}
              onChange={(e) => setKlantVraagRuweTekst(e.target.value)}
              placeholder='Bijv: "De CFO wil opeens ook de urendeclarabiliteit per consultant kunnen zien met een doorklik naar niet-productieve uren..."'
              className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
            />
          </div>

          {/* Quick AI Estimation Trigger */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 text-indigo-900">
              <Database className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-semibold block">Vergelijk met Historische Opleveringen</span>
                <span className="text-indigo-700">
                  De app zoekt naar vergelijkbare DAX/ETL/visual taken en schat de benodigde uren.
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isEstimating || !klantVraagRuweTekst.trim()}
              onClick={handleRunEstimation}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm flex-shrink-0 ${
                isEstimating
                  ? 'bg-indigo-400 text-white cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEstimating ? 'Historie Analyseren...' : 'Bereken Extra Uren'}</span>
            </button>
          </div>

          {/* Step 2: Estimation Results & Adjustments */}
          {hasEstimated && (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/80 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <span>Inschatting Resultaat & Uitsplitsing</span>
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500">Risico:</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      risicoFactor === 'Laag'
                        ? 'bg-emerald-100 text-emerald-800'
                        : risicoFactor === 'Gemiddeld'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {risicoFactor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Korte Titel voor Offerte / Verzoek
                </label>
                <input
                  type="text"
                  value={titel}
                  onChange={(e) => setTitel(e.target.value)}
                  placeholder="Bijv. Uitbreiding Declarabiliteit & Doorklik Pagina"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Hours Slider & Direct Override */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Geschatte Uren:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={geschatteUren}
                      onChange={(e) => setGeschatteUren(parseFloat(e.target.value) || 0)}
                      className="w-20 text-lg font-bold text-indigo-700 border border-slate-200 rounded px-2 py-0.5 focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-600 font-semibold">uur</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Uurtarief:</span>
                  <span className="text-sm font-semibold text-slate-800 block mt-1">
                    €{selectedProject.uurtarief} / uur
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Totaalbedrag Klant:</span>
                  <span className="text-lg font-bold text-slate-900 block mt-0.5">
                    €{(Math.round(geschatteUren * selectedProject.uurtarief)).toLocaleString('nl-NL')}{' '}
                    <span className="text-xs font-normal text-slate-500">excl. btw</span>
                  </span>
                </div>
              </div>

              {/* Phase Breakdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Taakverdeling & Fasering:
                </label>
                <div className="space-y-1.5">
                  {faseItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200"
                    >
                      <div className="pr-2">
                        <span className="font-semibold text-slate-800">{item.fase}: </span>
                        <span className="text-slate-600">{item.omschrijving}</span>
                      </div>
                      <span className="font-bold text-indigo-600 whitespace-nowrap">
                        {item.uren} u
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rationale for Client */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Onderbouwing voor Klant (Waarom is dit meerwerk?):
                </label>
                <textarea
                  rows={2}
                  value={onderbouwing}
                  onChange={(e) => setOnderbouwing(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 text-slate-700"
                />
              </div>

              {historischeReferenties.length > 0 && (
                <div className="text-[11px] text-slate-500 bg-slate-100 p-2 rounded">
                  <span className="font-semibold">Historische referenties gebruikt: </span>
                  {historischeReferenties.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Klantontvanger: <span className="font-semibold text-slate-700">{selectedProject.contactpersoon}</span> ({selectedProject.email})
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Annuleren
            </button>

            {hasEstimated ? (
              <>
                <button
                  onClick={() => handleSave(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition"
                >
                  Opslaan als Concept
                </button>

                <button
                  onClick={() => handleSave(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Opslaan & Verstuur Verzoek</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleRunEstimation}
                disabled={isEstimating || !klantVraagRuweTekst.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Eerst Uren Schatten</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
