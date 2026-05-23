export const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  mobile: user.mobile,
  avatar: user.avatar,
  role: user.role,
  authProvider: user.authProvider,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const generateOtpCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const calculateCartTotals = (items = [], deliveryFee = 0) => {
  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = Number((itemsTotal * 0.05).toFixed(2));
  const grandTotal = Number((itemsTotal + taxAmount + deliveryFee).toFixed(2));

  return {
    itemsTotal,
    deliveryFee,
    taxAmount,
    grandTotal,
  };
};
