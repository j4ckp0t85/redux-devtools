import { StylingFunction } from 'react-base16-styling';
import React, { ReactElement } from 'react';
import { Interpolation, Theme } from '@emotion/react';

export const BUTTON_DIRECTION = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

const jumpResultButton: Interpolation<Theme> = (theme) => ({
	'background-color': theme.SEARCH_BUTTON_COLOR,
	'border-color': 'transparent',
	'border-radius': '4px',
});

const jumpResultButtonArrow: Interpolation<Theme> = (theme) => ({
	cursor: 'hand',
	fill: theme.TEXT_COLOR,
	width: '0.6rem',
	height: '1rem',
});

interface JumpSearchResultButtonProps {
  buttonDirection: string;
  buttonDisabled: boolean;
  jumpToNewResult: () => void;
}

function JumpSearchResultButton({
  buttonDirection,
  buttonDisabled,
  jumpToNewResult,
}: JumpSearchResultButtonProps): ReactElement {
  return (
    <button
      css={jumpResultButton}
      onClick={() => jumpToNewResult()}
      disabled={buttonDisabled}
    >
      <svg
        css={jumpResultButtonArrow}
        viewBox="4 0 14 18"
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {buttonDirection === BUTTON_DIRECTION.LEFT ? (
            <path d="M15.41 16.09l-4.58-4.59 4.58-4.59-1.41-1.41-6 6 6 6z" />
          ) : (
            <path d="M8.59 16.34l4.58-4.59-4.58-4.59 1.41-1.41 6 6-6 6z" />
          )}
        </g>
      </svg>
    </button>
  );
}

export default JumpSearchResultButton;