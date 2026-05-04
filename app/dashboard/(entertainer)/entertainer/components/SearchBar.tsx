import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = 'Search' }: Props) => (
  <div style={{ position: 'relative', width: '300px' }}>
    <Search
      size={15}
      style={{
        position: 'absolute', left: '16px', top: '50%',
        transform: 'translateY(-50%)', color: '#c0c8d4', pointerEvents: 'none',
      }}
    />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        paddingLeft: '42px',
        paddingRight: '16px',
        paddingTop: '11px',
        paddingBottom: '11px',
        fontSize: '13px',
        color: '#111827',
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