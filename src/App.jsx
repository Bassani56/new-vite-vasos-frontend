import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import './App.css'
import Home from "./pages/home/Home.jsx";
import Produtos from "./pages/produtos/Produtos.jsx";
import Carrinho from "./pages/carrinho/Carrinho.jsx";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/produtos/:id" element={ <Produtos/> }/>
        <Route path="/carrinho" element={<Carrinho/>}/>
        <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />

      </Routes>
    </>
  )
}

export default App
