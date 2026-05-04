import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = 'Search' }: Props) => (
  <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
    <Search
      size={17}
      style={{
        position: 'absolute', left: '18px', top: '50%',
        transform: 'translateY(-50%)', color: '#c0c8d4', pointerEvents: 'none',
      }}
    />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%', paddingLeft: '48px', paddingRight: '20px',
        paddingTop: '14px', paddingBottom: '14px',
        fontSize: '14px', color: '#111827',
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '9999px',
        outline: 'none', boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
    />
  </div>
);