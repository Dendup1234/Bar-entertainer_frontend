"use client";
import React, { useState, useEffect } from 'react';
import { EntertainerCard } from './components/EntertainerCard';
import { EntertainerDetailModal } from './components/EntertainerDetailModal';
import { SearchBar } from './components/SearchBar';
import { barService } from '@/features/home/services/barServices';
import { Loader2 } from 'lucide-react';

export default function BarDashboard() {
  const [entertainers, setEntertainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchEntertainers(); }, []);

  const fetchEntertainers = async (query?: string) => {
    setLoading(true);
    try {
      const data = query
        ? await barService.searchEntertainers(query)
        : await barService.getAllEntertainers();
      setEntertainers(data.entertainers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    fetchEntertainers(value);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 48px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Search */}
        <div style={{ marginBottom: '40px' }}>
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search entertainers by name or genre"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader2
              size={36}
              className="animate-spin"
              style={{ color: '#e5e7eb' }}
            />
          </div>
        ) : entertainers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>No entertainers found</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            alignItems: 'stretch',
            gap: '32px',
          }}>
            {entertainers.map((ent: any) => (
              <div
                key={ent._id}
                onClick={() => setSelectedId(ent._id)}
                style={{ cursor: 'pointer', height: '100%' }}
              >
                <EntertainerCard {...ent} />
              </div>
            ))}
          </div>
        )}

      </div>

      <EntertainerDetailModal
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
        entertainerId={selectedId}
      />
    </div>
  );
}
