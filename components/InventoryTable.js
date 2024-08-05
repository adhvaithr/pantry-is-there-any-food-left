// components/InventoryTable.js

import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button } from "@mui/material";

export default function InventoryTable({ inventory, searchTerm, filteredInventory, removeItem, editItem }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchTerm === ""
           ? inventory.map((item) => (
                <TableRow
                  key={item.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => removeItem(item.name)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => editItem(item.name)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : filteredInventory.map((item) => (
                <TableRow
                  key={item.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => removeItem(item.name)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => editItem(item.name)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}