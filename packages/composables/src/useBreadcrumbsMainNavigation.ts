import { ComputedRef, computed, isProxy, toRaw } from "vue";
import { _useContext } from "./internal/_useContext";
import { StoreNavigationElement } from "@shopware-pwa/types";
import { Breadcrumb } from "./useBreadcrumbs";

export function useBreadcrumbsMainNavigation(
  mainNavigation: ComputedRef<StoreNavigationElement[]>,
  newBreadcrumbs?: Breadcrumb[]
) {
  // Store for breadcrumbs
  const _breadcrumbs = _useContext<Breadcrumb[]>("swBreadcrumb", {
    replace: newBreadcrumbs,
  });

  /**
   * Clear breadcrumbs store
   */
  const clearBreadcrumbs = () => {
    _breadcrumbs.value = [];
  };

  /**
   * Created breadcrumbs with main-navigation data store
   */
  const createdBreadcrumbs = () => {
    _breadcrumbs.value = [];
  };

  let breadcrumbRaw = null;
  if (isProxy(_breadcrumbs.value)) {
    breadcrumbRaw = toRaw(_breadcrumbs.value);
  }

  let navigationRaw = null;
  if (isProxy(mainNavigation.value)) {
    navigationRaw = toRaw(mainNavigation.value) as StoreNavigationElement[];
  }

  if (breadcrumbRaw && navigationRaw) {
    const matchingNodes = findMatchingNodes(breadcrumbRaw, navigationRaw);
    if (matchingNodes.length > 0) {
      createdBreadcrumbs.value = extendBreadcrumbWithSeoPath(
        breadcrumbRaw,
        matchingNodes
      );
    }
  }

  return {
    clearBreadcrumbs,
    breadcrumbs: computed(() => createdBreadcrumbs.value),
  };
}

function findMatchingNodes(
  breadcrumb: Breadcrumb[],
  nodes: StoreNavigationElement[]
): StoreNavigationElement[] {
  const matchingNodes: StoreNavigationElement[] = [];
  if (breadcrumb.length === 0 || nodes.length === 0) {
    return matchingNodes;
  }

  const [currentCrumb, ...remainingCrumbs] = breadcrumb;

  for (const node of nodes) {
    if (node.name === currentCrumb.name) {
      if (remainingCrumbs.length === 0) {
        matchingNodes.push(node);
      } else {
        matchingNodes.push(node);
        if (!node.children) {
          continue;
        }
        const childMatchingNodes = findMatchingNodes(
          remainingCrumbs,
          node.children
        );
        if (!childMatchingNodes) {
          continue;
        }
        matchingNodes.push(...childMatchingNodes);
      }
    }
  }

  return matchingNodes;
}

function extendBreadcrumbWithSeoPath(
  breadcrumb: Breadcrumb[],
  matchingNodes: StoreNavigationElement[]
): Breadcrumb[] {
  const extendedBreadcrumb: Breadcrumb[] = [...breadcrumb];

  for (let i = 0; i < extendedBreadcrumb.length; i++) {
    const breadcrumbItem = extendedBreadcrumb[i];
    for (const matchingNode of matchingNodes) {
      if (
        matchingNode.name === breadcrumbItem.name &&
        matchingNode.seoUrls?.[0]?.seoPathInfo
      ) {
        // @ToDo: How to know which seoPathInfo is the main one to push?
        breadcrumbItem.path = "/" + matchingNode.seoUrls?.[0]?.seoPathInfo;
        break;
      }
    }
  }

  return extendedBreadcrumb;
}
