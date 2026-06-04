import { Routes, Route } from "react-router-dom"
import { ProdutosProvider } from "./context/ProdutosContext.jsx"
import Home from "./pages/home/Home.jsx"
import Produtos from "./pages/produtos/Produtos.jsx"
import Carrinho from "./pages/carrinho/Carrinho.jsx"
import './App.css'

function App() {
  return (
    <ProdutosProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos/:id" element={<Produtos />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
      </Routes>
    </ProdutosProvider>
  )
}

export default App