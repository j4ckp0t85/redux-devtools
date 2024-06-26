import React, { ReactElement, useEffect, useState } from 'react';
import { Value, searchInObject } from '../utils/objectSearch';
import JumpSearchResultButton, {
  BUTTON_DIRECTION,
} from './JumpSearchResultButton';
import SearchBar from './SearchBar';
import { Interpolation, Theme } from '@emotion/react';

export interface SearchQuery {
  queryText: string;
  location: {
    keys: boolean;
    values: boolean;
  };
}

const INITIAL_QUERY: SearchQuery = {
  queryText: '',
  location: {
    keys: true,
    values: true,
  },
};

export interface SearchPanelProps {
  state: Value;
  onSubmit: (result: {
    searchResult: string[];
    searchInProgress: boolean;
  }) => void;
  onReset: () => void;
}

type SearchStatus = 'done' | 'pending' | 'unset';

function SearchPanel({
  onSubmit,
  onReset,
  state,
}: SearchPanelProps): ReactElement {
  const [query, setQuery] = useState<SearchQuery>(INITIAL_QUERY);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('unset');
  const [results, setResults] = useState<string[][] | undefined>(undefined);
  const [resultIndex, setResultIndex] = useState(0);

	const searchPanel: Interpolation<Theme> = (theme) => ({
		display: 'flex',
    'flex-wrap': 'wrap',
    position: 'sticky',
    top: 0,
    width: '100%',
    'z-index': 1,
    height: '2em',
    gap: '1em',
    padding: '5px 10px',
    'align-items': 'center',
    'border-bottom-width': '1px',
    'border-bottom-style': 'solid',

    'background-color': theme.HEADER_BACKGROUND_COLOR_OPAQUE,
    'border-bottom-color': theme.HEADER_BORDER_COLOR,
	});

	const searchPanelParameterSelection: Interpolation<Theme> = (theme) => ({
		display: 'inline-grid',
    color: theme.SEARCH_BUTTON_COLOR,
    width: '1.15em',
    height: '1.15em',
    border: '0.15em solid currentColor',
    'border-radius': '0.15em',
    transform: 'translateY(-0.075em)',
    'place-content': 'center',
    appearance: 'none',
    'background-color': theme.SEARCH_BUTTON_COLOR,

    '&::before': {
      'background-color': theme.TEXT_COLOR,
      'transform-origin': 'bottom left',
      'clip-path':
        'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)',
      content: '""',
      width: '0.65em',
      height: '0.65em',
      transform: 'scale(0)',
      transition: '120ms transform ease-in-out',
    },
    '&:checked::before': {
      transform: 'scale(1)',
    },
	});

	const searchButton: Interpolation<Theme> = (theme) => ({
		'background-color': theme.SEARCH_BUTTON_COLOR,
    'border-color': 'transparent',
    'border-radius': '4px',
    height: '1.56rem',
    color: theme.TEXT_COLOR,
	});

  const jumpResultContainer: Interpolation<Theme> = (theme) => ({
      display: 'flex',
      gap: '1em',
      'align-items': 'center',
  });

  async function handleSubmit() {
    setSearchStatus('pending');
    const result = await searchInObject(state, query);
    setResults(result.map((r) => r.split('.')));
    setResultIndex(0);
    setSearchStatus('done');
  }

  function reset() {
    setQuery(INITIAL_QUERY);
    setSearchStatus('unset');
    setResults(undefined);
    setResultIndex(0);
    onReset();
  }

  useEffect(() => {
    results &&
      onSubmit({ searchResult: results[0] || [], searchInProgress: true });
  }, [results, onSubmit]);

  return (
    <div className={'search-panel'} css={searchPanel}>
      <SearchBar
        text={query.queryText}
        onChange={(text: string) => setQuery({ ...query, queryText: text })}
      />
      <div>
        <input
          css={searchPanelParameterSelection}
          type={'checkbox'}
          checked={query.location.keys}
          onChange={(event) =>
            setQuery({
              ...query,
              location: { ...query.location, keys: event.target.checked },
            })
          }
        />
        <span>Keys</span>
      </div>
      <div>
        <input
          css={searchPanelParameterSelection}
          type={'checkbox'}
          checked={query.location.values}
          onChange={(event) =>
            setQuery({
              ...query,
              location: { ...query.location, values: event.target.checked },
            })
          }
        />
        <span>Values</span>
      </div>
      <button
        css={searchButton}
        onClick={() => handleSubmit()}
        disabled={
          (!query.location.keys && !query.location.values) || !query.queryText
        }
      >
        Go
      </button>
      {searchStatus === 'pending' && 'Searching...'}
      {searchStatus === 'done' && (
        <>
          <div css={jumpResultContainer}>
            <JumpSearchResultButton
              buttonDirection={BUTTON_DIRECTION.LEFT}
              buttonDisabled={!results || results.length < 2}
              jumpToNewResult={() => {
                if (!results) {
                  return;
                }
                const newIndex =
                  resultIndex - 1 < 0 ? results.length - 1 : resultIndex - 1;
                setResultIndex(newIndex);
                onSubmit({
                  searchResult: results[newIndex] || [],
                  searchInProgress: true,
                });
              }}
            />
            <JumpSearchResultButton
              buttonDirection={BUTTON_DIRECTION.RIGHT}
              buttonDisabled={!results || results.length < 2}
              jumpToNewResult={() => {
                if (!results) {
                  return;
                }
                const newIndex = (resultIndex + 1) % results.length || 0;
                setResultIndex(newIndex);
                onSubmit({
                  searchResult: results[newIndex] || [],
                  searchInProgress: true,
                });
              }}
            />
            {results &&
              `${results.length ? resultIndex + 1 : 0}/${results.length}`}
          </div>
          <button css={searchButton} onClick={() => reset()}>
            Reset
          </button>
        </>
      )}
    </div>
  );
}

export default SearchPanel;