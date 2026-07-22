import { UeFormulaGraph, ACTION_SCORE_FACTORS } from "@/components/ue-editor";

/**
 * Blueprint-graph Final Score formula for the Action System page.
 * Data: ACTION_SCORE_FACTORS, verified against the scoring product in
 * ActionEvaluationComponent / ActionSet.h.
 */
export default function ActionScoreFormula() {
  return (
    <UeFormulaGraph
      title="Final Score"
      breadcrumb={["ActionEvaluationComponent", "Scoring"]}
      resultLabel="Final Score"
      factors={ACTION_SCORE_FACTORS}
      caption={
        <>
          Highest score wins. Leave a scorer off and that dimension drops out of the product.
        </>
      }
    />
  );
}
