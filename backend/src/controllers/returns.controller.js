import { createReturnRequest, getUserReturns, getAllReturns, updateReturnStatus } from "../services/returns.service.js";

export const createReturnController = async (req, res, next) => {
  try {
    const { orderId, items, reason, notes } = req.body;
    const userId = req.user.id;

    const returnRequest = await createReturnRequest({ userId, orderId, items, reason, notes });
    res.status(201).json({ success: true, data: returnRequest });
  } catch (error) {
    next(error);
  }
};

export const getUserReturnsController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const returns = await getUserReturns(userId);
    res.status(200).json({ success: true, data: returns });
  } catch (error) {
    next(error);
  }
};

export const getAdminReturnsController = async (req, res, next) => {
  try {
    const returns = await getAllReturns();
    res.status(200).json({ success: true, data: returns });
  } catch (error) {
    next(error);
  }
};

export const updateReturnStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedReturn = await updateReturnStatus(id, status);
    res.status(200).json({ success: true, data: updatedReturn });
  } catch (error) {
    next(error);
  }
};
