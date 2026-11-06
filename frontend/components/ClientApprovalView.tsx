import React, { useState } from 'react';
import { ChangeRequest, Project } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  Calendar, 
  FileText, 
  Printer, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  Building, 
  User, 
  Check, 
  Send, 
  Lock, 
  ThumbsUp, 
  XCircle, 
  Info
} from 'lucide-react';

interface ClientApprovalViewProps {
  request: ChangeRequest;
  project: Project | undefined;
  onClose: () => void;
  onApprove: (signatureName: string, notes?: string) => void;
  onReject?: (reason: string) => void;
  onOpenFormalProposal?: (req: ChangeRequest) => void;
}

export const ClientApprovalView: React.FC<ClientApprovalViewProps> = ({
  request,
  project,
  onClose,
  onApprove,
  onReject,
  onOpenFormalProposal
}) => {
  const [signatureName, setSignatureName] = useState(
    request.klantHandtekening || request.klantContactpersoon || ''
  );
  const [notes, setNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(request.status === 'goedgekeurd');
  const [isRejected, setIsRejected] = useState(request.status === 'afgewezen');
  const [copiedLink, setCopiedLink] = useState(false);

  const subtotal = request.totaalBedrag;
  const vatAmount = Math.round(subtotal * 0.21);
  const grandTotal = subtotal + vatAmount;

  const handleQuickApprove = () => {
    const approver = signatureName.trim() || request.klantContactpersoon || 'Gemachtigde Klant';
    onApprove(approver, notes);
    setIsSuccess(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert('Geef a.u.b. een korte reden voor afwijzing op.');
      return;
    }
    if (onReject) {
      onReject(rejectReason.trim());
    }
    setIsRejected(true);
    setShowRejectForm(false);
  };

  const handleCopyApprovalLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Navigation & Simulation Banner */}
        <div className="flex items-center justify-between no-print">
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 text-xs text-slate-700 hover:text-slate-900 font-semibold bg-white/95 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Terug naar Consultant Overzicht</span>
          </button>

          <div className="flex items-center space-x-2">
            {onOpenFormalProposal && (
              <button
                onClick={() => onOpenFormalProposal(request)}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium transition shadow-sm"
                title="Bekijk de formele meerwerkofferte inclusief handtekeningkader"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Formele Offerte</span>
              </button>
            )}

            <button
              onClick={handleCopyApprovalLink}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium transition shadow-sm"
              title="Kopieer de unieke klant-link"
            >
              <span>{copiedLink ? 'Link Gekopieerd!' : 'Deel Klantlink'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium transition shadow-sm"
              title="Print of bewaar als PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF / Print</span>
            </button>
          </div>
        </div>

        {/* Clean Executive Approval Document Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden">
          {/* Top Document Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      Scope Wijzigingsverzoek
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      #{request.id.toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                    Akkoord Meerwerk Dashboard
                  </h1>
                </div>
              </div>

              {/* Status Badge */}
              <div className="self-start sm:self-center">
                {isSuccess ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Goedgekeurd</span>
                  </span>
                ) : isRejected ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-400/40">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Niet geaccordeerd</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 animate-pulse">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Wacht op Akkoord</span>
                  </span>
                )}
              </div>
            </div>

            {/* Sub-meta details bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Klantorganisatie:</span>
                <span className="font-semibold text-slate-100 flex items-center space-x-1 mt-0.5">
                  <Building className="w-3 h-3 text-slate-400 inline" />
                  <span>{project?.klant || 'Organisatie'}</span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Contactpersoon:</span>
                <span className="font-semibold text-slate-100 flex items-center space-x-1 mt-0.5">
                  <User className="w-3 h-3 text-slate-400 inline" />
                  <span>{request.klantContactpersoon}</span>
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[11px]">Datum voorstel:</span>
                <span className="font-semibold text-slate-100 flex items-center space-x-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-slate-400 inline" />
                  <span>{request.datumAangemaakt}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Document Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Friendly Greeting */}
            <div className="text-slate-700 text-sm leading-relaxed">
              <p>
                Beste <strong>{request.klantContactpersoon}</strong>,
              </p>
              <p className="mt-2">
                Tijdens de lopende realisatie van het{' '}
                <span className="font-semibold text-slate-900">{project?.naam}</span> hebben we onderstaande
                aanvullende klantvraag ontvangen. Om de kwaliteit en de afgesproken oplevering te waarborgen,
                hebben we de benodigde uren en impact berekend op basis van eerdere gerealiseerde dashboardcomponenten.
              </p>
            </div>

            {/* Requested Feature Section */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Gevraagde Uitbreiding
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {request.categorie}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {request.titel}
              </h2>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 italic border-l-4 border-l-indigo-600">
                "{request.klantVraagRuweTekst}"
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-800 block mb-1">
                  Waarom valt dit buiten de initiële offerte?
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {request.onderbouwing}
                </p>
              </div>
            </div>

            {/* Work Breakdown Timeline/Items */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Uitsplitsing van de Werkzaamheden
                </span>
                <span className="text-xs text-slate-500">
                  Gebaseerd op historische projectdata
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white shadow-sm">
                {request.takenUitsplitsing.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs sm:text-sm gap-3">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-900">{item.fase}</span>
                      <p className="text-xs text-slate-500">{item.omschrijving}</p>
                    </div>
                    <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap">
                      {item.uren} uur
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Overview & Hours Summary Box */}
            <div className="bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 border-2 border-indigo-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-indigo-100">
                <div>
                  <span className="text-xs text-slate-500 block">Berekende Extra Uren:</span>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {request.geschatteUren}
                    </span>
                    <span className="text-sm font-semibold text-slate-600">uur</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Tarief: €{request.uurtarief}/uur
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Verwachte Doorlooptijd:</span>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-2xl font-bold text-slate-800">
                      ca. {request.doorlooptijdDagen}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">werkdagen</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 mt-0.5 block flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                    <span>Inplanning direct na akkoord</span>
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-slate-500 block">Totaal Investering:</span>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-700 mt-1">
                    €{subtotal.toLocaleString('nl-NL')}
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    excl. 21% BTW (€{grandTotal.toLocaleString('nl-NL')} incl. BTW)
                  </span>
                </div>
              </div>

              {/* Guarantees note */}
              <div className="pt-3.5 flex items-start space-x-2 text-xs text-slate-600">
                <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Garantie:</strong> Na digitaal akkoord wordt dit meerwerk direct aan het declarabele budget gekoppeld. De overige initiële dashboardscope blijft ongewijzigd conform de basisofferte.
                </p>
              </div>
            </div>

            {/* Approval / Rejection Action Area */}
            {isSuccess ? (
              /* Already Approved State */
              <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-2 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                  Akkoord Digitaal Bevestigd!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                  Dit verzoek is op <strong>{request.datumGoedgekeurd || new Date().toISOString().split('T')[0]}</strong> geaccordeerd door{' '}
                  <span className="font-semibold">{request.klantHandtekening || signatureName || request.klantContactpersoon}</span>.
                </p>
                <div className="pt-3 flex justify-center space-x-2 no-print">
                  {onOpenFormalProposal && (
                    <button
                      onClick={() => onOpenFormalProposal(request)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition shadow-sm flex items-center space-x-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Bekijk Formele Offerte</span>
                    </button>
                  )}
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-white text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition shadow-sm flex items-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Download Bevestiging (PDF)</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow-sm"
                  >
                    Sluiten
                  </button>
                </div>
              </div>
            ) : isRejected ? (
              /* Rejected State */
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-2">
                <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-base font-bold text-rose-900">
                  Voorstel Niet Geaccordeerd
                </h3>
                <p className="text-xs text-rose-700 max-w-md mx-auto">
                  De klant heeft dit meerwerkverzoek afgewezen of gevraagd om binnen de basis scope te blijven.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-white border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold hover:bg-rose-100"
                >
                  Sluiten
                </button>
              </div>
            ) : (
              /* Active One-Click Approval Box */
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>1-Klik Digitaal Akkoord</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Geef direct akkoord namens {project?.klant} voor snelle opstart.
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Veilig digitaal akkoord conform offertevoorwaarden
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Naam ondertekenaar / akkoordgever:
                    </label>
                    <input
                      type="text"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      placeholder="Bijv. Mark de Vries (CFO)"
                      className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Optionele opmerking bij akkoord:
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Bijv. 'Graag meenemen in de sprint van volgende week'"
                      className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Primary 1-Click Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleQuickApprove}
                    className="w-full sm:flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Akkoord Geven op Meerwerk (€{subtotal.toLocaleString('nl-NL')})</span>
                  </button>

                  <button
                    onClick={() => setShowRejectForm(!showRejectForm)}
                    className="w-full sm:w-auto px-4 py-3 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-xs font-semibold transition"
                  >
                    Niet akkoord / Aanpassen
                  </button>
                </div>

                {/* Rejection / Modification Sub-form */}
                {showRejectForm && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 mt-2 animate-in fade-in">
                    <label className="block text-xs font-semibold text-slate-700">
                      Reden van afwijzing of toelichting:
                    </label>
                    <textarea
                      rows={2}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Bijv: 'We laten dit vervallen ten gunste van de originele deadline' of 'Urenbudget is te hoog'..."
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        onClick={() => setShowRejectForm(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                      >
                        Annuleren
                      </button>
                      <button
                        onClick={handleConfirmReject}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                      >
                        Verzend Afwijzing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <span>
              ScopeCraft • Dashboard Meerwerk & Wijzigingsbeheer
            </span>
            <span className="flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Geldig conform de standaard uurtarief- en projectafspraken</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
