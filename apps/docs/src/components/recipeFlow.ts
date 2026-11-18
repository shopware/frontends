/**
 * One step of a recipe flow. Recipe pages declare their steps once in
 * `<script setup>` and pass the same array to every view of the flow, so the
 * stepper and any diagram can never drift apart.
 */
export type RecipeFlowStep = {
  /** The layer the step runs in, for example "UI" or "Store API". */
  title: string;
  action: string;
  detail: string;
  code: string;
  state: string;
  typeKeys: string[];
};
