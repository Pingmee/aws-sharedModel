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
  name: 'בסיס - Omnichannel',
  type: PlanType.basic,
  isActive: true,
  isPopular: false,
  monthlyPrice: 199,
  yearlyPrice: 199 * 11,
  baseFeatures: [],
  extraFeatures: [
    "אפליקציה ל־iOS ולאנדרואיד",
    "תוסף לדפדפן כרום",
    "חיבור ל־WhatsApp, Messenger ו־Instagram",
    "ממשק ניהול שיחות מתקדם",
    "שירות רשמי WhatsApp API",
    "צ'אט תמיכה מהיר",
    "שירות גיבוי שיחות והודעות",
    "ממשק ניהול שיחות מתקדם",
    "תמיכה בתקשורת בין סוכנים"

  ]
}

const extendedPlan = {
  paymentLinkId: '6b06b7d9-c046-42a2-a88d-351e37011703',
  name: 'מורחב - Social',
  type: PlanType.expended,
  isActive: true,
  isPopular: true,
  monthlyPrice: 349,
  yearlyPrice: 349 * 11,
  baseFeatures: [
    ...basePlan.extraFeatures, ...basePlan.baseFeatures
  ],
  extraFeatures: [
    "צ׳אט בוט קלאסי",
    "בניית מסע לקוח",
    "יכולות AI",
    "תרגום הודעות אוטומטי",
    "שרת אוטומציות מגובה ענן",
    "מענה אוטומטי לפוסטים, Stories ו־Reels",
  ]
}

//@ts-expect-error
export const Plans: { [key in PlanType]: Plan } = {
  [PlanType.basic]: basePlan,
  [PlanType.expended]: extendedPlan,
  [PlanType.expertAI]: {
    paymentLinkId: '46c8a69f-bf05-48f6-b9ed-10e1cdb2136e',
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
      "סוכני AI",
      "סיכום שיחות בקליק ועריכת הודעות AI",
      "חיבור למערכת ChatGPT"
    ]
  }
}