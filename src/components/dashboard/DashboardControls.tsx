import React from 'react';
import { Filter, Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

interface FilterButtonProps {
  label?: string;
  onClick?: () => void;
}

export const dashboardToolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '40px',
};

export const SearchBar = ({ value, onChange, placeholder = 'Search' }: SearchBarProps) => (
  <div style={{ position: 'relative', width: '100%', maxWidth: '420px', minWidth: '260px' }}>
    <Search
      size={16}
      style={{
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#6b7280',
        pointerEvents: 'none',
      }}
    />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        height: '44px',
        paddingLeft: '44px',
        paddingRight: '18px',
        fontSize: '13px',
        color: '#111827',
        caretColor: '#111827',
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '9999px',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
    />
  </div>
);

export const FilterButton = ({ label = 'Filter', onClick }: FilterButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      minWidth: '108px',
      height: '44px',
      padding: '0 22px',
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '9999px',
      fontSize: '13px',
      fontWeight: 500,
      color: '#111827',
      cursor: 'pointer',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
    }}
  >
    <Filter size={15} />
    {label}
  </button>
);
