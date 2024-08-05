import { Box, Typography, TextField, Button, Modal, Stack } from "@mui/material";

export default function UpdateItemModal({
  open,
  handleClose,
  editingItem,
  setEditingItem,
  handleEditSubmit,
}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          margin: "1rem",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit Item
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            label="Item Name"
            value={editingItem.name}
            onChange={(e) =>
              setEditingItem({ ...editingItem, name: e.target.value })
            }
          />
          <TextField
            label="Quantity"
            type="number"
            value={editingItem.quantity}
            onChange={(e) =>
              setEditingItem({
                ...editingItem,
                quantity: parseInt(e.target.value),
              })
            }
          />
        </Typography>
        <Button variant="contained" onClick={handleEditSubmit}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
}