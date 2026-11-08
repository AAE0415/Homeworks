import { useCallback } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  type WhereFilterOp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

/** [campo, operador, valor] — ej: ['uid', '==', 'abc123'] */
export type Filter = [string, WhereFilterOp, unknown];

/** CRUD genérico para cualquier colección de Firestore. */
export const useCollection = <T extends { id: string }>(collectionName: string) => {
  const getAll = useCallback(
    async (filters: Filter[] = []): Promise<T[]> => {
      const constraints = filters.map(([field, op, value]) => where(field, op, value));
      const snapshot = await getDocs(query(collection(db, collectionName), ...constraints));
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
    },
    [collectionName]
  );

  const add = useCallback(
    async (data: Omit<T, 'id'>): Promise<string> => {
      const ref = await addDoc(collection(db, collectionName), data);
      return ref.id;
    },
    [collectionName]
  );

  const update = useCallback(
    async (id: string, data: Partial<Omit<T, 'id'>>) => {
      await updateDoc(doc(db, collectionName, id), data as Record<string, unknown>);
    },
    [collectionName]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteDoc(doc(db, collectionName, id));
    },
    [collectionName]
  );

  return { getAll, add, update, remove };
};
