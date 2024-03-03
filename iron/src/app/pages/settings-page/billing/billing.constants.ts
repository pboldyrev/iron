import { PlanOption } from './billing-option/billing-option.component';

export enum PlanName {
  Free = 'free',
  Monthly = 'monthly',
  Annually = 'annually',
}

export const PlanNameToDisplay = {
  free: 'Basic',
  monthly: 'Premium Monthly',
  annually: 'Premium Annually',
};

export const PLAN_OPTIONS: PlanOption[] = [
  {
    name: PlanName.Free,
    price: 'Free',
    canSelect: false,
    benefits: ['Up to 5 assets', 'Daily automatic asset value updates'],
    selected: false,
    tag: '',
  },
  {
    name: PlanName.Monthly,
    price: '$3.99/mo.',
    canSelect: true,
    benefits: [
      'Unlimited assets',
      'Daily automatic asset value updates',
      'AI-powered portfolio feedback',
      'No commitments, cancel any time',
    ],
    selected: false,
    tag: '',
  },
  {
    name: PlanName.Annually,
    price: '$29.99/yr.',
    canSelect: true,
    benefits: [
      'Unlimited assets',
      'Daily automatic asset value updates',
      'AI-powered portfolio feedback',
      'No commitments, cancel any time',
    ],
    selected: false,
    tag: 'Best value',
  },
];
