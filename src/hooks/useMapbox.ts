import { useState, useCallback } from 'react';
import { ReciprocityStatus } from '../types';
import { getReciprocityStatus, permitlessCarryStates } from '../data/reciprocity';
import { stateLaws } from '../data/stateLaws';
import { useTheme } from '../context/ThemeContext';

export function useReciprocityMap() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const { theme, homeState } = useTheme();

  // Use selectedState if set, otherwise fall back to homeState
  const activeState = selectedState ?? homeState;

  const getStateColor = useCallback(
    (stateCode: string): string => {
      if (!activeState) {
        // No state selected: color by permit type
        const law = stateLaws[stateCode];
        if (!law) return theme.map.fallback;

        if (law.permitlessCarry) return theme.reciprocity.permitless;
        switch (law.permitType) {
          case 'unrestricted':
            return theme.reciprocity.unrestricted;
          case 'shall-issue':
            return theme.permitType['may-issue'];
          case 'may-issue':
            return theme.permitType['no-issue'];
          case 'no-issue':
            return theme.error;
          default:
            return theme.map.fallback;
        }
      }

      // State selected (or home state): show reciprocity
      const status = getReciprocityStatus(activeState, stateCode);
      switch (status) {
        case 'home':
          return theme.reciprocity.home;
        case 'permitless':
          return theme.reciprocity.permitless;
        case 'full':
          return theme.reciprocity.full;
        case 'partial':
          return theme.reciprocity.partial;
        case 'none':
          return theme.reciprocity.none;
        default:
          return theme.map.fallback;
      }
    },
    [activeState, theme]
  );

  const selectState = useCallback((stateCode: string | null) => {
    setSelectedState(stateCode);
  }, []);

  return {
    selectedState,
    activeState,
    selectState,
    getStateColor,
  };
}

// State code to name mapping for GeoJSON matching
export const stateNameToCode: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
  'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
  'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
  'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC',
};

export const codeToStateName: Record<string, string> = Object.fromEntries(
  Object.entries(stateNameToCode).map(([name, code]) => [code, name])
);
