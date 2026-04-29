export enum PlanType {
  basic = 'Basic',
  expended = 'Expanded',
  expertAI = 'ExpertAI',
  trial = 'Trial',
  partner = 'Partner'
}

export interface Plan {
  paymentLinkId: string,
  yearlyPaymentLinkId: string,
  name: string
  description: string
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
  yearlyPaymentLinkId: 'ab63ef0e-9adb-476a-9393-146fcf6cfbc5',
  name: 'בסיס - Social',
  type: PlanType.basic,
  isActive: true,
  isPopular: false,
  monthlyPrice: 199,
  yearlyPrice: 199 * 11,
  baseFeatures: [],
  extraFeatures: [
    "מענה אוטומטי לפוסטים, Stories ו־Reels",
    "אפליקציה ל־iOS ולאנדרואיד",
    "תוסף לדפדפן כרום",
    "חיבור ל־WhatsApp, Messenger ו־Instagram",
    "ממשק ניהול שיחות מתקדם",
    "שירות רשמי WhatsApp API",
    "צ'אט תמיכה מהיר",
    "שירות גיבוי שיחות והודעות",
    "ממשק ניהול שיחות מתקדם",
    "תמיכה בתקשורת בין סוכנים"
  ],
  description: 'תוכנית זו מתאימה לעסקים שמנהלים פעילות בסיסית במדיה החברתית ורוצים מענה אוטומטי לפוסטים, Stories ו־Reels. ושליחת הודעות קמפיין להמונים.'
}

const extendedPlan: Plan = {
  paymentLinkId: '6b06b7d9-c046-42a2-a88d-351e37011703',
  yearlyPaymentLinkId: 'dff7c69c-5837-4f9f-849a-c568e77d656d',
  name: 'מורחב - Chatbot',
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
    "שרת אוטומציות מגובה ענן"
  ],
  description: 'תוכנית זו מתאימה לעסקים המעוניינים בצ\'אט בוטים קלאסים (שאלות תשובות), ניהול מסעות לקוח וכלי אוטומציה מבוססי AI לשיפור השירות והמעורבות.'
}

//@ts-expect-error
export const Plans: { [ key in PlanType ]: Plan } = {
  [ PlanType.basic ]: basePlan,
  [ PlanType.expended ]: extendedPlan,
  [ PlanType.expertAI ]: {
    paymentLinkId: '46c8a69f-bf05-48f6-b9ed-10e1cdb2136e',
    yearlyPaymentLinkId: '03e444a4-ab1a-472c-ae7e-db7b65c59dbc',
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
    ],
    description: 'תוכנית זו מתאימה לעסקים מתקדמים שמבקשים כלים חכמים לניהול שיחות, סוכני AI וחיבורים למערכות מתקדמות כמו ChatGPT. סוכני AI מסוגלים לקבוע פגישות, לתת מידע על סטטוס הזמנה, לספק מידע על העסק ועוד המון אפשריות.'
  }
}