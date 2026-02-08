
export enum ValentineStep {
  PROPOSAL = 'PROPOSAL',
  WHY = 'WHY',
  SUMMARY = 'SUMMARY'
}

export interface ValentineData {
  willBeValentine: string;
  reason: string;
}

export interface ButtonPosition {
  x: number;
  y: number;
}
