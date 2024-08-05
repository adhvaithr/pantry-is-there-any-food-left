// page.js

"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import AddItemModal from "./components/AddItemModal";
import SearchBar from "./components/Searchbar";
import InventoryTable from "./components/InventoryTable";
import UpdateItemModal from "./components/UpdateItemModal";
import { Box, Typography, TextField, Button, Modal } from "@mui/material";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState({});

  const handleEditItem = async (itemName) => {
    const docRef = doc(collection(firestore, "inventory"), itemName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setEditingItem({ name: docSnap.id, ...docSnap.data() });
      setEditOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleEditSubmit = async () => {
    const { name, quantity } = editingItem;
    const docRef = doc(collection(firestore, "inventory"), name);
    await setDoc(docRef, { quantity });
    await updateInventory();
    handleEditClose();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredInventory(filtered);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      sx={{ backgroundColor: "#f0f0f0" }}
    >
      <AddItemModal
        open={open}
        handleClose={handleClose}
        itemName={itemName}
        setItemName={setItemName}
        addItem={addItem}
      />
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box
        width="800px"
        height="100px"
        bgcolor={"#ADD8E6"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ borderRadius: "10px" }}
      >
        <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
          Pantry Tracker
        </Typography>
      </Box>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />
      <InventoryTable
        inventory={inventory}
        searchTerm={searchTerm}
        filteredInventory={filteredInventory}
        removeItem={removeItem}
        editItem={handleEditItem}
      />
      <UpdateItemModal 
        open={editOpen}
        handleClose={handleEditClose}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        handleEditSubmit={handleEditSubmit}
      />
    </Box>
  );
}
