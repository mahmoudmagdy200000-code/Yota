export type Review = {
  name: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Optional photo in /public, e.g. "/reviews/mona.jpg". Initials are shown when missing. */
  avatar?: string;
};

// Add real customer reviews here (with the customer's permission).
// The "Customer Reviews" carousel on the home page stays hidden while this list is empty.
export const reviews: Review[] = [];
