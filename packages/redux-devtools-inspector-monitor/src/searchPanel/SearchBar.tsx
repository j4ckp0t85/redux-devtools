import { Interpolation, Theme } from '@emotion/react';
import React, { ReactElement } from 'react';
import { StylingFunction } from 'react-base16-styling';

export interface SearchBarProps {
  onChange: (s: string) => void;
  text: string;
  className?: string;
}

const searchInput: Interpolation<Theme> = (theme) => ({
	'background-color': 'white',
	 opacity: 0.9,
	'border-color': 'transparent',
	'border-radius': '4px',
	 height: '1.2rem',
});

function SearchBar({
  onChange,
  text,
  className,
}: SearchBarProps): ReactElement {
  return (
    <div className={`search-bar ${className || ''}`}>
      <input
        css={searchInput}
        placeholder={'Search'}
        value={text}
        type={'text'}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;