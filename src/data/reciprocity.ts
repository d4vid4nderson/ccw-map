import { ReciprocityEntry, ReciprocityStatus } from '../types';

// CCW Permit Reciprocity Matrix
// This defines which states honor which other states' concealed carry permits.
// Sources: USCCA, Handgunlaw.us, USACarry
// Last reviewed: February 2026
//
// NOTE: Reciprocity agreements change. Always verify with official state sources.
// "honors" = this state accepts permits from the listed states
// Permitless carry states generally allow anyone who can legally carry to do so,
// regardless of home state permit status.

// States that have permitless carry (no permit needed for anyone legally allowed)
export const permitlessCarryStates = [
  'AL', 'AK', 'AZ', 'AR', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS',
  'KY', 'LA', 'ME', 'MS', 'MO', 'MT', 'NE', 'NH', 'ND', 'OH',
  'OK', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'WV', 'WY',
];

// Reciprocity data: which permits each state honors
// For permitless carry states, this represents additional reciprocity for permit holders
// (some locations within permitless states may still differentiate permit vs. permitless)
export const reciprocityData: Record<string, ReciprocityEntry> = {
  AL: {
    stateCode: 'AL',
    honors: [
      'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  AK: {
    stateCode: 'AK',
    honors: [
      'AL', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  AZ: {
    stateCode: 'AZ',
    honors: [
      'AL', 'AK', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  AR: {
    stateCode: 'AR',
    honors: [
      'AL', 'AK', 'AZ', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  CA: {
    stateCode: 'CA',
    honors: [],
    honoredBy: [],
  },
  CO: {
    stateCode: 'CO',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'DE', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  CT: {
    stateCode: 'CT',
    honors: [],
    honoredBy: [],
  },
  DE: {
    stateCode: 'DE',
    honors: [
      'AK', 'AZ', 'AR', 'CO', 'FL', 'ID', 'IN', 'KS', 'KY',
      'ME', 'MI', 'MO', 'MT', 'NE', 'NH', 'NC', 'ND', 'OH', 'OK',
      'PA', 'SC', 'SD', 'TN', 'TX', 'UT', 'WV', 'WI', 'WY',
    ],
    honoredBy: ['AZ', 'CO', 'FL', 'ID', 'IN', 'KS', 'KY', 'MI', 'MO', 'MT', 'NE', 'NH', 'NC', 'ND', 'OH', 'OK', 'SD', 'TN', 'TX', 'UT', 'WV', 'WI', 'WY'],
  },
  FL: {
    stateCode: 'FL',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
  },
  GA: {
    stateCode: 'GA',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'ID', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NH', 'NC',
      'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA',
      'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'ID', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NH', 'NC',
      'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA',
      'WV', 'WI', 'WY',
    ],
  },
  HI: {
    stateCode: 'HI',
    honors: [],
    honoredBy: [],
  },
  ID: {
    stateCode: 'ID',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'IN', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  IL: {
    stateCode: 'IL',
    honors: [],
    honoredBy: [],
  },
  IN: {
    stateCode: 'IN',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IA', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  IA: {
    stateCode: 'IA',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'KS',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  KS: {
    stateCode: 'KS',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  KY: {
    stateCode: 'KY',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  LA: {
    stateCode: 'LA',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  ME: {
    stateCode: 'ME',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  MD: {
    stateCode: 'MD',
    honors: [],
    honoredBy: [],
  },
  MA: {
    stateCode: 'MA',
    honors: [],
    honoredBy: [],
  },
  MI: {
    stateCode: 'MI',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  MN: {
    stateCode: 'MN',
    honors: [
      'AK', 'AR', 'KS', 'KY', 'LA', 'MI', 'MO', 'NV', 'NM', 'ND',
      'OH', 'OK', 'SC', 'SD', 'TN', 'UT', 'WV', 'WY',
    ],
    honoredBy: [
      'AK', 'AL', 'AZ', 'AR', 'ID', 'IN', 'IA', 'KS', 'KY', 'LA',
      'MI', 'MO', 'MT', 'NE', 'NV', 'NH', 'NC', 'ND', 'OH', 'OK',
      'SD', 'TN', 'TX', 'UT', 'WV', 'WI', 'WY',
    ],
  },
  MS: {
    stateCode: 'MS',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  MO: {
    stateCode: 'MO',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MT', 'NE',
      'NV', 'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN',
      'TX', 'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
  },
  MT: {
    stateCode: 'MT',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'NE', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  NE: {
    stateCode: 'NE',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NV', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  NV: {
    stateCode: 'NV',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'FL', 'ID', 'IL', 'KS', 'KY',
      'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NC', 'ND',
      'OH', 'OK', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NH',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  NH: {
    stateCode: 'NH',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  NJ: {
    stateCode: 'NJ',
    honors: [],
    honoredBy: [],
  },
  NM: {
    stateCode: 'NM',
    honors: [
      'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'ID', 'KS', 'LA',
      'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV', 'NC', 'ND', 'OH',
      'OK', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AK', 'AZ', 'AR', 'ID', 'IN', 'IA', 'KS', 'KY', 'MN', 'MO',
      'MT', 'NE', 'NV', 'NC', 'ND', 'OH', 'OK', 'SD', 'TN', 'TX',
      'UT', 'WV', 'WY',
    ],
  },
  NY: {
    stateCode: 'NY',
    honors: [],
    honoredBy: [],
  },
  NC: {
    stateCode: 'NC',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE',
      'NV', 'NH', 'NM', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN',
      'TX', 'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  ND: {
    stateCode: 'ND',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT',
      'NE', 'NV', 'NH', 'NM', 'NC', 'OH', 'OK', 'PA', 'SC', 'SD',
      'TN', 'TX', 'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  OH: {
    stateCode: 'OH',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT',
      'NE', 'NV', 'NH', 'NM', 'NC', 'ND', 'OK', 'PA', 'SC', 'SD',
      'TN', 'TX', 'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  OK: {
    stateCode: 'OK',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT',
      'NE', 'NV', 'NH', 'NM', 'NC', 'ND', 'OH', 'PA', 'SC', 'SD',
      'TN', 'TX', 'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  OR: {
    stateCode: 'OR',
    honors: [],
    honoredBy: ['AL', 'AK', 'AZ', 'AR', 'ID', 'IN', 'IA', 'KS', 'KY', 'MO', 'MT', 'NE', 'NH', 'NC', 'ND', 'OH', 'OK', 'SD', 'TN', 'TX', 'UT', 'WV', 'WY'],
  },
  PA: {
    stateCode: 'PA',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NH',
      'NC', 'ND', 'OH', 'OK', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA',
      'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NH',
      'NC', 'ND', 'OH', 'OK', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA',
      'WV', 'WI', 'WY',
    ],
  },
  RI: {
    stateCode: 'RI',
    honors: [],
    honoredBy: [],
  },
  SC: {
    stateCode: 'SC',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE',
      'NV', 'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SD', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  SD: {
    stateCode: 'SD',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT',
      'NE', 'NV', 'NH', 'NM', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC',
      'TN', 'TX', 'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'TN', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  TN: {
    stateCode: 'TN',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT',
      'NE', 'NV', 'NH', 'NM', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC',
      'SD', 'TX', 'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TX', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  TX: {
    stateCode: 'TX',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT',
      'NE', 'NV', 'NH', 'NM', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC',
      'SD', 'TN', 'UT', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'UT',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  UT: {
    stateCode: 'UT',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT',
      'NE', 'NV', 'NH', 'NM', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC',
      'SD', 'TN', 'TX', 'VA', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'VA', 'WV', 'WI', 'WY',
    ],
  },
  VT: {
    stateCode: 'VT',
    honors: [],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'ID', 'IN', 'IA', 'KS', 'KY', 'MO',
      'MT', 'NE', 'NH', 'NC', 'ND', 'OH', 'OK', 'SD', 'TN', 'TX',
      'UT', 'WV', 'WY',
    ],
  },
  VA: {
    stateCode: 'VA',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE',
      'NV', 'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN',
      'TX', 'UT', 'WV', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'WV', 'WI', 'WY',
    ],
  },
  WA: {
    stateCode: 'WA',
    honors: [],
    honoredBy: [],
  },
  WV: {
    stateCode: 'WV',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT',
      'NE', 'NV', 'NH', 'NM', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VA', 'WI', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WI', 'WY',
    ],
  },
  WI: {
    stateCode: 'WI',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT',
      'NE', 'NV', 'NH', 'NM', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VA', 'WV', 'WY',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WY',
    ],
  },
  WY: {
    stateCode: 'WY',
    honors: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'DE', 'FL', 'GA', 'ID', 'IN',
      'IA', 'KS', 'KY', 'LA', 'ME', 'MI', 'MN', 'MS', 'MO', 'MT',
      'NE', 'NV', 'NH', 'NM', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VA', 'WV', 'WI',
    ],
    honoredBy: [
      'AL', 'AK', 'AZ', 'AR', 'CO', 'FL', 'GA', 'ID', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MI', 'MS', 'MO', 'MT', 'NE', 'NV',
      'NH', 'NC', 'ND', 'OH', 'OK', 'PA', 'SC', 'SD', 'TN', 'TX',
      'UT', 'VA', 'WV', 'WI',
    ],
  },
  DC: {
    stateCode: 'DC',
    honors: [],
    honoredBy: [],
  },
};

/**
 * Get the reciprocity status of a target state relative to a home state.
 */
export function getReciprocityStatus(
  homeStateCode: string,
  targetStateCode: string
): ReciprocityStatus {
  if (homeStateCode === targetStateCode) return 'home';

  // If target state has permitless carry, anyone legal can carry
  if (permitlessCarryStates.includes(targetStateCode)) return 'permitless';

  const targetReciprocity = reciprocityData[targetStateCode];
  if (!targetReciprocity) return 'none';

  // Check if the target state honors the home state's permit
  if (targetReciprocity.honors.includes(homeStateCode)) return 'full';

  return 'none';
}

/**
 * Get all states that honor a given state's permit.
 */
export function getStatesHonoringPermit(stateCode: string): string[] {
  const result: string[] = [];

  // All permitless carry states effectively honor all permits
  for (const ps of permitlessCarryStates) {
    if (ps !== stateCode) result.push(ps);
  }

  // Add states that specifically honor this state's permit
  const entry = reciprocityData[stateCode];
  if (entry) {
    for (const s of entry.honoredBy) {
      if (!result.includes(s) && s !== stateCode) {
        result.push(s);
      }
    }
  }

  return result.sort();
}

/**
 * Get reciprocity summary for a state.
 */
export function getReciprocitySummary(stateCode: string): {
  canCarryIn: number;
  honorsCount: number;
  honoredByCount: number;
} {
  const entry = reciprocityData[stateCode];
  const honorsCount = entry?.honors.length ?? 0;
  const statesHonoring = getStatesHonoringPermit(stateCode);

  return {
    canCarryIn: statesHonoring.length + (permitlessCarryStates.includes(stateCode) ? 0 : 1), // +1 for home state if not already counted
    honorsCount,
    honoredByCount: statesHonoring.length,
  };
}
