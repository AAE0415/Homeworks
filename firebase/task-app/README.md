# Task App con Firebase (Reto 07)

React + Vite + TypeScript · Firebase Auth + Firestore · React Router 6 · React-Bootstrap + SASS

## Puesta en marcha
1. `npm install`
2. En https://console.firebase.google.com crea un proyecto y activa:
   - **Authentication → Email/Password**
   - **Firestore Database** (modo de prueba para desarrollar)
3. Registra una app web, copia la configuración y crea un `.env` a partir de `.env.example`.
4. `npm run dev`

## Reglas de Firestore recomendadas
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }
  }
}
```

## Estructura
- `src/firebase/config.ts` — inicialización de Firebase (auth y db)
- `src/hooks/useFirebaseAuth.ts` — login, registro, logout y sesión
- `src/hooks/useCollection.ts` — CRUD genérico de Firestore (getAll con filtros, add, update, remove)
- `src/context/AuthContext.tsx` — contexto de autenticación
- `src/context/TasksContext.tsx` — contexto de tareas (usa `useCollection`)
- `src/components/RouteGuards.tsx` — rutas privadas y públicas
- `src/pages/` — Login, Register, Tasks, NotFound
- `src/styles/` — SASS (variables, mixins, estilos)
