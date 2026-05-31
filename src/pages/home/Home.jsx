import Menu from "../../componentes/menu/Menu.jsx"
import Cards from "../../componentes/cards/Cards.jsx"
import Footer from "../../componentes/rodape/Footer.jsx"
import { useEffect, useState } from "react"
import { apiUrl } from "../../config/api.js"
import './home.css'

function Home(){

    const [data, setData] = useState([])
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas")

    useEffect(() => {
        async function fetchData(){
            const response = await fetch(apiUrl('/produtos'))
            const json = await response.json()
            console.log("Produtos recebidos:", json)
            setData(json)
        }

        fetchData()
    },[])

    const categorias = [
        ...new Set(
            data.flatMap((produto) =>
                produto.categorias?.filter(Boolean) || []
            )
        )
    ].sort((a, b) => a.localeCompare(b))

    const produtosFiltrados =
        categoriaSelecionada === "todas"
            ? data
            : data.filter((produto) =>
                produto.categorias?.includes(categoriaSelecionada)
            )

    return(
        <div className="dashboard-home">
            <header>
                <Menu/>
            </header>

            <section className="apresentacao-produtos">
                <div className="apresentacao-texto">
                    <span className="label-eyebrow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5"/>
                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.3"/>
                        </svg>
                        Produtos
                    </span>
                    <h1>Escolha vasos por categoria</h1>
                    <p>Filtre a vitrine para ver os modelos disponiveis em cada linha.</p>
                </div>

                <label className="categoria-select">
                    <span>Categoria</span>
                    <div className="select-wrapper">
                        <select
                            value={categoriaSelecionada}
                            onChange={(event) => setCategoriaSelecionada(event.target.value)}
                        >
                            <option value="todas">Todas as categorias</option>
                            {categorias.map((categoria) => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                        <svg className="select-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </label>
            </section>

            <section className="container-produtos">
                {produtosFiltrados.map((produto, index) => {
                    return (
                        <div
                            className="card-wrapper"
                            key={produto._id}
                            style={{ '--card-delay': `${index * 60}ms` }}
                        >
                            <Cards
                                titulo={produto.titulo_geral}
                                valor={produto.variantes?.[0]?.preco}
                                diretorio={produto.imagem_geral}
                                produto={produto}
                            />
                        </div>
                    )
                })}

                {produtosFiltrados.length === 0 && (
                    <div className="sem-produtos">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M20 8C13.373 8 8 13.373 8 20C8 26.627 13.373 32 20 32C26.627 32 32 26.627 32 20C32 13.373 26.627 8 20 8Z" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M15 20H25M20 15V25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                        </svg>
                        <p>Nenhum vaso encontrado nessa categoria.</p>
                    </div>
                )}
            </section>

            <footer>
                <Footer/>
            </footer>

        </div>
    )
}

export default Home
