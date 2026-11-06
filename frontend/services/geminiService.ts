import { GoogleGenAI, Type } from '@google/genai';
import { TaskCategory, HistoricalTask, EstimationResult } from '../types';

export async function estimateCustomerRequest(
  klantVraag: string,
  categorie: TaskCategory,
  projectScope: string,
  historischeData: HistoricalTask[]
): Promise<EstimationResult> {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // Intelligent fallback in case API key is not yet provided
    return generateFallbackEstimation(klantVraag, categorie, historischeData);
  }

  try {
    const ai = new GoogleGenAI({ apiKey, vertexai: true });

    const relevantHistSnippet = historischeData
      .map(
        (h) =>
          `- [${h.categorie}] "${h.titel}": ${h.werkelijkeUren} uur werkelijk (${h.complexiteit} complexiteit) - ${h.beschrijving}`
      )
      .join('\n');

    const prompt = `
Je bent een ervaren Senior Business Intelligence & Dashboard Architect.
Een klant heeft een tussentijdse extra vraag/wens ingediend voor een dashboard project. Deze vraag valt BUITEN de initiële projectscope.

INITIËLE PROJECTSCOPE:
"${projectScope}"

NIEUWE EXTRA KLANTVRAAG:
"${klantVraag}"

CATEGORIE:
"${categorie}"

HISTORISCHE REFERENTIE DATA VAN EERDERE DASHBOARDPROJECTEN:
${relevantHistSnippet}

JOUW DOEL:
1. Bepaal accuraat hoeveel extra uren dit kost op basis van vergelijkbare historische taken.
2. Maak een heldere fase-uitsplitsing (bijv. Data-analyse, ETL/Modellering, DAX/Visualisatie, Testen & Oplevering).
3. Geef een professionele, overtuigende onderbouwing voor de klant waarom dit buiten de scope valt en wat er exact moet gebeuren.
4. Schat de doorlooptijd in werkdagen.
5. Formuleer een nette, vriendelijke toelichtende tekst die in de meerwerkofferte naar de klant gestuurd kan worden.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Je bent een accurate offerte specialist voor dashboard en data consultancy. Wees realistisch met uren en leg het helder uit in zakelijk Nederlands.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            geschatteUren: {
              type: Type.NUMBER,
              description: 'Meest waarschijnlijk totaal aantal extra uren (bijv. 8.5)'
            },
            urenMin: {
              type: Type.NUMBER,
              description: 'Minimum uren bij meevallers'
            },
            urenMax: {
              type: Type.NUMBER,
              description: 'Maximum uren bij tegenvallers'
            },
            onderbouwing: {
              type: Type.STRING,
              description: 'Professionele onderbouwing van de extra werkzaamheden'
            },
            risicoFactor: {
              type: Type.STRING,
              description: 'Risico niveau: Laag, Gemiddeld of Hoog'
            },
            doorlooptijdDagen: {
              type: Type.INTEGER,
              description: 'Aantal werkdagen benodigd voor deze toevoeging'
            },
            geadviseerdeKlantTekst: {
              type: Type.STRING,
              description: 'Vriendelijke klanttekst voor het formele meerwerkverzoek'
            },
            relevanteHistorischeReferenties: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lijst van historische taken die als ijkpunt dienden'
            },
            takenUitsplitsing: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  fase: { type: Type.STRING },
                  omschrijving: { type: Type.STRING },
                  uren: { type: Type.NUMBER }
                },
                required: ['fase', 'omschrijving', 'uren'],
                propertyOrdering: ['fase', 'omschrijving', 'uren']
              },
              description: 'Gedetailleerde fasering van de uren'
            }
          },
          required: [
            'geschatteUren',
            'urenMin',
            'urenMax',
            'onderbouwing',
            'risicoFactor',
            'doorlooptijdDagen',
            'geadviseerdeKlantTekst',
            'takenUitsplitsing'
          ],
          propertyOrdering: [
            'geschatteUren',
            'urenMin',
            'urenMax',
            'onderbouwing',
            'risicoFactor',
            'doorlooptijdDagen',
            'geadviseerdeKlantTekst',
            'relevanteHistorischeReferenties',
            'takenUitsplitsing'
          ]
        }
      }
    });

    const parsed: EstimationResult = JSON.parse(response.text.trim());
    return parsed;
  } catch (error) {
    console.error('Gemini estimation error, using fallback:', error);
    return generateFallbackEstimation(klantVraag, categorie, historischeData);
  }
}

function generateFallbackEstimation(
  klantVraag: string,
  categorie: TaskCategory,
  historischeData: HistoricalTask[]
): EstimationResult {
  // Benchmark logic based on category
  let baseHours = 8;
  let risico: 'Laag' | 'Gemiddeld' | 'Hoog' = 'Gemiddeld';
  let refs: string[] = [];

  const matchedHist = historischeData.filter((h) => h.categorie === categorie);
  if (matchedHist.length > 0) {
    const avg =
      matchedHist.reduce((acc, curr) => acc + curr.werkelijkeUren, 0) /
      matchedHist.length;
    baseHours = Math.round(avg * 10) / 10;
    refs = matchedHist.map((m) => `${m.titel} (${m.werkelijkeUren}u)`);
  } else {
    if (categorie === 'Data Koppeling & ETL') {
      baseHours = 14;
      risico = 'Hoog';
    } else if (categorie === 'Complexe Metric / DAX / SQL') {
      baseHours = 11;
      risico = 'Gemiddeld';
    } else if (categorie === 'Nieuwe Dashboard Pagina') {
      baseHours = 7;
      risico = 'Laag';
    } else if (categorie === 'Autorisatie & RLS') {
      baseHours = 8;
      risico = 'Gemiddeld';
    } else if (categorie === 'Automatisering & Export') {
      baseHours = 9;
      risico = 'Laag';
    } else {
      baseHours = 6;
      risico = 'Laag';
    }
  }

  const taken = [
    {
      fase: 'Analyse & Afkadering',
      omschrijving: 'Specificatie van databronnen en validatie van de klantwens',
      uren: Math.round(baseHours * 0.25 * 10) / 10
    },
    {
      fase: 'Technische Realisatie & Datamodel',
      omschrijving: `Ontwikkeling van ${categorie.toLowerCase()} componenten`,
      uren: Math.round(baseHours * 0.5 * 10) / 10
    },
    {
      fase: 'Visualisatie, Testen & Oplevering',
      omschrijving: 'Reconciliatie van cijfers en integratie in live dashboard',
      uren: Math.round(baseHours * 0.25 * 10) / 10
    }
  ];

  return {
    geschatteUren: baseHours,
    urenMin: Math.max(2, Math.round(baseHours * 0.8)),
    urenMax: Math.round(baseHours * 1.3),
    onderbouwing: `Naar aanleiding van de vraag "${klantVraag.slice(0, 60)}..." is deze scopeaanpassing vergeleken met historische opleveringen. Het vereist extra werkzaamheden in de datalaag en rapportagelaag die buiten de originele offerte vallen.`,
    takenUitsplitsing: taken,
    relevanteHistorischeReferenties:
      refs.length > 0 ? refs : ['Standaard benchmark voor ' + categorie],
    risicoFactor: risico,
    doorlooptijdDagen: Math.max(2, Math.ceil(baseHours / 3)),
    geadviseerdeKlantTekst: `Beste klant, om aan jullie wens te kunnen voldoen breiden we het dashboard graag uit met deze functionaliteit. Omdat dit buiten de overeengekomen scope valt, hebben we een gerichte ureninschatting gemaakt op basis van historische opleveringen. Zodra we jullie akkoord ontvangen, plannen we dit direct in.`
  };
}
