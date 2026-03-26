# Traveller's Notebook Valley Edition - Frontend ✈️📓  
# [Link al sito](https://travelers-notebook-valley-frontend.vercel.app/) :woman_technologist:
# [Backend](https://github.com/Elisa-Ra/travelers-notebook-valley-backend


Interfaccia utente dell’applicazione **Traveller's Notebook Valley Edition**, un diario di viaggio digitale.

Questo repository contiene il frontend sviluppato in **React + Vite**, il design responsive è ispirato ad un taccuino di viaggio, con tanto di pagine sfogliabili. 

---

## 🚀 Tecnologie utilizzate

- **React**
- **Vite**
- **React Bootstrap**
- **React Router**
- **HTMLFlipBook** (per l'effetto diario sfogliabile)
- **html2canvas e jspdf** per permettere all'utente di scaricare il PDF del proprio diario
- **Recharts** per i grafici informativi nel backoffice
- **React icons**
- **Fetch API** per comunicare con il backend
- **Vercel** per il deploy

---

## Funzionalità principali:
**Senza registrazione al sito, l'utente può:**
- :european_castle: Leggere informazioni culturali riguardanti i punti di interesse, curate dagli admin.
- I punti di interesse mostrati si dividono in __categorie__ (monumento, museo, evento, ecc...)


**Con registrazione al sito, l'utente può:**

### :ok_person: Profilo 
- Gestire il suo profilo
- Visualizzare le medaglie/adesivi* ottenute
- Aprire il suo diario
* Per la coerenza visiva del sito, le medaglia sono pensate come a degli adesivi che l'utente colleziona nel suo diario.

### :green_book: Diario di viaggio
- Creare il suo diario di viaggio personale
- Visualizzazione delle pagine in un diario sfogliabile
 Creazione di nuove pagine con:
  - titolo
  - contenuto
  - monumento associato
  - foto opzionale
- Modifica e cancellazione delle pagine
- **Download** del diario in PDF :printer:


### :medal_sports: Ottenere Medaglie/Adesivi
- L'utente può ottenere medaglie scrivendo dei post collegati ai monumenti.
- (Es. Scrivendo il primo post del diario riguardante il Tempio della Concordia, l'utente otterrà la Medaglia della Concordia)


## :computer: BackOffice per l'admin:
- Gestione (CRUD) __Categorie__ (Es. Museo, Monumento, Evento, ecc...)
- Gestione __Monumenti__/punti di interesse
- Gestione __Medaglie__ (In questo modo l'admin può sfruttare la gamification per invogliare l'utente in real life a visitare determinati monumenti/eventi)
- Grafico che mostra la popolarità dei monumenti (in base a quanti post sono stati scritti per quel monumento)
---


### :information_source: COME AVVIARE IL PROGETTO IN LOCALE:
**Clona il repository:**
git clone https://github.com/Elisa-Ra/travelers-notebook-valley-frontend
cd travelers-notebook-valley-frontend

**Installa le dipendenze:**
npm install
**Avvia:**
npm run dev

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
