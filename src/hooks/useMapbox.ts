import { useState, useCallback } from 'react';
import { ReciprocityStatus } from '../types';
import { getReciprocityStatus, permitlessCarryStates } from '../data/reciprocity';
import { stateLaws } from '../data/stateLaws';

export function useReciprocityMap() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const getStateColor = useCallback(
    (stateCode: string): string => {
      if (!selectedState) {
        // No state selected: color by permit type
        const law = stateLaws[stateCode];
        if (!law) return '#333355';

        if (law.permitlessCarry) return '#4caf50';
        switch (law.permitType) {
          case 'unrestricted':
            return '#2e7d32';
          case 'shall-issue':
            return '#ff9800';
          case 'may-issue':
            return '#f44336';
          case 'no-issue':
            return '#b71c1c';
          default:
            return '#333355';
        }
      }

      // State selected: show reciprocity
      const status = getReciprocityStatus(selectedState, stateCode);
      switch (status) {
        case 'home':
          return '#4a90d9';
        case 'permitless':
          return '#8bc34a';
        case 'full':
          return '#4caf50';
        case 'partial':
          return '#ff9800';
        case 'none':
          return '#f44336';
        default:
          return '#333355';
      }
    },
    [selectedState]
  );

  const selectState = useCallback((stateCode: string | null) => {
    setSelectedState(stateCode);
  }, []);

  return {
    selectedState,
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
