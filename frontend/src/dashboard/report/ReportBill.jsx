import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useGetByReport } from "../../service/report";
export default function Index() {
  const { id } = useParams();
  const { data } = useGetByReport(id);
  const columns = ["ID", "Order No","Quantity", "Unit", "Price", "Date"];
  console.log(data);
  return (
    <div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "100vh" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={index}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.order_no}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{moment(row.created_at).format("ll")}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell align="right">1000</TableCell>
              </TableRow>
            
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
