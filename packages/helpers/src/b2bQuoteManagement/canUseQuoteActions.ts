export function canUseQuoteActions<
  T extends {
    stateMachineState?: {
      technicalName: string;
    };
  },
>(quote: T) {
  return ["replied"].includes(quote.stateMachineState?.technicalName ?? "");
}
