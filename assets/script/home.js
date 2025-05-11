document.addEventListener("DOMContentLoaded", function () {
    // Botão "Começar" leva para ofp.html
    document.querySelector("#banner .normal").addEventListener("click", function () {
        window.location.href = "ofp.html";
    });

    // Clicar em "AxFL" rola para a seção "Como Funciona"
    document.querySelector("#banner h4").addEventListener("click", function () {
        document.querySelector("#como-funciona").scrollIntoView({ behavior: "smooth" });
    });

    // Botão "Donate" leva para uma página de doação
    document.querySelector("#Donate").addEventListener("click", function () {
        window.open("https://go.tribopay.com.br/oggknjvech", "_blank"); // abre em nova aba
    });
});
