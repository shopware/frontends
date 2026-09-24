type ListingFilter = {
  name: string;
  options: Array<{
    id: string;
    name: string;
  }>;
};

const ColorFilter: ListingFilter = {
  name: "Color",
  // other properties omitted
  options: [
    {
      id: "yellow-id",
      name: "Yellow",
      // other props omitted
    },
    {
      id: "green-id",
      name: "Gellow",
      // other props omitted
    },
  ],
};
