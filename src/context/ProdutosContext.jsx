import { createContext, useContext, useRef, useState } from "react"
import { apiUrl } from "../config/api.js"

const ProdutosContext = createContext(null)

export function ProdutosProvider({ children }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const carregado = useRef(false) // flag — não é estado, não re-renderiza

    async function carregarProdutos() {
        if (carregado.current) return // já tem dados, ignora

        setLoading(true)
        try {
            const response = await fetch(apiUrl('/produtos'))
            const json = await response.json()
            setData(json)
            carregado.current = true
        } finally {
            setLoading(false)
        }
    }

    function invalidarCache() {
        carregado.current = false // força nova requisição na próxima visita
    }

    return (
        <ProdutosContext.Provider value={{ data, loading, carregarProdutos, invalidarCache }}>
            {children}
        </ProdutosContext.Provider>
    )
}

export function useProdutos() {
    return useContext(ProdutosContext)
}