import { listActiveOffers } from "../services/offer.service.js";

export const listStorefrontOffersController = async (_req, res) => {
  const offers = await listActiveOffers();
  res.status(200).json({ offers });
};
