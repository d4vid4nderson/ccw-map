export type PermitType = 'unrestricted' | 'shall-issue' | 'may-issue' | 'no-issue';
export type CarryType = 'permitless' | 'permit-required' | 'restricted' | 'prohibited';

export interface StateLaw {
  stateCode: string;
  stateName: string;
  permitType: PermitType;
  openCarry: CarryType;
  concealedCarry: CarryType;
  permitlessCarry: boolean;
  permitRequiredForPurchase: boolean;
  universalBackgroundChecks: boolean;
  redFlagLaw: boolean;
  standYourGround: boolean;
  castleDoctrine: boolean;
  dutyToRetreat: boolean;
  preemption: boolean;
  magazineRestriction: number | null; // null = no restriction
  transportRequirements: string | null; // How firearms must be stored/transported in vehicles
  ammoRestrictions: string | null; // Ammunition-specific laws (hollow point bans, etc.)
  sourceUrl: string; // Official state government page for gun laws
  summary: string;
  keyProvisions: string[];
  lastUpdated: string;
}

export interface ReciprocityEntry {
  stateCode: string;
  honors: string[];       // States whose permits this state honors
  honoredBy: string[];    // States that honor this state's permit
}

export type ReciprocityStatus = 'full' | 'partial' | 'none' | 'home' | 'permitless';

export interface StateFeatureProperties {
  stateCode: string;
  stateName: string;
  reciprocityStatus?: ReciprocityStatus;
}

export interface LegiscanBill {
  billId: number;
  billNumber: string;
  title: string;
  description: string;
  state: string;
  status: string;
  statusDate: string;
  url: string;
  lastAction: string;
  lastActionDate: string;
}
