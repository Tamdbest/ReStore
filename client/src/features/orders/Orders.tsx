import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Order } from "../../app/models/order";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layouts/LoadingComponent";
import ViewOrder from "./ViewOrder";
import { getCurrency } from "../../app/util/util";


export default function Orders(){
    const [orders,setOrders]=useState<Order[]|null>(null);
    const [loading,setLoading]=useState(true)
    const [orderNum,setOrderNum]=useState(0)
    useEffect(()=>{
        agent.Orders.list()
            .then(orders=>setOrders(orders))
            .catch(err=>console.log(err))
            .finally(()=>setLoading(false))
    },[])
    if(loading) 
        return <LoadingComponent message="Loading your orders"/>

    if(orderNum>0)
      return <ViewOrder order={orders![orderNum-1]} goBack={()=>setOrderNum(0)}/>

    return(
    <TableContainer component={Paper} sx={{mb:4}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Order Date</TableCell>
            <TableCell align="right">Order Status</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order) => (
            <TableRow
              key={order.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {order.id}
              </TableCell>
              <TableCell align="right">{getCurrency(order.total)}</TableCell>
              <TableCell align="right">{order.orderDate.split("T")[0]}</TableCell>
              <TableCell align="right">{order.orderStatus}</TableCell>
              <TableCell align="right"><Button onClick={()=>setOrderNum(order.id)}>View</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
}