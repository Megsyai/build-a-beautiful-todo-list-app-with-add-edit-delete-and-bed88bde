import { useState, useEffect } from 'react';

export function useCollection<T extends { id: string }>(name: string) {
  const [data, setData] = useState<T[]>(() => {
    const saved = localStorage.getItem(`db_${name}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(`db_${name}`, JSON.stringify(data));
  }, [name, data]);

  const insert = (item: T) => setData(prev => [item, ...prev]);
  const update = (id: string, updates: Partial<T>) => 
    setData(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  const remove = (id: string) => setData(prev => prev.filter(item => item.id !== id));
  const list = () => data;

  return { data, insert, update, remove, list };
}
