'use client'
import { useState, useEffect, useCallback } from 'react';
import { COLORS, str } from './utils';

export function useData() {
  const [evals, setEvals]   = useState([]);
  const [ramos, setRamos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [synced, setSynced] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch('/api/datos');
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      const ramoList = (json.ramos || [])
        .map(r => str(r))
        .filter(r => r.length > 0)
        .map((name, i) => ({ name, color: COLORS[i % COLORS.length] }));

      const ramoNames = new Set(ramoList.map(r => r.name));

      const evalList = (json.evals || []).map(e => ({
        ramo:  str(e.ramo),
        tipo:  str(e.tipo),
        fecha: e.fecha ? new Date(e.fecha + 'T12:00:00') : null,
        cont:  str(e.contenidos),
        peso:  str(e.peso),
      })).filter(e => e.ramo && e.fecha && !isNaN(e.fecha));

      evalList.forEach(e => {
        if (e.ramo && !ramoNames.has(e.ramo)) {
          ramoList.push({ name: e.ramo, color: COLORS[ramoList.length % COLORS.length] });
          ramoNames.add(e.ramo);
        }
      });

      setRamos(ramoList);
      setEvals(evalList);
      setSynced(new Date());
    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const rColor = (name) => {
    const r = ramos.find(r => r.name === name);
    return r ? r.color : '#888';
  };

  return { evals, ramos, loading, error, synced, reload: load, rColor };
}