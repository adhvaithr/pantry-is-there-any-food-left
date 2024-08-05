// page.js

import { useState, useEffect } from "react";
import { firestore, auth } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import AddItemModal from "../components/AddItemModal";
import SearchBar from "../components/Searchbar";
import InventoryTable from "../components/InventoryTable";
import UpdateItemModal from "../components/UpdateItemModal";
import { Box, Typography, TextField, Button, Modal } from "@mui/material";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        updateInventory(user.uid);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const updateInventory = async (userId) => {
    const userInventoryRef = collection(firestore, `users/${userId}/inventory`);
    const snapshot = await getDocs(userInventoryRef);
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({ name: doc.id,...doc.data() });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const userId = currentUser.uid;
    const userInventoryRef = collection(firestore, `users/${userId}/inventory`);
    const docRef = doc(userInventoryRef, item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory(userId);
  };

  const removeItem = async (item) => {
    const userId = currentUser.uid;
    const userInventoryRef = collection(firestore, `users/${userId}/inventory`);
    const docRef = doc(userInventoryRef, item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory(userId);
  };

  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState({});

  const handleEditItem = async (itemName) => {
    const userId = currentUser.uid;
    const userInventoryRef = collection(firestore, `users/${userId}/inventory`);
    const docRef = doc(userInventoryRef, itemName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setEditingItem({ name: docSnap.id,...docSnap.data() });
      setEditOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleEditSubmit = async () => {
    if (currentUser) {
      const { name, quantity } = editingItem;
      const userId = currentUser.uid;
      const userInventoryRef = collection(firestore, `users/${userId}/inventory`);
      const docRef = doc(userInventoryRef, name);
      await setDoc(docRef, { quantity });
      await updateInventory(userId);
      handleEditClose();
    }
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
      {currentUser? (
        <Box>
        <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
          Welcome, {currentUser.displayName}!
        </Typography>
        <Button
          variant="contained"
          justifycontent="center"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    ) : (
      <Button
        variant="contained"
        justifycontent="center"
        onClick={handleGoogleLogin}
      >
        Login with Google
      </Button>
    )}
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
         