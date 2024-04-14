/* eslint-disable no-undef */
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  IconButton,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { useGetProducts } from "../../service/productServie";
import { toast } from "react-toastify";

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function Index() {
  const { data } = useGetProducts();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && data.length === 0;
  const [totalPrice, setTotalPrice] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    (async () => {
      await sleep(1e3);

      if (active) {
        setOptions([...options]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleRemove = (indexToRemove) => {
    const updatedRows = options.filter((_, index) => index !== indexToRemove);
    const price = options[indexToRemove].price;
    const quantity = options[indexToRemove].quantity;
    setTotalPrice(totalPrice - price * quantity);
    setOptions(updatedRows);
  };

  const calculateTotal = (options) => {
    let total = 0;
    options.forEach((option) => {
      total += option.price * option.quantity;
    });
    return total;
  };

  return (
    <div>
      <Box sx={{ mt: 5 }}>
        <Typography sx={{ mb: 3 }} component="h3">
          Form create order
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <InputLabel>Choose product</InputLabel>
            <Autocomplete
              size="small"
              fullWidth
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              getOptionLabel={(option) => option.name}
              options={data}
              onChange={(event, value) => {
                if (value) {
                  const existingOptionIndex = options.findIndex(
                    (option) => option.name === value.name
                  );

                  if (existingOptionIndex === -1) {
                    value.quantity = 1;
                    value.total = value.price;
                    const newOptions = [...options, value];
                    const total = calculateTotal(newOptions);
                    setTotalPrice(total);
                    setOptions((prev) => [...prev, value]);
                  }
                }
              }}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          {options?.length > 0 && (
            <Grid item xs={12} md={8}>
              <Paper sx={{ width: "100%", overflow: "hidden", mt: 5 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {options.map((row, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.unit}</TableCell>
                            <TableCell>{row.price}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                variant="outlined"
                                size="small"
                                value={row.quantity}
                                sx={{ maxWidth: "80px" }}
                                defaultValue={1}
                                onChange={(e) => {
                                  const newQuantity = e.target.value;
                                  if (options[index]) {
                                    const updatedOptions = [...options];
                                    updatedOptions[index].quantity =
                                      newQuantity;
                                    updatedOptions[index].total =
                                      row.price * newQuantity;
                                    const total =
                                      calculateTotal(updatedOptions);
                                    setTotalPrice(total);
                                    setOptions(updatedOptions);
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>{row.total}</TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleRemove(index)}>
                                <CloseIcon />
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
          )}
          <Grid md={4} xs={8}>
            <Box sx={{ display: "grid", justifyContent: "center" }}>
              <Typography variant="body" component="p" sx={{ marginBottom: 1 }}>
                Sub amount: {totalPrice}
              </Typography>
              <Typography variant="body" component="p" sx={{ marginBottom: 1 }}>
                Promotion: 0%
              </Typography>
              <Typography variant="body" component="p">
                Total amount: {totalPrice}
              </Typography>
            </Box>
          </Grid>
          <Box sx={{ ml: 2, mt: 2 }}>
            <Button variant="contained" color="success">
              Paid
            </Button>
          </Box>
        </Grid>
      </Box>
    </div>
  );
}
