# Journal de formation — Migration Angular 16 → 18

> Ce fichier est mis à jour au fil de la formation.
> Il servira de base pour générer un guide step-by-step à destination des apprenants en fin de formation.

---

## rôle

Tu es expert senior sur Angular jusqu'à la verion 21,expert sénior sur vitest, playwright écrite des tests unitaires, tests d'intégration et tests e2e.

## Contexte général

- **Durée** : 3 jours
- **Public** : Développeurs fullstack professionnels, en production sur Angular 16
- **Point de départ** : Mini-CRM Angular 16 (standalone components, Bootstrap 5, zone.js, Karma/Jasmine)
- **Point d'arrivée** : Angular 18 + Signals + Zoneless experimental + Vitest + Playwright
- **Application support** : Mini-CRM (feature-companies, feature-contacts, core, feature-auth)

---

## Jour 1 — Matin

### 1. Prise en main de l'application de départ

**Ce qui a été fait :**
- Téléchargement et installation du projet Angular 16 (`npm install`, `ng serve`)
- Parcours de l'architecture feature-based : `feature-companies`, `feature-contacts`, `feature-auth`, `core`
- Lecture des fichiers clés : `app.config.ts`, `app.routes.ts`, `app.component.ts`
- Identification des patterns utilisés : standalone components, lazy loading avec `loadComponent` / `loadChildren`, intercepteurs HTTP class-based, guards class-based
- Revue des modèles de données (`Company`, `Contact`) et des services (`CompanyService`, `ContactService`, `AuthService`)
- Revue du pattern smart/dumb : pages (smart) vs components (dumb, `@Input` / `@Output`)
- Injection de dépendances via le constructeur (pattern Angular 16 classique)

**Points clés à retenir pour le guide :**
- L'architecture feature-based isole chaque domaine métier : un service par feature, des routes lazy-loadées par feature
- Les intercepteurs HTTP gèrent l'ajout du token JWT (`AuthInterceptor`) et la déconnexion automatique sur 401 (`ErrorInterceptor`)
- Les guards protègent les routes : `AuthGuard` (accès réservé aux utilisateurs connectés), `PublicGuard` (redirige vers `/companies` si déjà connecté)

---

### 2. Rappels sur les SPA (Single Page Application)

**Ce qui a été abordé :**
- Différence entre MPA (Multi-Page Application) et SPA
- Dans une SPA : une seule requête HTML initiale, le routing est côté client (Angular Router)
- Le navigateur ne rechargera jamais la page lors de la navigation — c'est Angular qui manipule le DOM
- Conséquence sur le bundle initial : tout le framework + le code applicatif doit être chargé au premier accès
- Stratégies pour réduire le bundle : lazy loading des routes, tree-shaking
- Discussion sur l'impact du lazy loading dans l'application support (chaque feature est chargée à la demande)

---

### 3. Zone.js — Fonctionnement et rôle dans Angular

**Ce qui a été abordé :**
- Zone.js est un patcher de l'environnement JavaScript : il surcharge `setTimeout`, `setInterval`, les événements du DOM, les Promises, XHR/fetch
- Objectif : détecter quand une opération asynchrone se termine pour déclencher la détection de changements
- Angular utilise une zone spécifique (`NgZone`) pour savoir quand "quelque chose s'est passé" dans l'application
- Tout callback asynchrone qui se termine dans la NgZone déclenche un cycle de change detection
- Zone.js est chargé dans `polyfills` (visible dans `angular.json`)
- Inconvénient : Zone.js patche tout, même les opérations qui ne modifient pas l'état Angular → cycles inutiles
- C'est la raison pour laquelle Angular travaille sur le mode Zoneless (Angular 18 experimental)

**Points clés à retenir pour le guide :**
- Zone.js = filet de sécurité qui déclenche la change detection automatiquement
- Le mode Zoneless supprime ce filet : on doit gérer explicitement les notifications de changement → c'est là qu'interviennent les Signals

---

### 4. Lifecycle hooks Angular

**Ce qui a été abordé :**
- Ordre d'exécution des hooks : `ngOnChanges` → `ngOnInit` → `ngDoCheck` → `ngAfterContentInit` → `ngAfterContentChecked` → `ngAfterViewInit` → `ngAfterViewChecked` → `ngOnDestroy`
- `ngOnChanges` : déclenché à chaque changement de valeur d'un `@Input()` — reçoit un objet `SimpleChanges`
- `ngOnInit` : déclenché une seule fois après l'initialisation des inputs — idéal pour les appels HTTP initiaux
- `ngOnDestroy` : nettoyage (désabonnement des Observables, clearTimeout, etc.)
- Démonstration sur `TableCompaniesComponent` : différence entre ce qui est disponible dans `ngOnChanges` vs `ngOnInit`
- Attention : dans un composant dumb, `ngOnInit` reçoit les `@Input()` mais ils peuvent changer après → `ngOnChanges` est nécessaire pour réagir aux changements ultérieurs (ex. : `FormCompanyComponent` qui recharge les données en mode édition)

---

### 5. Change Detection — Default vs OnPush

**Ce qui a été abordé :**

**Mode Default (point de départ de l'application) :**
- À chaque événement capturé par Zone.js, Angular parcourt l'arbre de composants de la racine vers les feuilles
- Chaque composant est vérifié, même s'il n'a pas changé
- Simple à comprendre, mais coûteux sur les grandes applications

**Mode OnPush :**
- Angular ne vérifie un composant que si :
  1. Une référence d'`@Input()` a changé (référence objet, pas valeur profonde)
  2. Un événement a été déclenché depuis ce composant ou l'un de ses enfants
  3. Un Observable a émis via `async` pipe
  4. `markForCheck()` a été appelé manuellement
- Avantage : Angular peut "court-circuiter" des sous-arbres entiers du DOM lors du cycle de detection
- Piège classique : muter un objet (`this.companies.push(...)`) ne change pas la référence → le composant OnPush ne se met pas à jour. Il faut créer un nouveau tableau (`[...this.companies, newItem]`)
- Point de départ de la migration : tous les composants passent en `OnPush` lors des ng update

---

### 6. Questions et échanges — Observables vs Signals / Bundle initial

**Questions posées :**
- *Pourquoi garder les Observables si les Signals arrivent ?*
  - Les Observables restent pertinents pour les flux de données asynchrones complexes (WebSocket, combineLatest, debounceTime, etc.)
  - Les Signals gèrent l'état synchrone local du composant
  - Angular fournit `toSignal()` et `toObservable()` pour la transition entre les deux mondes
  - Les deux coexistent en Angular 18 — ce n'est pas un remplacement total

- *Impact des Signals sur le bundle initial ?*
  - Signals font partie du core Angular (`@angular/core`) — pas de dépendance externe ajoutée
  - Le vrai gain sur le bundle vient du mode Zoneless : Zone.js (~50kb minifié) est supprimé
  - Le lazy loading reste la principale stratégie de réduction du bundle initial

---

### 7. Vitest et Playwright — Présentation théorique

**Ce qui a été abordé (théorie uniquement, pas de pratique) :**

**Vitest :**
- Remplaçant de Karma/Jasmine dans l'écosystème Angular moderne
- Avantages : plus rapide (pas de navigateur réel), compatible Jest API, watch mode natif, couverture de code intégrée
- La migration se fait après les `ng update` (16 → 17 → 18)
- Les tests existants (syntaxe `describe`/`it`/`expect`) restent compatibles avec très peu de modifications

**Playwright :**
- Tests End-to-End : simule un vrai navigateur (Chromium, Firefox, WebKit)
- Page Object Model (POM) pour organiser les tests
- Avantages vs Cypress : multi-navigateurs, isolation par défaut, auto-wait sur les éléments
- S'installe après Vitest, dans un dossier `e2e/` dédié
- Sélecteurs préférés : `role` et `data-testid` (résistants aux refactors)

**Positionnement dans la formation :**
- Ces deux outils seront installés et pratiqués après les `ng update`
- Le MCP Playwright sera configuré dans `.claude/settings.json` à ce moment-là

---

## Jour 1 — Après-midi

### 8. Migration Angular 16 → 17 → 18 avec `ng update`

**Outil de référence :**
Angular fournit un guide interactif officiel pour préparer chaque migration : [https://angular.dev/update-guide](https://angular.dev/update-guide)
Il permet de sélectionner la version de départ et d'arrivée, et génère une checklist personnalisée des étapes à suivre (breaking changes, schémas de migration automatiques, actions manuelles).

**Ce qui a été fait :**

Étape 1 — Migration 16 → 17 :
```bash
ng update @angular/core@17 @angular/cli@17
```
- Le CLI applique automatiquement les schematics de migration (imports, syntaxe dépréciée, etc.)
- Vérification que l'application compile et démarre correctement après la mise à jour

Étape 2 — Migration 17 → 18 :
```bash
ng update @angular/core@18 @angular/cli@18
```
- Même processus : schematics automatiques + vérification manuelle
- L'application est maintenant sur Angular 18 — **début de la Phase 2**

**Points clés à retenir pour le guide :**
- Toujours migrer version par version (16→17 puis 17→18), jamais en saut direct — les schematics de migration ne couvrent qu'un pas à la fois
- Committer entre chaque `ng update` pour pouvoir revenir en arrière si nécessaire
- Les schematics automatiques règlent la majorité des breaking changes ; le guide interactif liste ce qui reste à faire manuellement
- Après `ng update`, lancer `ng serve` et vérifier la console navigateur : aucun warning Angular ne doit subsister sans explication

*(à compléter)*

---

## Jour 2

*(à compléter)*

---

## Jour 3

*(à compléter)*

---

## Récapitulatif des concepts clés (mis à jour en continu)

| Concept | Jour | Statut |
|---|---|---|
| Architecture feature-based Angular 16 | J1 matin | ✅ Abordé |
| SPA et routing côté client | J1 matin | ✅ Abordé |
| Zone.js et NgZone | J1 matin | ✅ Abordé |
| Lifecycle hooks | J1 matin | ✅ Abordé |
| Change Detection Default vs OnPush | J1 matin | ✅ Abordé |
| Observables vs Signals | J1 matin | ✅ Abordé (théorie) |
| Vitest | J1 matin | ✅ Abordé (théorie) |
| Playwright | J1 matin | ✅ Abordé (théorie) |
| `ng update` 16 → 17 | J1 après-midi | ✅ Effectué |
| `ng update` 17 → 18 | J1 après-midi | ✅ Effectué |
| Migration Karma → Vitest | — | ⏳ À venir |
| Installation Playwright | — | ⏳ À venir |
| ChangeDetectionStrategy.OnPush | — | ⏳ À venir |
| Zoneless experimental | — | ⏳ À venir |
| Signals : `signal()`, `computed()`, `effect()` | — | ⏳ À venir |
| `toSignal()` / `toObservable()` | — | ⏳ À venir |
| `inject()` à la place du constructeur | — | ⏳ À venir |
| `@if` / `@for` nouvelle syntaxe | — | ⏳ À venir |
| `input()` / `output()` signals-based | — | ⏳ À venir |
