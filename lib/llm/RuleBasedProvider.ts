import type { Challan, ClassificationResult, DisputeGround, DraftBundle } from "@/lib/domain/types";
import { glossary } from "@/lib/domain/glossary";
import type { LlmProvider } from "./types";

export class RuleBasedProvider implements LlmProvider {
  readonly name = "rules";

  async complete(input: { user: string }): Promise<string> {
    return JSON.stringify({ text: input.user });
  }
}

export function classifyWithRules(input: { text: string; challan: Challan; locale: string }): ClassificationResult {
  const text = input.text.slice(0, 1200);
  const lower = text.toLowerCase();
  const hi = input.locale === "hi";
  const result = pickGround(lower, input.challan);
  return {
    ground: result,
    confidence: confidenceFor(result),
    reasoning: reasoningFor(result, hi),
    evidenceNeeded: evidenceFor(result, hi),
    clarifyingQuestion: result === "UNCLEAR" ? (hi ? "कृपया बताएं कि प्लेट, चालक, जगह या बिक्री में से क्या गलत है।" : "Please say whether the plate, driver, location or sale record is wrong.") : null,
    provider: "rules",
  };
}

export function draftWithRules(input: { ground: DisputeGround; challan: Challan; ownerName: string; registration: string; locale: string }): DraftBundle {
  const hi = input.locale === "hi";
  if (input.ground === "APPEARS_VALID") {
    return {
      provider: "rules",
      grievanceLetter: hi
        ? `भुगतान से पहले चालान ${input.challan.id} की प्लेट, जगह, समय और राशि फिर जांच लें। अगर विवरण सही है तो भुगतान मामला बंद करने का रास्ता हो सकता है। अगर कोई बात गलत है तो पहले विवाद करें, क्योंकि भुगतान को स्वीकार करने जैसा माना जा सकता है।`
        : `Before paying challan ${input.challan.id}, check the plate, location, time and amount again. If the details are correct, payment may close the matter. If any detail is wrong, dispute first because payment can be treated as acceptance.`,
      recordRequest: hi ? "इस भुगतान पथ में रिकॉर्ड अनुरोध की जरूरत नहीं है।" : "No record request is needed on the payment path.",
    };
  }

  return {
    provider: "rules",
    grievanceLetter: hi
      ? `सेवा में,\n\nविषय: चालान ${input.challan.id} की समीक्षा का अनुरोध\n\nमैं ${input.ownerName}, वाहन ${input.registration} के लिए दिखाया गया काल्पनिक पंजीकृत मालिक हूं। यह मामला ${labelGround(input.ground).toLowerCase()} जैसा दिखता है। कृपया चालान की समीक्षा करें और मेरे द्वारा दिए गए प्रमाणों को रिकॉर्ड में जोड़ें।\n\nचालान: ${input.challan.violation}\nस्थान: ${input.challan.location}\nकैमरा प्लेट: ${input.challan.cameraPlate}\nपंजीकृत प्लेट: ${input.challan.registeredPlate}\n\nयह स्वतंत्र हैकाथॉन प्रोटोटाइप का संपादन योग्य ड्राफ्ट है।`
      : `To the traffic challan grievance officer,\n\nSubject: Request to review challan ${input.challan.id}\n\nI am ${input.ownerName}, the fictional registered owner shown for vehicle ${input.registration}. This case appears to be ${labelGround(input.ground).toLowerCase()}. Please review the challan and allow me to attach the supporting evidence listed in the application.\n\nChallan: ${input.challan.violation}\nLocation: ${input.challan.location}\nCamera plate: ${input.challan.cameraPlate}\nRegistered plate: ${input.challan.registeredPlate}\n\nThis is an editable draft from an independent hackathon prototype.`,
    recordRequest: hi
      ? `कृपया चालान ${input.challan.id} के लिए उपयोग की गई कैमरा छवि और प्रवर्तन रिकॉर्ड उपलब्ध कराएं, और समीक्षा लंबित रहने तक रिकॉर्ड सुरक्षित रखें।`
      : `Please provide the camera image and enforcement record used for challan ${input.challan.id}, and keep the record available while review is pending.`,
  };
}

export function explainWithRules(term: string): string {
  return glossary[term.toLowerCase()] ?? "This term affects what the citizen should do next. Rasta explains it in plain language before any action.";
}

function pickGround(text: string, challan: Challan): DisputeGround {
  if (/\b(sold|sale|transferr?ed|new owner|bech|becha|bechi)\b|बेच|बिका|बेची|ट्रांसफर/i.test(text)) return "VEHICLE_SOLD";
  if (/\b(not me|not driving|wasn'?t driving|brother|friend|cousin|driver)\b|मैं नहीं|भाई|दोस्त|चालक/i.test(text)) return "NOT_DRIVING";
  if (/\b(wrong location|not there|different city|time|location)\b|वहां नहीं|दूसरे शहर|जगह|समय/i.test(text)) return "WRONG_LOCATION_TIME";
  if (/\b(correct|valid|paid|i did|looks right)\b|सही/i.test(text)) return "APPEARS_VALID";
  const distance = plateDistance(challan.cameraPlate, challan.registeredPlate);
  if ((distance > 0 && distance <= 2) || /\b(plate|number|misread)\b|प्लेट|नंबर/i.test(text)) return "PLATE_MISREAD";
  return "UNCLEAR";
}

function confidenceFor(ground: DisputeGround): number {
  return ground === "UNCLEAR" ? 0.42 : ground === "APPEARS_VALID" ? 0.78 : 0.9;
}

function evidenceFor(ground: DisputeGround, hi: boolean): string[] {
  const en: Record<DisputeGround, string[]> = {
    PLATE_MISREAD: ["Registered vehicle plate photo", "RC copy", "Request for camera image and enforcement record"],
    NOT_DRIVING: ["Driver statement", "Trip or message record", "Any parking or location proof"],
    WRONG_LOCATION_TIME: ["Toll, fuel, parking or service record", "Calendar or trip proof", "Witness statement"],
    VEHICLE_SOLD: ["Sale receipt or delivery note", "Buyer contact details", "Transfer application proof"],
    APPEARS_VALID: ["No dispute evidence needed"],
    UNCLEAR: ["One clearer sentence about what is wrong"],
  };
  const hindi: Record<DisputeGround, string[]> = {
    PLATE_MISREAD: ["पंजीकृत वाहन की प्लेट फोटो", "RC कॉपी", "कैमरा छवि और रिकॉर्ड का अनुरोध"],
    NOT_DRIVING: ["चालक का बयान", "यात्रा या संदेश रिकॉर्ड", "स्थान का कोई प्रमाण"],
    WRONG_LOCATION_TIME: ["टोल, ईंधन, पार्किंग या सर्विस रिकॉर्ड", "यात्रा प्रमाण", "गवाह का बयान"],
    VEHICLE_SOLD: ["बिक्री रसीद या डिलीवरी नोट", "खरीदार की जानकारी", "ट्रांसफर आवेदन का प्रमाण"],
    APPEARS_VALID: ["विवाद प्रमाण की जरूरत नहीं"],
    UNCLEAR: ["क्या गलत है, इस पर एक साफ वाक्य"],
  };
  return hi ? hindi[ground] : en[ground];
}

function reasoningFor(ground: DisputeGround, hi: boolean): string {
  const en: Record<DisputeGround, string> = {
    PLATE_MISREAD: "The camera plate and registered plate appear different. Request the image and compare it with the vehicle record before paying.",
    NOT_DRIVING: "This suggests the vehicle may be yours but someone else was driving. Add a driver statement or supporting proof.",
    WRONG_LOCATION_TIME: "This looks like a location or time mismatch. Simple proof of where the vehicle was can support the dispute.",
    VEHICLE_SOLD: "This looks like a sold-vehicle case. Proof of sale and transfer follow-up are the strongest evidence.",
    APPEARS_VALID: "Your description does not clearly contest the challan. Check the details once more before choosing to pay.",
    UNCLEAR: "There is not enough detail yet. Rasta needs one clearer sentence before drafting anything.",
  };
  const hindi: Record<DisputeGround, string> = {
    PLATE_MISREAD: "कैमरा प्लेट और पंजीकृत प्लेट अलग दिखती हैं। भुगतान से पहले छवि मांगें और रिकॉर्ड से मिलान करें।",
    NOT_DRIVING: "यह दिखाता है कि वाहन आपका हो सकता है, लेकिन चालक कोई और था। चालक का बयान या सहायक प्रमाण जोड़ें।",
    WRONG_LOCATION_TIME: "यह जगह या समय के मेल न खाने का मामला दिखता है। वाहन कहां था इसका साधारण प्रमाण मदद करेगा।",
    VEHICLE_SOLD: "यह वाहन बिक्री का मामला दिखता है। बिक्री और ट्रांसफर फॉलो-अप का प्रमाण सबसे मजबूत होगा।",
    APPEARS_VALID: "आपके विवरण से चालान गलत नहीं दिख रहा। भुगतान से पहले विवरण फिर जांच लें।",
    UNCLEAR: "अभी जानकारी कम है। ड्राफ्ट बनाने से पहले एक साफ वाक्य चाहिए।",
  };
  return hi ? hindi[ground] : en[ground];
}

function labelGround(ground: DisputeGround): string {
  return ground.toLowerCase().replaceAll("_", " ");
}

function plateDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}
