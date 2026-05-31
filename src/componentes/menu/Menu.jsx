import { useState } from "react";
import { Link } from "react-router-dom";

import './menu.css'
import Icon from "../rodape/icon/Icon";

function Menu() {
    const [open, setOpen] = useState(false);
    const [contatoOpen, setContatoOpen] = useState(false);

    function fecharMenu() {
        setOpen(false);
        setContatoOpen(false);
    }

    return (
        <>
            <div className='container-header' id="menu">
                <div className='center-container-header'>

                    <Link className='logo' to='/'>
                        <img src="/logo2.webp" alt="Casa do Oleiro Logo" />
                    </Link>

                    {/* botão hamburguer */}
                    <button
                        className="menu-toggle"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? '✕' : '☰'}
                    </button>

                    <nav className={`nav-links ${open ? 'active' : ''}`}>

                        <a
                            href="https://track.casadooleiroo.com.br/r/casadooleiroo14"
                            onClick={fecharMenu}
                        >
                            Instagram
                        </a>

                        <div className='nav-item-contato'>
                            <button
                                className="btn-contato"
                                onClick={() => setContatoOpen(!contatoOpen)}
                            >
                                Contato

                                <Icon
                                    name="chevronDown"
                                    className={`arrow-icon ${contatoOpen ? "rotated" : ""}`}
                                />
                            </button>

                            <div className={`contato-menu ${contatoOpen ? 'active' : ''}`}>

                                <a
                                    href="https://track.casadooleiroo.com.br/r/informacoes-whatsapp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={fecharMenu}
                                    className="contato_item"
                                >
                                    <Icon name="whatsapp" />
                                    <span>WhatsApp</span>
                                </a>

                                <a
                                    href="https://track.casadooleiroo.com.br/r/casadooleiroo14"
                                    onClick={fecharMenu}
                                    className="contato_item"
                                >
                                    <Icon name="mail" />
                                    <span>Email</span>
                                </a>

                            </div>
                        </div>

                        <Link
                            to='/carrinho'
                            className="cart mobile-cart"
                            onClick={fecharMenu}
                        >
                            <img src="/carrinho.webp" alt="" />
                            {/* <span>Carrinho</span> */}
                        </Link>

                    </nav>

                    {/* carrinho desktop */}
                    {/* <Link to='/carrinho' className="cart desktop-cart">
                        <img src="/carrinho.webp" alt="" />
                    </Link> */}

                </div>
            </div>

            {/* overlay */}
            {open && (
                <div
                    className="menu-overlay"
                    onClick={fecharMenu}
                />
            )}
        </>
    )
}

export default Menu