import React, { useContext, useState } from "react";

const OrdersContext = React.createContext();

function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const value = { orders, setOrders };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

const useOrders = () => useContext(OrdersContext);

export { useOrders, OrdersProvider };
