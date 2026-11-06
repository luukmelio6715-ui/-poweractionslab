import React, { useState } from 'react';
import { ChangeRequest, Project } from '../types';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Copy, 
  FileText, 
  ExternalLink, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  Check, 
  ThumbsUp, 
  Printer
} from 'lucide-react';

interface RequestDetailModalProps {
  request: ChangeRequest | null;
  project: Project | undefined;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: ChangeRequest['status'], signature?: string) => void;
  onOpenClientPortal: (req: ChangeRequest) => void;
  onOpenFormalProposal: (req: ChangeRequest) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  project,
  onClose,
  onUpdateStatus,
  onOpenClientPortal,
  onOpenFormalProposal
}) => {
  if (!request) return null;

  const [copiedEmail, setCopiedEmail] = useState(false);

  const emailDraft = `Beste ${request.klantContactpersoon.split(' ')[0] || 'relatie'},

Naar aanleiding van jullie vraag:
"${request.klantVraagRuweTekst}"

Hebben we de impact op het dashboard geanalyseerd aan de hand van eerdere gerealiseerde dashboardcomponenten.

SAMENVATTING MEERWERK:
• Onderwerp: ${request.titel}
• Categorie: ${request.categorie}
• Inschatting: ${request.geschatteUren} uur (€${request.totaalBedrag.toLocaleString('nl-NL')} excl. btw)
• Doorlooptijd: ca. ${request.doorlooptijdDagen} werkdagen

TOELICHTING & FASERING:
${request.onderbouwing}

In de bijgevoegde link kan dit voorstel met één klik digitaal worden goedgekeurd zodat we dit direct kunnen inplannen. De formele offerte kan tevens als PDF worden gedownload.

Met vriendelijke groet,
Het Dashboard Development Team`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailDraft);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-mono px-2 py-0.5 bg-slate-800 rounded text-slate-300">
                {request.id.toUpperCase()}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  request.status === 'goedgekeurd'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : request.status === 'verzonden'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {request.status.toUpperCase()}
              </span>
            </div>
            <h3 className="font-bold text-lg sm:text-xl text-white">{request.titel}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
          {/* Key Metric Highlight */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block">Berekende Uren</span>
              <span className="text-xl font-bold text-slate-900">{request.geschatteUren} uur</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Kosten Excl. BTW</span>
              <span className="text-xl font-bold text-indigo-700">
                €{request.totaalBedrag.toLocaleString('nl-NL')}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Verwachte Doorlooptijd</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 block">
                {request.doorlooptijdDagen} werkdagen
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Risico Factor</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 block">
                {request.risicoFactor}
              </span>
            </div>
          </div>

          {/* Original Question & Category */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Oorspronkelijke Vraag van de Klant:
            </span>
            <div className="p-3 bg-slate-100 rounded-xl text-slate-800 italic border-l-4 border-indigo-500">
              "{request.klantVraagRuweTekst}"
            </div>
          </div>

          {/* Breakdown of Tasks */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Gedetailleerde Taken & Urenspecificatie:
            </span>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
              {request.takenUitsplitsing.map((item, idx) => (
                <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{item.fase}</span>
                    <p className="text-slate-600 mt-0.5">{item.omschrijving}</p>
                  </div>
                  <span className="font-bold text-slate-800 px-2 py-1 bg-slate-100 rounded">
                    {item.uren} uur
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rationale */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Onderbouwing & Scope Afbakening:
            </span>
            <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 text-xs leading-relaxed">
              {request.onderbouwing}
            </p>
          </div>

          {/* Client Email Preview / Ready to Send Box */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Gegenereerde Klant E-mail & Akkoordtekst</span>
              </span>
              <button
                onClick={handleCopyEmail}
                className="flex items-center space-x-1 text-xs text-indigo-700 hover:text-indigo-900 font-semibold bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-sm transition"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Gekopieerd!' : 'Kopieer E-mail'}</span>
              </button>
            </div>
            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans bg-white p-3 rounded-lg border border-indigo-100 max-h-36 overflow-y-auto">
              {emailDraft}
            </pre>
          </div>

          {/* Client Status / Signature Card */}
          {request.status === 'goedgekeurd' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-emerald-900 block">
                  Klant Heeft Akkoord Gegeven!
                </span>
                <p className="text-xs text-emerald-700">
                  Ondertekend door <span className="font-semibold">{request.klantHandtekening || request.klantContactpersoon}</span> op {request.datumGoedgekeurd || 'recente datum'}. De uren zijn toegevoegd aan het declarabele budget.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenFormalProposal(request)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              <span>Formele Offerte Exporteren (PDF)</span>
            </button>

            <button
              onClick={() => onOpenClientPortal(request)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Open Klant Akkoord View</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {request.status !== 'goedgekeurd' && (
              <>
                <button
                  onClick={() => onUpdateStatus(request.id, 'verzonden')}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Markeer als Verzonden</span>
                </button>
                <button
                  onClick={() => onUpdateStatus(request.id, 'goedgekeurd', request.klantContactpersoon)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Direct Goedkeuren</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
