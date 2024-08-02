import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import Loader from "../components/Loader";
import { useMyOrdersQuery } from "../redux/api/order.api";
import { RootState } from "../redux/store";
import { CustomError } from "../types/api.types";

type DataType = {
   _id: string;
   amount: number;
   quantity: number;
   discount: number;
   status: ReactElement;
   action: ReactElement;
};

const columns: Column<DataType>[] = [
   {
      Header: "ID",
      accessor: "_id",
   },
   {
      Header: "Quantity",
      accessor: "quantity",
   },
   {
      Header: "Discount",
      accessor: "discount",
   },
   {
      Header: "Status",
      accessor: "status",
   },
   {
      Header: "Action",
      accessor: "action",
   },
];

export default function Orders() {
   const { user } = useSelector((state: RootState) => state.userReducer);

   const { isLoading, data, isError, error } = useMyOrdersQuery(
      (user ?? {})._id!
   );

   const [rows, setRows] = useState<DataType[]>([]);

   useEffect(() => {
      if (data) {
         setRows(
            data.orders.map((i) => ({
               _id: i._id,
               quantity: i.orderItems.length,
               discount: i.discount,
               amount: i.total,
               status: (
                  <span>
                     <span
                        className={
                           i.status === "Processing"
                              ? "red"
                              : i.status === "Shipped"
                              ? "green"
                              : "purple"
                        }
                     >
                        {i.status}
                     </span>
                  </span>
               ),
               action: <Link to={`/orders/details/${i._id}`}>View</Link>,
            }))
         );
      }
   }, [data]);

   const Table = TableHOC<DataType>(
      columns,
      rows,
      "dashboard-product-box",
      "Orders",
      rows.length > 6
   )();

   if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
   }

   return (
      <div className='container'>
         <h1> My Orders</h1>
         {isLoading ? <Loader /> : Table}
      </div>
   );
}
