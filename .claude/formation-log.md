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

### 9. Panorama des nouveautés Angular 18 vs Angular 16

Vue d'ensemble des changements à traiter un par un sur l'application support.

#### 9.1 Nouvelle syntaxe de template (`@if`, `@for`, `@switch`)

| Avant Angular 16 | Après Angular 17+ |
|---|---|
| `*ngIf="condition"` | `@if (condition) { }` |
| `*ngFor="let x of list"` | `@for (x of list; track x.id) { }` |
| `*ngSwitch` | `@switch / @case / @default` |

- `@for` rend le `track` obligatoire — améliore les performances de rendu de liste
- Préférer `track item.id` (identifiant métier stable) plutôt que `track $index` ou `track item` (référence objet) — le schematic génère `track item` par défaut, à corriger manuellement
- `@empty` remplace le pattern `@if (collection.length === 0)` à l'intérieur d'un `@for` — plus lisible et co-localisé avec la boucle
- Plus besoin d'importer `NgIf`, `NgFor`, `NgSwitch` dans le composant

```html
<!-- Pattern Angular 16 -->
<tr *ngFor="let company of companies">...</tr>
<tr *ngIf="companies.length === 0"><td>Aucune entreprise</td></tr>

<!-- Pattern Angular 18 — @empty intégré au @for -->
@for (company of companies; track company.id) {
  <tr>...</tr>
} @empty {
  <tr><td>Aucune entreprise</td></tr>
}
```

**Appliqué sur :** `table-companies.component.html`, `table-contacts.component.html`

#### 9.2 Signals

```typescript
// Angular 16 : pas de Signals
companies: Company[] = [];

// Angular 18
companies = signal<Company[]>([]);
filteredCount = computed(() => this.companies().filter(c => c.actif).length);
```

| API | Description |
|---|---|
| `signal()` | État réactif local |
| `computed()` | Valeur dérivée, recalculée automatiquement |
| `effect()` | Effet de bord déclenché sur changement |
| `toSignal()` | Convertit un Observable en Signal |
| `toObservable()` | Convertit un Signal en Observable |

#### 9.3 Inputs/Outputs signals-based

```typescript
// Angular 16
@Input() company!: Company;
@Output() deleted = new EventEmitter<number>();

// Angular 18
company = input.required<Company>();
deleted = output<number>();
```

- `input()` remplace `@Input()` + `ngOnChanges` → réactif nativement
- `model()` pour le two-way binding signals-based

#### 9.4 `inject()` à la place du constructeur

```typescript
// Angular 16
constructor(private companyService: CompanyService) {}

// Angular 18
private companyService = inject(CompanyService);
```

- Utilisable en dehors du constructeur (fonctions utilitaires, guards fonctionnels)
- **`inject()` devient obligatoire** dès qu'on utilise les patterns fonctionnels d'Angular 18 :

| Pattern | Pourquoi `inject()` est obligatoire |
|---|---|
| Functional guards | Fonction pure, pas de classe → pas de constructeur |
| Functional interceptors | Idem — `HttpInterceptorFn` est une simple fonction |
| Functional resolvers | Idem — `ResolveFn<T>` est une simple fonction |

```typescript
// Functional guard — inject() seul possible
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);  // pas d'autre option
  const router = inject(Router);
  return authService.isAuthenticated() ? true : router.parseUrl('/auth');
};

// Functional interceptor — inject() seul possible
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(authReq);
};

// Functional resolver — inject() seul possible
export const companyResolver: ResolveFn<Company> = (route) => {
  const companyService = inject(CompanyService);
  return companyService.getCompanyById(Number(route.paramMap.get('id')));
};
```

**Point pédagogique clé :** la migration vers `inject()` dans les composants/services est un choix de style ; dans les guards, interceptors et resolvers fonctionnels, c'est une **contrainte technique** — il n'y a pas de constructeur dans une fonction.

#### 9.5 Guards et intercepteurs fonctionnels

**Doc officielle :** [https://angular.dev/guide/routing/common-router-tasks](https://angular.dev/guide/routing/common-router-tasks)

En Angular 15+, les guards et intercepteurs peuvent être de simples fonctions. En Angular 18, c'est le pattern recommandé.

```typescript
// Angular 16 : class-based
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}

// Angular 18 : fonctionnel
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? true : router.parseUrl('/auth');
};
```

**Tous les types de guards fonctionnels :**

---

**`CanActivateFn`** — Protège l'accès à une route

Cas d'usage : route réservée aux utilisateurs connectés.

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? true : router.parseUrl('/auth');
};

// app.routes.ts
{ path: 'companies', canActivate: [authGuard], loadComponent: ... }
```

---

**`CanActivateChildFn`** — Protège toutes les routes enfants d'une route parente

Cas d'usage : toute la section `/admin` réservée aux administrateurs — une seule déclaration protège toutes les sous-routes.

```typescript
// admin.guard.ts
export const adminGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAdmin() ? true : router.parseUrl('/companies');
};

// app.routes.ts
{
  path: 'admin',
  canActivateChild: [adminGuard],
  children: [
    { path: 'users', loadComponent: () => import('./pages/users') },
    { path: 'stats', loadComponent: () => import('./pages/stats') },
  ]
}
```

---

**`CanDeactivateFn`** — Protège la sortie d'une route

Cas d'usage : confirmation avant de quitter un formulaire avec des modifications non sauvegardées.

```typescript
// unsaved-changes.guard.ts
export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (!component.hasUnsavedChanges()) return true;
  return confirm('Des modifications non sauvegardées seront perdues. Quitter quand même ?');
};

// form-company.component.ts — le composant implémente l'interface
export class FormCompanyComponent implements HasUnsavedChanges {
  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }
}

// app.routes.ts
{ path: 'companies/edit/:id', canDeactivate: [unsavedChangesGuard], loadComponent: ... }
```

---

**`CanMatchFn`** — Détermine si une route peut être matchée (remplace `CanLoad` depuis Angular 15)

Cas d'usage : charger un module lazy uniquement si l'utilisateur a le bon rôle — si le guard retourne `false`, Angular essaie la route suivante dans la config.

```typescript
// role.guard.ts
export const adminMatchGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  return authService.isAdmin();
};

// app.routes.ts — deux routes sur le même path selon le rôle
{ path: 'dashboard', canMatch: [adminMatchGuard], loadComponent: () => import('./admin-dashboard') },
{ path: 'dashboard', loadComponent: () => import('./user-dashboard') },
```

---

**`ResolveFn<T>`** — Précharge des données avant l'activation (pas un guard mais même famille)

Cas d'usage : charger les données d'une entreprise avant d'afficher la page de détail — évite un état `null` dans le composant.

```typescript
// company.resolver.ts
export const companyResolver: ResolveFn<Company> = (route) => {
  const companyService = inject(CompanyService);
  return companyService.getCompanyById(Number(route.paramMap.get('id')));
};

// app.routes.ts
{
  path: 'companies/:id',
  resolve: { company: companyResolver },
  loadComponent: () => import('./page-detail-company')
}

// page-detail-company.component.ts — données déjà disponibles dans ngOnInit
ngOnInit(): void {
  this.company = this.route.snapshot.data['company'];
}
```

#### 9.6 Zoneless experimental

```typescript
// app.config.ts
providers: [
  provideExperimentalZonelessChangeDetection() // remplace zone.js
]
```

- Zone.js retiré du `polyfills` dans `angular.json`
- La change detection ne se déclenche plus automatiquement — les Signals prennent le relais
- Gain : ~50kb de moins, moins de cycles inutiles

#### 9.7 `ChangeDetectionStrategy.OnPush` — la norme en Angular 18

En mode Zoneless, `OnPush` devient obligatoire sur tous les composants. Sans Zone.js, le mode `Default` ne fonctionne plus correctement.

#### 9.8 Remplacement Karma → Vitest

```typescript
// Angular 16 : karma.conf.js + jasmine
// Angular 18 : vitest.config.ts
import { defineConfig } from 'vitest/config';
```

- Les tests `describe / it / expect` restent compatibles avec très peu de modifications

---

## Jour 2

### 1. Migration guards vers le pattern fonctionnel

**Migration effectuée manuellement** sur `auth.guard.ts` et `public.guard.ts`, en s'appuyant sur la doc officielle Angular : [https://angular.dev/guide/routing/common-router-tasks](https://angular.dev/guide/routing/common-router-tasks)

Il n'existe pas de schematic `ng generate` pour cette migration — contrairement à `@if`/`@for` et `inject()`, elle se fait fichier par fichier à la main. C'est pédagogiquement intéressant car les changements sont lisibles et explicites.

**Changements appliqués :**

- Suppression du décorateur `@Injectable({ providedIn: 'root' })`
- Suppression de l'implémentation d'interface (`implements CanActivate`)
- Remplacement de la classe par une `const` typée (`CanActivateFn`)
- `inject()` utilisé directement dans le corps de la fonction (obligatoire — pas de constructeur)
- `app.routes.ts` mis à jour : les guards sont maintenant passés directement comme fonctions (pas d'instanciation)

```typescript
// Avant — Angular 16 class-based
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean { ... }
}
// app.routes.ts
canActivate: [AuthGuard]  // Angular instancie la classe

// Après — Angular 18 fonctionnel
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? true : router.parseUrl('/auth');
};
// app.routes.ts
canActivate: [authGuard]  // simple référence à la fonction
```

**⚠️ Point de vigilance — `parseUrl()` vs `navigate()` :**
Dans un functional guard, retourner un `UrlTree` (`router.parseUrl('/auth')`) est préférable à `router.navigate()` car Angular gère le redirect de façon synchrone et peut l'annuler si besoin. `router.navigate()` dans un guard peut créer des races conditions.

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
| Panorama nouveautés Angular 18 vs 16 | J1 après-midi | ✅ Abordé |
| **Migration app — `@if` / `@for` nouvelle syntaxe** | J1 après-midi | ✅ Effectué |
| **Migration app — `inject()` à la place du constructeur** | J1 après-midi | ✅ Effectué |
| **Migration app — guards et intercepteurs fonctionnels** | J2 | ✅ Effectué (guards) / ⏳ intercepteurs à venir |
| **Migration app — `ChangeDetectionStrategy.OnPush`** | — | ⏳ À traiter |
| **Migration app — `input()` / `output()` signals-based** | — | ⏳ À traiter |
| **Migration app — Signals : `signal()`, `computed()`, `effect()`** | — | ⏳ À traiter |
| **Migration app — `toSignal()` / `toObservable()`** | — | ⏳ À traiter |
| **Migration app — Zoneless experimental** | — | ⏳ À traiter |
| **Migration tests — Karma → Vitest** | — | ⏳ À traiter |
| **Migration tests — Installation Playwright** | — | ⏳ À traiter |
