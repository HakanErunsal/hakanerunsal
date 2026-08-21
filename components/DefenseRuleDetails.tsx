import {
  DEFENSE_BLOCK_DETAILS,
  DEFENSE_INVULNERABLE_DETAILS,
  DEFENSE_PARRY_DETAILS,
  DEFENSE_RESISTANCE_DETAILS,
  UeComponentDetailsPanel,
} from "@/components/ue-editor";

/**
 * One instanced entry on a Defense component's Responses array, one export per shipped
 * response type. Each panel carries the values the matching worked example authors, so a
 * reader can copy the fields row for row. Verified against SECDefenseRules.h.
 */

export function DefenseInvulnerableDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Invulnerable"
      sourceClass="SECDefenseRule_Invulnerable"
      attachTo="SEC Defense > Responses [0]"
      sourceKind="instanced"
      note="Takes the hit for nothing while the pawn holds the tag. No arc, so it answers from every direction, and no cost."
      categories={DEFENSE_INVULNERABLE_DETAILS}
    />
  );
}

export function DefenseParryDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Parry"
      sourceClass="SECDefenseRule_Parry"
      attachTo="SEC Defense > Responses [1]"
      sourceKind="instanced"
      note="Answers only while the parry ability holds its tag and the blow arrives inside 60 degrees of straight ahead."
      categories={DEFENSE_PARRY_DETAILS}
    />
  );
}

export function DefenseBlockDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Block"
      sourceClass="SECDefenseRule_Block"
      attachTo="SEC Defense > Responses [2]"
      sourceKind="instanced"
      note="Charges 5 stamina plus 1 per point of the incoming blow. A pawn that cannot pay drops through to whatever sits below."
      categories={DEFENSE_BLOCK_DETAILS}
    />
  );
}

export function DefenseResistanceDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Damage Type Resistance"
      sourceClass="SECDefenseRule_DamageTypeResistance"
      attachTo="DA_Defense_KnightArmour > Responses [0]"
      sourceKind="instanced"
      note="Shaves 40 percent off slashing damage and carries on down the list, so it trims whatever the guards above it let through."
      categories={DEFENSE_RESISTANCE_DETAILS}
    />
  );
}
