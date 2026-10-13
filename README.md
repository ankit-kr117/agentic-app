# CheckPoint

Track missions (projects), crafts (skills) and journeys (learning). Work in timed sessions, then save a checkpoint with a few reflection questions. Every item gets a timeline and a mini calendar.

**Status:** Phase 01 (UI foundation). Data is saved in your browser only (localStorage). It is a prototype and does not sync across devices.

## Run it

You need [Node.js](https://nodejs.org) (LTS). In this folder:

```
npm install      # downloads the libraries listed in package.json
npm run dev      # starts the app, then open the address it prints (usually http://localhost:5173)
```

Other commands:

```
npm test         # logic tests (dates, timer, timeline, storage)
npm run lint     # code style checks
npm run build    # type check + production build
```

## Where to change things

| I want to... | Edit |
|---|---|
| Rename Missions / Crafts / Journeys | `src/config/kinds.ts` |
| Change the checkpoint questions | `src/config/questions.ts` |
| Change colors or fonts | `src/index.css` (the `@theme` block) |
| Add a new section on the item page | replace a `ReservedSlot` in `src/pages/ItemPage.tsx` |
| Change how days and NULL days are worked out | `src/lib/timeline.ts` |

## Folder map

```
src/
  config/      names and questions
  lib/         date, timer, timeline and storage logic (+ tests)
  store/       the shared data (items) and its actions
  components/  reusable pieces (modal, layout)
  features/    items, sessions (timer + checkpoint form), timeline (list + calendar)
  pages/       Dashboard, Item, Not found
```
