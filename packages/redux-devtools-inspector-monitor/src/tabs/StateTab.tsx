import React, { useEffect, useState } from 'react';
import { JSONTree } from 'react-json-tree';
import { Action } from 'redux';
import getItemString from './getItemString';
import getJsonTreeTheme from './getJsonTreeTheme';
import { TabComponentProps } from '../ActionPreview';
import SearchPanel from '../searchPanel/SearchPanel';
import { Interpolation, Theme } from '@emotion/react';

interface SearchState {
  searchResult: string[];
  searchInProgress: boolean;
}

const StateTab: React.FunctionComponent<
  TabComponentProps<any, Action<string>>
> = ({
  nextState,
  base16Theme,
  invertTheme,
  labelRenderer,
  dataTypeKey,
  isWideLayout,
  sortStateTreeAlphabetically,
  disableStateTreeCollection,
  enableSearchPanel,
}) => {

    const [searchState, setSearchState] = useState<SearchState>({
      searchResult: [],
      searchInProgress: false,
    });

    const displayedResult = React.useRef<HTMLDivElement>(null);

    const queryResultLabel: Interpolation<Theme> = (theme) => ({
      'background-color': '#FFFF00',
      'text-indent': 0,
    });

    const queryResult: Interpolation<Theme> = (theme) => ({
      'background-color': '#FFFF00',
    })

    useEffect(() => {
      if (
        enableSearchPanel &&
        searchState.searchInProgress &&
        displayedResult.current
      ) {
        if (searchState.searchInProgress && displayedResult.current) {
          displayedResult.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
          setSearchState({ ...searchState, searchInProgress: false });
        }
      }}, [searchState, setSearchState, enableSearchPanel]);

    return (
    <>
      {enableSearchPanel && (
        <SearchPanel
          onSubmit={setSearchState}
          onReset={() =>
            setSearchState({
              searchResult: [],
              searchInProgress: false,
            })
          }
          state={nextState}
        />
      )}
      <JSONTree
        labelRenderer={(keyPath, nodeType, expanded, expandable) => {
          return isMatch(searchState.searchResult, [...keyPath].reverse()) ? (
            <span css={queryResultLabel} ref={displayedResult}>
              {labelRenderer(keyPath, nodeType, expanded, expandable)}
            </span>
          ) : (
            labelRenderer(keyPath, nodeType, expanded, expandable)
          );
        }}
        theme={getJsonTreeTheme(base16Theme)}
        data={nextState}
        getItemString={(type, data) =>
          getItemString(type, data, dataTypeKey, isWideLayout)
        }
        invertTheme={invertTheme}
        hideRoot
        sortObjectKeys={sortStateTreeAlphabetically}
        {...(disableStateTreeCollection ? { collectionLimit: 0 } : {})}
        isSearchInProgress={searchState.searchInProgress}
        searchResultPath={searchState.searchResult}
        valueRenderer={(raw, value, ...keyPath) => {
          return isMatch(searchState.searchResult, [...keyPath].reverse()) ? (
            <span css={queryResult} ref={displayedResult}>
              {raw as string}
            </span>
          ) : (
            <span>{raw as string}</span>
          );
        }}
      />
    </>
  );
};

const isMatch = (resultPath: string[], nodePath: (string | number)[]) => {
  return (
    resultPath.length === nodePath.length &&
    resultPath.every((result, index) => result === nodePath[index].toString())
  );
};

export default StateTab;
