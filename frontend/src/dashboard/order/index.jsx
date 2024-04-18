import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetProducts } from "../../service/productServie";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
function Index() {
  const { data, refreshData } = useGetProducts();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const loading = open && options.length === 0;
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
  }, [loading]);

  const calculateTotal = (options) => {
    let total = 0;
    options.forEach((option) => {
      total += option.price * option.quantity;
    });
    return total;
  };
  const handleRemove = (indexRow) => {
    const updateRows = options.filter((_, index) => index !== indexRow);
    const price = options[indexRow].price;
    const quantity = options[indexRow].quantity;
    setTotalPrice(totalPrice - price * quantity);
    setOptions(updateRows);
  };
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <InputLabel>Choose product</InputLabel>
          <Autocomplete
            id="asynchronous-demo"
            fullWidth
            size="small"
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={data}
            loading={loading}
            onChange={(e, value) => {
              const isExits = options.findIndex(
                (option) => option.name === value.name
              );
              if (isExits === -1) {
                value.quantity = 1;
                value.total = value.price;
                const newData = [...options, value];
                const total = calculateTotal(newData);
                setTotalPrice(total);
                setOptions(newData);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
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
        <Grid item md={8} sx={12}>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total price</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {options.map((row, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            sx={{ width: "80px" }}
                            defaultValue={1}
                            value={row.quantity}
                            onChange={(e) => {
                              const newQuantity = e.target.value;
                              if (options[index]) {
                                const updatedOptions = [...options];
                                updatedOptions[index].quantity = newQuantity;
                                updatedOptions[index].total =
                                  row.price * newQuantity;
                                const total = calculateTotal(updatedOptions);
                                setTotalPrice(total);
                                setOptions(updatedOptions);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>{row.price}</TableCell>
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
        <Grid
          item
          md={4}
          xs={12}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box>
            <Typography>Sub total:{totalPrice}</Typography>
            <Typography>Promotion: 0%</Typography>
            <Typography>Total:{totalPrice}</Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default Index;
