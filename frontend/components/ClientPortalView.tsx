import React, { useState } from 'react';
import { ChangeRequest, Project } from '../types';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  ArrowLeft, 
  PenTool, 
  Check, 
  Building2,
  FileCheck
} from 'lucide-react';

interface ClientPortalViewProps {
  request: ChangeRequest;
  project: Project | undefined;
  onClose: () => void;
  onApprove: (signatureName: string) => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  request,
  project,
  onClose,
  onApprove
}) => {
  const [signatureName, setSignatureName] = useState(request.klantContactpersoon || '');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSuccess, setIsSuccess] = useState(request.status === 'goedgekeurd');

  const handleSign = () => {
    if (!signatureName.trim()) {
      alert('Vul uw naam in ter verificatie van het digitale akkoord.');
      return;
    }
    if (!agreedTerms) {
      alert('Vink a.u.b. het akkoord vakje aan.');
      return;
    }

    onApprove(signatureName.trim());
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 overflow-y-auto p-4 sm:p-8 animate-in fade-in duration-200">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Top bar back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Terug naar Consultant Dashboard</span>
          </button>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
            Klant Portaal Simulatie
          </span>
        </div>

        {/* Formal Proposal Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                <span className="font-bold text-lg">Meerwerkverzoek & Scope Goedkeuring</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono">
                REF #{request.id.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Project: {project?.naam || 'Dashboard Project'} voor {project?.klant}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Greeting & Summary */}
            <div>
              <p className="text-sm text-slate-800">
                Geachte <strong>{request.klantContactpersoon}</strong>,
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Tijdens de lopende dashboardontwikkeling is de volgende aanvullende functionaliteit
                verzocht. Omdat deze buiten de oorspronkelijke offerte valt, vragen we via dit document
                uw schriftelijke goedkeuring om deze werkzaamheden uit te voeren:
              </p>
            </div>

            {/* Request Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">{request.titel}</h3>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  {request.categorie}
                </span>
              </div>

              <div className="text-xs text-slate-600 border-l-2 border-indigo-400 pl-3 italic">
                "{request.klantVraagRuweTekst}"
              </div>

              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {request.onderbouwing}
              </p>
            </div>

            {/* Tasks breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Overzicht van werkzaamheden:
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {request.takenUitsplitsing.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{item.fase}</span>
                      <p className="text-slate-500">{item.omschrijving}</p>
                    </div>
                    <span className="font-bold text-slate-700">{item.uren} uur</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-600 block">Totale Extra Uren</span>
                <span className="text-xl font-bold text-slate-900">{request.geschatteUren} uur</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-600 block">
                  Totaalbedrag (€{request.uurtarief}/uur)
                </span>
                <span className="text-2xl font-bold text-indigo-700">
                  €{request.totaalBedrag.toLocaleString('nl-NL')}
                </span>
                <span className="text-[10px] text-slate-500 block">excl. btw</span>
              </div>
            </div>

            {/* Signature Area */}
            {isSuccess ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-6 text-center space-y-2">
                <FileCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">
                  Akkoord Succesvol Vastgelegd!
                </h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Het verzoek is digitaal goedgekeurd door <strong>{signatureName}</strong>. Het
                  ontwikkelteam is direct op de hoogte gebracht en start met de realisatie.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                  >
                    Sluiten en terugkeren
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <PenTool className="w-4 h-4 text-indigo-600" />
                  <span>Digitale Handtekening & Akkoord</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Naam Gemachtigde:
                  </label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="Uw volledige naam"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    Hierbij geef ik formeel akkoord op de uitbreiding van de dashboardscope met bovengenoemde {request.geschatteUren} uren conform de geldende tariefafspraken.
                  </span>
                </label>

                <button
                  onClick={handleSign}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Akkoord Bevestigen & Ondertekenen</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
