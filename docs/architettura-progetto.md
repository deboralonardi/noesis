# Cognitive Cyber Risk Assessment — Architettura di progetto

*Documento di lavoro — sintesi delle decisioni prese finora. Da aggiornare mano a mano.*

---

## Principio guida

> **AI executes the framework, AI does not define the framework.**

Il Cognitive Framework (costrutti, evidence rubric, scoring, mitigation library) è la proprietà intellettuale della tesi. L'AI è il motore conversazionale adattivo che lo applica caso per caso.

**Target utente:** decisori aziendali con responsabilità su cyber risk — CISO, CIO, risk manager, membri di risk committee, CEO quando coinvolti. Non l'operativo IT. Linguaggio, tono e UI devono restare a livello executive/board-ready.

---

## Struttura a due livelli

Per proteggere la solidità metodologica della tesi, il progetto è diviso in due parti esplicitamente separate:

- **CORE** — ciò che viene costruito e dimostrato funzionante, con rigore metodologico difendibile in sede di discussione.
- **VISION** — ciò che viene descritto e mostrato come mockup/architettura, dichiarato esplicitamente come roadmap futura, non come sistema funzionante.

Questa separazione va dichiarata esplicitamente in tesi. Protegge da domande su fattibilità/rigore di parti che non sono (e non devono essere) validate.

---

## CORE — cosa costruiamo davvero

### 1. Positioning / Calibration Assessment
Fase iniziale, unica per ogni utente: pochi scenari base che collocano il decision-maker su un **profilo di partenza**. Non è la banca scenari completa — è una calibrazione grossolana (ispirata al principio CAT: prima stima grezza, poi affinamento).

### 2. Adaptive Assessment Engine (within-session)
Il ciclo che abbiamo già validato con la demo:
`scenario → decisione iniziale → confidence → evidenza contraddittoria → rivalutazione → check evidenza sufficiente → esito`

Logica "AI executes": il modello riceve scenario, risposta e rubric, e restituisce un output strutturato (JSON vincolato) — non giudica liberamente.

### 3. Framework layer (dati, non codice) — DEFINITO

**Fondamento teorico**: i costrutti sono derivati dai capitoli 2.2 e 2.3 della tesi, non da una lista generica. Il capitolo 2.2 tratta un ventaglio più ampio di meccanismi cognitivi (utile come base teorica completa, in parte orientata al livello employee/phishing); il capitolo 2.3 fornisce la giustificazione esplicita della struttura a tre dimensioni e del principio "il bias conta insieme al contesto decisionale e ai safeguard disponibili" — base diretta della logica bias + trigger + control gap.

Non tutti i meccanismi del cap. 2.2 sono stati operazionalizzati: esclusi quelli che richiedono percezione visiva/momento-per-momento (inattentional/change blindness, attentional bias/salience — non adatti a uno scenario narrativo testuale) o esposizione ripetuta nel tempo (habituation, alert fatigue, automation complacency — spostati in VISION, percorso a 12 mesi). Questa selezione va resa esplicita in tesi con una frase che motiva il criterio di scelta, per anticipare la domanda "perché solo questi quattro?".

**I quattro costrutti scelti per l'MVP** (construct → evidence → task):

1. **Anchoring** — *Evidence*: riceve una valutazione iniziale plausibile e, davanti a evidenza materialmente rilevante che la contraddice, non aggiorna adeguatamente il giudizio. *Task*: scenario "Vendor Anomaly" — prima informazione plausibile → evidenza contraddittoria specifica → rivalutazione.
2. **Confirmation bias** — *Evidence*: quando può scegliere quali fonti approfondire, seleziona/pesa preferenzialmente evidenza a conferma dell'ipotesi iniziale, evitando la fonte più diagnostica se disconfermante. *Task*: scenario "Insider Data Access" — ipotesi iniziale → scelta di 2 fonti su 4 (diversamente diagnostiche/orientate) → decisione finale.
3. **Authority bias** *(naming in tesi: "susceptibility to authority cues", termine coerente col testo del cap. 2.2.4 — "authority bias" non è etichetta canonica univoca in letteratura, va giustificato o evitato come label)* — *Evidence*: si adegua o assegna peso sproporzionato a un'indicazione di una figura autorevole che confligge con l'evidenza disponibile, senza richiedere/documentare verifica indipendente. *Task*: scenario "Executive Override" — raccomandazione tecnica → pressione gerarchica senza nuovi elementi tecnici → rivalutazione.
4. **Automation bias** — *Evidence*: accetta/si conforma a un output automatizzato senza verifica ulteriore, anche quando segnali contestuali disponibili suggeriscono cautela (errore di omissione — unico verso testato nell'MVP). *Task*: scenario "Risk Score Override" — score automatico basso → segnale contestuale che il modello non pesa → rivalutazione.

Per ciascuno scenario, la risposta viene letta su **due assi contemporaneamente**: livello di evidenza del bias (strong/moderate/weak-absent) **e** Individual Control Maturity (ha attivato un controllo disponibile: verifica indipendente, escalation, documentazione formale). Le due letture derivano dalla stessa scelta di risposta, senza bisogno di domande separate.

**Limite dichiarato**: un solo scenario per costrutto = un solo punto dati per costrutto. Non costituisce una misura affidabile in senso psicometrico (nessuna stima di stabilità/generalizzabilità del risultato). Nell'MVP è accettabile come proof of concept; in versione matura richiede più forme parallele per costrutto (collegato anche all'effetto apprendimento, vedi criticità sotto).

**Scoring logic**:
- *Vulnerability Profile*: un rating (strong/moderate/weak-absent) per costrutto, mappatura diretta dallo scenario.
- *Decision Criticality*: assegnata a priori nel design dello scenario (non derivata dalle risposte), funziona da peso — una vulnerabilità "strong" in scenario ad alta criticità pesa più della stessa in scenario a bassa criticità. *Nota: nell'MVP tutti e quattro gli scenari sono ad alta criticità, quindi il peso è di fatto costante — il meccanismo è corretto concettualmente ma non produce differenziazione osservabile finché non si aggiungono scenari a criticità più bassa.*
- *Individual Control Maturity* (nome mantenuto per continuità con la scheda originale, ridefinito esplicitamente): misura la tendenza comportamentale individuale ad attivare un safeguard disponibile nello scenario — non un audit dei controlli organizzativi reali, che richiederebbe dati aziendali fuori scope per il CORE. Va accompagnato da una nota di definizione esplicita in tesi.
- *Overall Cognitive Cyber Risk* (categoriale, non numerico — un punteggio tipo "73/100" implicherebbe una precisione psicometrica non validabile in questa fase):
  - HIGH: almeno un costrutto strong + basso control maturity nello stesso scenario
  - ELEVATED: un costrutto strong con control maturity almeno parziale, oppure due o più costrutti moderate
  - MODERATE: evidenza isolata moderate, control maturity complessivamente presente
  - LOW: nessun costrutto strong, prevalenza weak/absent, control maturity costante

**Mitigation library** — mappata su combinazione bias + livello di evidenza + control maturity osservata nello stesso scenario, non sul bias da solo:
- *Anchoring*: strong + basso control → reassessment indipendente obbligatorio su nuova evidenza materiale; strong + control parziale → checkpoint di rivalutazione strutturato con documentazione; moderate → prompt non obbligatorio di rivalutazione.
- *Confirmation bias*: strong → richiedere almeno una fonte disconfermante/ad alta diagnosticità prima di chiudere il caso; moderate → checklist "cosa cambierebbe la mia valutazione?" prima della decisione finale.
- *Authority bias*: strong → protocollo obbligatorio di risk-acceptance documentato per override di raccomandazioni tecniche da stakeholder senior; moderate → rafforzare la prassi di documentazione come escalation formale verso un reviewer indipendente, non solo archivio.
- *Automation bias*: strong (omissione) → seconda review obbligatoria su classificazioni automatiche a basso rischio quando emergono anomalie contestuali; moderate → estendere i parametri del modello al segnale contestuale identificato + sign-off analista su divergenze.
- Principio trasversale: quando Decision Criticality è alta (come nei 4 scenari MVP), anche una mitigazione "moderate" va presentata con priorità comunicativa più alta nella dashboard.

### 4. Dashboard di risultato — individuale
Non è più "fine di un singolo assessment", ma pensata da subito come **prima istantanea** di una serie temporale: overall risk, vulnerability profile, trigger, control gap, mitigazioni — con un layout che regge anche quando in futuro ci saranno più punti dati.

### 5. Landing / pagina di presentazione
Ingresso alla piattaforma prima dell'assessment — presenta il framework al decision-maker (cosa aspettarsi, perché non è un questionario, cosa NON viene misurato — cioè non è una diagnosi psicologica individuale).

---

## VISION — cosa mostriamo come mockup/roadmap, non come sistema reale

### Dashboard longitudinale
Andamento del livello cognitivo nel tempo (sessione per sessione, es. mensile o a cadenza variabile). **Nell'MVP: mockup con dati d'esempio plausibili**, non un motore che orchestra realmente 12 mesi di stato.

### Programma a 12 mesi con adattività tra sessioni
La selezione degli scenari nei cicli successivi dipende dal posizionamento/esito dei cicli precedenti (adattività *tra* assessment, distinta da quella *dentro* un assessment). Cadenza potenzialmente variabile — ma **non legata direttamente al punteggio** (rischio di gaming the metric: punteggio migliore → meno controlli → incentivo a "sembrare" meno vulnerabile). Meglio legarla a criteri più neutri: criticità del ruolo, cambiamenti organizzativi, tempo trascorso.

### Moduli di approfondimento sbloccabili
Ripensati rispetto a "pillole": nome più clinico, coerente col resto del framework — es. **"targeted probes"** o **"follow-up modules"**. Sblocco per rilevanza dell'evidenza emersa, non per logica ludica/gamification (target executive, non junior).

### Stress test
Scenari a intensità aumentata (pressione temporale estrema, ambiguità alta) — presumibilmente uno dei tipi di modulo sbloccabile, non parte della routine base.

### Dashboard aggregata di team/organizzazione
**Aggregazione statistica descrittiva**, esplicitamente NON un secondo framework che misura dinamiche di gruppo (groupthink, autorità, ecc. — quello resta un lavoro concettualmente diverso, fuori scope). Requisiti:
- mai punteggio individuale nominale esposto nella vista aggregata
- soglia minima N persone per mostrare un dato aggregato
- separazione dati individuale (privato) vs aggregato (calcolato lato server) — privacy-by-design da dichiarare in tesi

### Cognitive Decision Check
Già presente nella visione originale: supporto in tempo reale su decisioni vere, non ipotetiche. Requisiti di privacy/data protection molto più stringenti — resta roadmap a lungo termine.

---

## Criticità aperte (da tenere presenti, non ancora risolte)

1. **Effetto apprendimento** — se l'assessment si ripete nel tempo, servono forme parallele (varianti equivalenti per costrutto), altrimenti il punteggio misura "riconoscimento del test" invece di vulnerabilità reale. Un solo scenario per costrutto nell'MVP rende questo un limite dichiarato esplicitamente, non ancora risolto.
2. **Gaming the metric** sulla cadenza adattiva (VISION) — cadenza non va legata direttamente al punteggio.
3. **Coerenza costrutto individuale vs aggregato di team** (VISION) — l'aggregazione descrittiva è ok, ma va sempre presentata come tale e non come "punteggio di team validato".
4. **Naming dei moduli sbloccabili** (VISION) — ancora da fissare in modo definitivo, coerente col registro clinico/executive del resto del prodotto.
5. **Decision Criticality come peso costante nell'MVP** — tutti e quattro gli scenari sono ad alta criticità per design, quindi il meccanismo di pesatura non è osservabile finché non si aggiungono scenari a criticità più bassa (fuori scope MVP).
6. **Desiderabilità sociale nello scenario Authority bias** — rischio che l'opzione "corretta" (mantenere la posizione tecnica) sia scelta per apparire competenti più che per comportamento reale davanti alla pressione. Da tenere presente in fase di test/validazione dello scenario.

---

## Framework — stato: DEFINITO (costrutti, scenari, scoring, mitigazioni)

## Decisioni tecniche finali per l'MVP (pre-handoff a Claude Code)

**Motore di scoring — regole fisse, NON AI-adattivo**: dopo valutazione esplicita, si è deciso di **non** integrare un vero motore basato su un modello linguistico per l'MVP. Motivazione: tutti e quattro gli scenari attuali sono a scelta multipla/slider/selezione fonti — nessuna risposta aperta in linguaggio naturale da interpretare. Le evidence rule sono già condizioni deterministiche su scelte discrete, quindi un LLM non aggiungerebbe capacità reale, solo variabilità indesiderata (un problema per un prototipo che già dichiara il limite di affidabilità psicometrica) e complessità infrastrutturale (una API key non è proteggibile in un sito statico senza backend). **Implicazione pratica**: nessuna API key, nessun costo a consumo, nessun backend necessario — l'intera logica gira lato client in JavaScript.

Questo NON preclude l'estensione futura: se in una versione successiva si introducono scenari con risposte aperte, un motore AI-interpretativo avrebbe finalmente un lavoro reale da fare (interpretare testo libero contro una rubric) — da presentare come roadmap futura, stesso trattamento di longitudinal tracking e aggregazione di team.

**Hosting — Netlify, sito statico**: l'app è un sito statico (HTML/CSS/JS, nessun database, nessuna funzione serverless necessaria per il CORE). Il piano gratuito di Netlify è sufficiente.

**Separazione account — importante**: l'abbonamento Claude Code usato per lo sviluppo (account Debora) non ha alcun legame di proprietà con il prodotto pubblicato. La proprietà del sito dipende esclusivamente da quale account viene autenticato al momento del deploy su Netlify. Per attribuire il prodotto a Noemi: sviluppare pure con Claude Code (account Debora), ma al momento del comando di deploy autenticarsi su Netlify con le credenziali di Noemi (piano gratuito, sufficiente per questo progetto). Occhio a eventuali sessioni Netlify già attive nel browser che potrebbero interferire con il login corretto.

## Prossimi passi possibili

- [x] Definire i 4 costrutti/bias con evidence rule (construct → evidence → task)
- [x] Scrivere per intero i 4 scenari completi
- [x] Fissare la scoring logic in dettaglio
- [x] Disegnare la mitigation library (many-to-many, libreria di interventi)
- [x] Costruire demo HTML completa e realistica (noesis-demo-v5.html — versione definitiva)
- [x] Decidere motore scoring (regole fisse, no AI) e hosting (Netlify, account Noemi)
- [ ] Handoff a Claude Code per l'MVP funzionante e il deploy
