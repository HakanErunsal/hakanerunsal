import { UeDetailsPanel, ACTION_CHAIN_LINK_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for one FActionChainLink, the way the Unreal editor shows an
 * entry in an action's Chain Links array. Data lives in
 * ACTION_CHAIN_LINK_DETAILS, verified against ActionSet.h.
 */
export default function ActionChainLinkDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={ACTION_CHAIN_LINK_DETAILS} />
    </div>
  );
}
