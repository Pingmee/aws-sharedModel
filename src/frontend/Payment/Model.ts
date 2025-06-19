export enum PlanType {
  basic = 'Basic',
  expended = 'Expanded',
  expertAI = 'ExpertAI',
  trial = 'Trial'
}

export interface Plan {
  paymentLinkId: string,
  name: string
  type: PlanType
  isActive: boolean,
  isPopular: boolean,
  monthlyPrice: number
  yearlyPrice: number
  baseFeatures: string[]
  extraFeatures: string[]
}

const basePlan = {
  paymentLinkId: '96dddf71-c537-4e05-a1a2-13adda359196',
  name: 'בסיס',
  type: PlanType.basic,
  isActive: true,
  isPopular: false,
  monthlyPrice: 199,
  yearlyPrice: 199 * 11,
  baseFeatures: [
    "ממשק מתקדם לשיחות",
    "שירות רשמי WhatsApp API",
    "צ'אט תמיכה מהיר",
    "שירות גיבוי שיחות והודעות",
    "שליחה ועריכת תבניות",
    "תמיכה בתקשורת בין סוכנים" ],
  extraFeatures: [
    "אפליקציה iOS Android",
    "תוסף לדפדפן כרום"
  ]
}

const extendedPlan = {
  paymentLinkId: '6b06b7d9-c046-42a2-a88d-351e37011703',
  name: 'מורחב',
  type: PlanType.expended,
  isActive: true,
  isPopular: true,
  monthlyPrice: 349,
  yearlyPrice: 349 * 11,
  baseFeatures: [
    ...basePlan.extraFeatures, ...basePlan.baseFeatures
  ],
  extraFeatures: [
    "שרת אוטומציות מגובה ענן",
    "בונה צ'אט בוט חכם פעיל 24/7"
  ]
}

//@ts-expect-error
export const Plans: { [key in PlanType]: Plan } = {
  [PlanType.basic]: basePlan,
  [PlanType.expended]: extendedPlan,
  [PlanType.expertAI]: {
    paymentLinkId: '',
    name: 'מתקדם - AI',
    type: PlanType.expertAI,
    isActive: true,
    isPopular: false,
    monthlyPrice: 599,
    yearlyPrice: 599 * 11,
    baseFeatures: [
      ...extendedPlan.extraFeatures, ...extendedPlan.baseFeatures
    ],
    extraFeatures: [
      "יצירת סוכני AI",
      "חיבור למערכת ChatGPT",
      "סיכום שיחות בקליק ועריכת הודעות AI"
    ]
  }
}