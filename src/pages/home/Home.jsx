import Menu from "../../componentes/menu/Menu.jsx"
import Cards from "../../componentes/cards/Cards.jsx"
import Footer from "../../componentes/rodape/Footer.jsx"
import { useEffect, useState } from "react"
import {useProdutos} from "../../context/ProdutosContext.jsx"

import './home.css'

function Home(){
    const { data, loading, carregarProdutos } = useProdutos()
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas")

    useEffect(() => {
        carregarProdutos()
    }, [])

    const categorias = [
        ...new Set(
            data.flatMap((produto) =>
                produto.categorias?.filter(Boolean) || []
            )
        )
    ].sort((a, b) => a.localeCompare(b))

    const produtosFiltrados = (
        categoriaSelecionada === "todas"
            ? data
            : data.filter((produto) =>
                produto.categorias?.includes(categoriaSelecionada)
            )
    ).slice().sort((a, b) => (a.ordem ?? Infinity) - (b.ordem ?? Infinity))

    const abrirWhatsApp = () => {
        const url = `https://api.whatsapp.com/send/?phone=5541995264057&text=${encodeURIComponent("Olá! Gostaria de mais informações sobre os produtos.")}&type=phone_number&app_absent=0`
        window.open(url, "_blank")
    }

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

            {/* Botão flutuante WhatsApp */}
            <button
                className="whatsapp-fab"
                onClick={abrirWhatsApp}
                aria-label="Entrar em contato pelo WhatsApp"
            >
                <span className="whatsapp-fab__pulse" aria-hidden="true" />
                <svg
                    className="whatsapp-fab__icon"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        d="M27.36 4.64A15.9 15.9 0 0 0 16 0C7.16 0 0 7.16 0 16c0 2.82.74 5.56 2.14 7.98L0 32l8.26-2.16A15.97 15.97 0 0 0 16 32c8.84 0 16-7.16 16-16 0-4.28-1.66-8.3-4.64-11.36zM16 29.33c-2.46 0-4.88-.66-6.98-1.9l-.5-.3-5.18 1.36 1.38-5.02-.32-.52A13.27 13.27 0 0 1 2.67 16C2.67 8.64 8.64 2.67 16 2.67c3.56 0 6.9 1.38 9.42 3.9a13.27 13.27 0 0 1 3.9 9.42c0 7.37-5.97 13.34-13.32 13.34zm7.32-9.96c-.4-.2-2.36-1.16-2.72-1.3-.36-.13-.63-.2-.9.2-.27.4-1.03 1.3-1.26 1.56-.23.27-.46.3-.87.1-.4-.2-1.68-.62-3.2-1.96-1.18-1.06-1.98-2.36-2.22-2.76-.22-.4-.02-.62.18-.82.17-.17.4-.46.6-.7.2-.22.26-.4.4-.66.13-.27.07-.5-.03-.7-.1-.2-.9-2.18-1.24-2.98-.32-.79-.65-.68-.9-.7-.24-.01-.5-.01-.76-.01-.27 0-.7.1-1.06.5-.36.4-1.38 1.36-1.38 3.3 0 1.96 1.42 3.84 1.62 4.1.2.26 2.8 4.28 6.78 5.98.94.42 1.68.66 2.26.84.95.3 1.82.26 2.5.16.76-.12 2.36-.96 2.7-1.9.33-.93.33-1.72.23-1.9-.1-.17-.36-.27-.76-.46z"
                        fill="white"
                    />
                </svg>
                <span className="whatsapp-fab__label">Fale conosco</span>
            </button>
        </div>
    )
}

export default Home