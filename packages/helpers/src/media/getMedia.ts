type ProductMedia = {
  id: string;
  fileName: string;
  accessGranted: boolean;
};

/**
 * Prepare media object
 *
 * @param {OrderLineItem} lineItem order item
 *
 * @public
 * @category Media
 */
export function getMedia<
  T extends {
    downloads?: Array<{
      id: string;
      accessGranted: boolean;
      media: {
        fileName: string;
        fileExtension: string;
      };
    }>;
  },
>(lineItem: T) {
  return (
    lineItem?.downloads?.reduce((acc: ProductMedia[], current) => {
      acc.push({
        id: current.id,
        fileName: `${current.media.fileName}.${current.media.fileExtension}`,
        accessGranted: current.accessGranted,
      });
      return acc;
    }, []) || []
  );
}
