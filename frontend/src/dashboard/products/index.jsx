import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import moment from "moment";
import Loader from "../../components/Loader";
import {
  createProduct,
  createStockProduct,
  useGetProducts,
} from "../../service/productServie";
import { useGetCategory } from "../../service/categoryService";
import DialogDelete from "../../components/DialogDelete";
import { deleteFunction } from "../../service/delete";

function Home() {
  const { data, loading, error, refreshData } = useGetProducts();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dataEvents, setDataEvents] = useState({ data: {}, action: "" });
  const { data: category } = useGetCategory();
  const [id, setId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setId(user.id);
  }, [open]);
  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
    setDataEvents({ data: {}, action: "" });
  };

  const columns = [
    "ID",
    "Name",
    "Unit",
    "Amount",
    "Price",
    "Category",
    "Date",
    "Actions",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = "POST";
    const updateMethod = "PUT";
    const url = "http://localhost:5000/api/product";
    const updateUrl = `http://localhost:5000/api/product/${dataEvents.data?.id}`;
    const result = await createProduct(
      dataEvents.data,
      id,
      dataEvents.action ? updateMethod : method,
      dataEvents.action ? updateUrl : url
    );
    if (result.status == 200) {
      toast.success(result.message);
      refreshData();
      handleClose();
    }
    if (result.status == 400) {
      toast.error(result.message);
    }
  };

  const handleDelete = async () => {
    const url = "http://localhost:5000/api/product";
    const result = await deleteFunction({ id, url });

    if (result.status == 200 || result.status == 201) {
      refreshData();
      handleDeleteClose();
      setId("");
      toast.success(result.message);
    }
  };
  const handleAddStock = async (e) => {
    e.preventDefault();
    const result = await createStockProduct(dataEvents.data);
    if (result.status == 200) {
      toast.success(result.message);
      refreshData();
      handleClose();
    }
    if (result.status == 400) {
      toast.error(result.message);
    }
  };
  if (loading) return <Loader />;
  if (error) return <Loader />;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpen(true)}
        >
          Create
        </Button>
        <TextField
          variant="standard"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.unit}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>
                        {moment(row.created_at).format("ll")}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setIsOpen(true);
                            setDataEvents((prev) => ({
                              ...prev,
                              data: {
                                id: row.id,
                                name: row.name,
                                unit: row.unit,
                              },
                            }));
                          }}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                        <IconButton
                          color="success"
                          onClick={() => {
                            setOpen(true);
                            setDataEvents({
                              action: "edit",
                              data: row,
                            });
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
      <Dialog
        open={open}
        onClose={handleClose}
        component="form"
        onSubmit={handleSubmit}
      >
        <DialogTitle>
          {dataEvents.action
            ? "Form edit product"
            : "Form create an new product"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Product"
            type="text"
            fullWidth
            variant="outlined"
            value={dataEvents.data.name}
            onChange={(e) =>
              setDataEvents((prevData) => ({
                ...prevData,
                data: {
                  ...prevData.data,
                  name: e.target.value,
                },
              }))
            }
          />
          <TextField
            autoFocus
            required
            margin="dense"
            label="unit"
            type="text"
            fullWidth
            variant="outlined"
            value={dataEvents.data.unit}
            onChange={(e) =>
              setDataEvents((prevData) => ({
                ...prevData,
                data: {
                  ...prevData.data,
                  unit: e.target.value,
                },
              }))
            }
          />
          <TextField
            autoFocus
            required
            margin="dense"
            label="amount"
            type="text"
            fullWidth
            variant="outlined"
            value={dataEvents.data.amount}
            onChange={(e) =>
              setDataEvents((prevData) => ({
                ...prevData,
                data: {
                  ...prevData.data,
                  amount: e.target.value,
                },
              }))
            }
          />
          <TextField
            autoFocus
            margin="dense"
            label="Price"
            type="text"
            fullWidth
            variant="outlined"
            value={dataEvents.data.price}
            onChange={(e) =>
              setDataEvents((prevData) => ({
                ...prevData,
                data: {
                  ...prevData.data,
                  price: e.target.value,
                },
              }))
            }
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Category"
              value={dataEvents.data.category_id}
              onChange={(e) =>
                setDataEvents((prevData) => ({
                  ...prevData,
                  data: {
                    ...prevData.data,
                    category_id: e.target.value,
                  },
                }))
              }
            >
              {category.map((item, index) => (
                <MenuItem value={item.id} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="success">
            {dataEvents.action ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <DialogDelete
        open={openDelete}
        handleClose={handleDeleteClose}
        handleSubmit={handleDelete}
      />

      <Dialog
        open={isOpen}
        onClose={handleClose}
        component="form"
        onSubmit={handleAddStock}
      >
        <DialogTitle>Form create product stock</DialogTitle>
        <DialogContent>
          <InputLabel>Product name</InputLabel>
          <TextField
            margin="dense"
            fullWidth
            variant="outlined"
            value={dataEvents.data.name}
          />
          <InputLabel>Unit</InputLabel>
          <TextField
            margin="dense"
            fullWidth
            variant="outlined"
            value={dataEvents.data.unit}
          />
          <InputLabel>Quantity</InputLabel>
          <TextField
            margin="dense"
            fullWidth
            variant="outlined"
            placeholder="quantity"
            value={dataEvents.data.amount}
            onChange={(e) =>
              setDataEvents((prev) => ({
                ...prev,
                data: { ...prev.data, amount: e.target.value },
              }))
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="success">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default Home;
