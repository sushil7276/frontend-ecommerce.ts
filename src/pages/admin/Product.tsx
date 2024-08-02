import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import Loader from "../../components/Loader";
import { CustomError } from "../../types/api.types";

import { useAllProductsQuery } from "../../redux/api/product.api";
import { RootState, server } from "../../redux/store";

interface DataType {
   photo: ReactElement;
   name: string;
   price: number;
   stock: number;
   action: ReactElement;
}

const columns: Column<DataType>[] = [
   {
      Header: "Photo",
      accessor: "photo",
   },
   {
      Header: "Name",
      accessor: "name",
   },
   {
      Header: "Price",
      accessor: "price",
   },
   {
      Header: "Stock",
      accessor: "stock",
   },
   {
      Header: "Action",
      accessor: "action",
   },
];

const Product = () => {
   const { user } = useSelector((state: RootState) => state.userReducer);

   const { isError, isLoading, error, data } = useAllProductsQuery(
      (user ?? {})._id!
   );

   const [rows, setRows] = useState<DataType[]>([]);

   if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
   }

   useEffect(() => {
      if (data)
         setRows(
            data.products.map((i) => ({
               photo: <img src={`${server}/${i.photo}`} />,
               name: i.name,
               price: i.price,
               stock: i.stock,
               action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
            }))
         );
   }, [data]);

   const Table = TableHOC<DataType>(
      columns,
      rows,
      "dashboard-product-box",
      "Products",
      rows.length > 6
   )();

   return (
      <div className='admin-container'>
         <AdminSidebar />
         <main>{isLoading ? <Loader /> : Table}</main>

         <Link to='/admin/product/new' className='create-product-btn'>
            <FaPlus />
         </Link>
      </div>
   );
};

export default Product;
