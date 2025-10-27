const { getUserByEmail, getBalanceByID } = require("../../utils/user_utils");

module.exports = {
  TransferMony: async (req, res) => {
    const { email, amount } = req.body;
    const Sender = req.user;
    const SenderBalance = req.balance;
    try {
      const Reciver = await getUserByEmail(email);

      if (!Reciver) {
        return res.status(404).json({ message: "Receiver not found" });
      }

      const ReciverBalance = await getBalanceByID(Reciver._id);

      const SenderTransactions = SenderBalance.Transactions;
      const ReciverTransactions = ReciverBalance.Transactions;

      SenderTransactions.push(-amount);
      ReciverTransactions.push(amount);

      SenderBalance.Balance -= Number(amount);
      SenderBalance.Transactions = SenderTransactions;
      const saveSender = SenderBalance.save();

      ReciverBalance.Balance += Number(amount);
      ReciverBalance.Transactions = ReciverTransactions;
      const saveReceiver = ReciverBalance.save();

      await Promise.all([saveReceiver, saveSender]);

      res.status(200).json({
        message: "Transfer successful",
      });
    } catch (err) {
      console.error(err);
      res.status(404).json({ message: "Not Found" });
    }
  },
};
