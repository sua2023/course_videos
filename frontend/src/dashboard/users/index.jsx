import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  styled,
} from "@mui/material";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import { toast, ToastContainer } from "react-toastify";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

const Textarea = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  box-sizing: border-box;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 1em;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid gray;

  &:focus {
    outline: 0;
    border-color: gray;
  }
  &:focus-visible {
    outline: 1;
  }
  margin-top: 1px
`
);
export default function Index() {
  const [dataEvents, setDataEvents] = React.useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/user", {
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
    fetchData();
  }, []);

  const columns = [
    "ID",
    "firstname",
    "lastname",
    "username",
    "email",
    "date",
    "action",
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      firstname: dataEvents.firstname,
      lastname: dataEvents.lastname,
      username: dataEvents.username,
      email: dataEvents.email,
      password: dataEvents.password,
      address: dataEvents.address,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/user", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          fetchData();
          handleClose();
          setDataEvents({});
          toast.success(result.message);
        } else if (result.status == 400) {
          toast.warning(result.message);
        }
      })
      .catch((error) => {
        toast.error("Create user failed");
      });
  };

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
              {data.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.firstname}</TableCell>
                    <TableCell>{row.lastname}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{moment(row.created_at).format("ll")}</TableCell>
                    <TableCell>
                      <IconButton color="success">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error">
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
        <DialogTitle>Form create an new user</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Firstname"
            type="text"
            fullWidth
            variant="outlined"
            value={dataEvents.firstname}
            onChange={(e) =>
              setDataEvents({ ...dataEvents, firstname: e.target.value })
            }
          />
          <TextField
            autoFocus
            required
            margin="dense"
            label="Lastname"
            type="text"
            fullWidth
            variant="outlined"
            value={dataEvents.lastname}
            onChange={(e) =>
              setDataEvents({ ...dataEvents, lastname: e.target.value })
            }
          />
          <TextField
            autoFocus
            required
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={dataEvents.username}
            onChange={(e) =>
              setDataEvents({ ...dataEvents, username: e.target.value })
            }
          />
          <TextField
            autoFocus
            required
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={dataEvents.email}
            onChange={(e) =>
              setDataEvents({ ...dataEvents, email: e.target.value })
            }
          />
          <TextField
            autoFocus
            required
            margin="dense"
            label="Password"
            type="password"
            placeholder="*******"
            fullWidth
            variant="outlined"
            value={dataEvents.password}
            onChange={(e) =>
              setDataEvents({ ...dataEvents, password: e.target.value })
            }
          />
          <Box>
            <InputLabel>Address</InputLabel>
            <Textarea
              value={dataEvents.address}
              onChange={(e) =>
                setDataEvents({ ...dataEvents, address: e.target.value })
              }
            />
          </Box>
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
