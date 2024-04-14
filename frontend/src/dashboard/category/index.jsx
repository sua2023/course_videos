import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  InputLabel,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createCategory } from "../../service/categoryService";
import moment from "moment";
import DialogDelete from "../../components/DialogDelete";
import { deleteFunction } from "../../service/delete";

function Index() {
  const [category, setCategory] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [id, setId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = "POST";
    const UpdateMethod = "PUT";
    const url = "http://localhost:5000/api/category";
    const UpdateURL = `http://localhost:5000/api/category/${id}`;
    const result = await createCategory(
      category,
      id ? UpdateMethod : method,
      id ? UpdateURL : url
    );
    if (result.status == 200) {
      toast.success(result.message);
      setCategory("");
      fetcCatoryhData();
      setId("");
    }
    if (result.status == 400) {
      toast.error(result.message);
    }
  };

  const fetcCatoryhData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/category", {
        headers: {
          method: "get",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setData(jsonData.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetcCatoryhData();
  }, []);
  const columns = ["ID", "Category", "Date", "Action"];


  const handleDelete = async () => {
    const url = "http://localhost:5000/api/category";
    const result = await deleteFunction({ id, url });
    console.log(result);
    if (result.status == 200) {
      fetcCatoryhData();
      handleDeleteClose();
      setId("");
      toast.success(result.message);
    }
  };
  return (
    <div>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} md={6}>
          <Card component="form" onSubmit={handleSubmit}>
            <CardContent sx={{ mt: 5 }}>
              <InputLabel>Category</InputLabel>
              <TextField
                required
                fullWidth
                variant="outlined"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </CardContent>
            <CardActions sx={{ mb: 5, ml: 1 }}>
              <Button variant="contained" type="submit" color="success">
                {id ? "Edit" : "Create"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
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
                  {data
                    .filter((row) => {
                      if (row === "") {
                        return row;
                      } else if (
                        row.name.toLowerCase().includes(search.toLowerCase())
                      ) {
                        return row;
                      }
                    })
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.name}</TableCell>

                          <TableCell>{moment(row.date).format("ll")}</TableCell>
                          <TableCell>
                            <IconButton
                              color="success"
                              onClick={() => {
                                setCategory(row.name);
                                setId(row.id);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => {
                                setId(row.id);
                                setOpenDelete(true);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <DialogDelete
        open={openDelete}
        handleClose={handleDeleteClose}
        handleSubmit={handleDelete}
      />
    </div>
  );
}

export default Index;
