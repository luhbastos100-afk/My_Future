"use strict";

(() => {
  const routes = [
    { label: "Orientação inicial", href: "index.html#orientacao", terms: ["inicio", "orientacao", "sobre", "home", "caminho", "possibilidade"] },
    { label: "Mercado de trabalho", href: "mercado-de-trabalho.html#mercado", terms: ["mercado", "trabalho", "emprego", "jovem aprendiz", "carreira"] },
    { label: "Documentos e currículo", href: "mercado-de-trabalho.html#documentos", terms: ["documento", "curriculo", "cv", "carteira", "documentacao"] },
    { label: "Busca de vagas", href: "mercado-de-trabalho.html#vagas", terms: ["vaga", "vagas", "procurar emprego", "contratacao"] },
    { label: "Entrevistas", href: "mercado-de-trabalho.html#entrevistas", terms: ["entrevista", "entrevistas", "selecao", "processo seletivo"] },
    { label: "Concursos públicos", href: "concurso-publico.html#concurso", terms: ["concurso", "concursos", "edital", "servico publico", "servidor"] },
    { label: "Curso técnico", href: "curso-tecnico.html#curso", terms: ["curso tecnico", "tecnico", "formacao tecnica", "qualificacao", "modalidades"] },
    { label: "Ensino superior", href: "curso-superior.html#ensino", terms: ["ensino superior", "faculdade", "universidade", "graduacao", "enem", "vestibular", "bolsa", "cursinho"] },
    { label: "Empreendedorismo", href: "empreendedorismo.html#inicio", terms: ["empreendedorismo", "empreender", "negocio", "empresa", "empreendedor"] }
  ];

  const normalize = (value) => value.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const widget = document.createElement("aside");
  widget.className = "mf-assistant";
  widget.innerHTML = `
    <section class="mf-chat-panel" id="mf-chat-panel" aria-label="Assistente virtual de navegação" hidden>
      <header class="mf-chat-header">
        <div class="mf-chat-heading"><strong>Assistente My Future</strong><span>Ajuda rápida para navegar</span></div>
        <button class="mf-chat-close" type="button" aria-label="Fechar assistente">×</button>
      </header>
      <div class="mf-chat-content">
        <p class="mf-chat-message">Olá! Posso indicar a página ou seção certa. O que você está procurando?</p>
        <div class="mf-chat-suggestions" aria-label="Sugestões">
          <button class="mf-chat-suggestion" type="button" data-query="vagas de emprego">Vagas</button>
          <button class="mf-chat-suggestion" type="button" data-query="concurso público">Concursos</button>
          <button class="mf-chat-suggestion" type="button" data-query="faculdade e vestibular">Faculdade</button>
        </div>
        <form class="mf-chat-form" role="search">
          <input class="mf-chat-input" type="search" name="q" placeholder="Ex.: currículo ou curso técnico" autocomplete="off" aria-label="Digite o assunto que procura">
          <button type="submit" aria-label="Buscar conteúdo"><span aria-hidden="true">➜</span></button>
        </form>
        <div class="mf-chat-results" aria-live="polite"></div>
        <p class="mf-chat-note">Assistente de navegação local: escolha um assunto para abrir o conteúdo correspondente.</p>
      </div>
    </section>
    <button class="mf-assistant-launcher" type="button" aria-expanded="false" aria-controls="mf-chat-panel">
      <span class="mf-assistant-icon" aria-hidden="true">✦</span><span>Ajuda para navegar</span>
    </button>
  `;
  document.body.append(widget);

  const panel = widget.querySelector("#mf-chat-panel");
  const launcher = widget.querySelector(".mf-assistant-launcher");
  const closeButton = widget.querySelector(".mf-chat-close");
  const form = widget.querySelector(".mf-chat-form");
  const input = widget.querySelector(".mf-chat-input");
  const results = widget.querySelector(".mf-chat-results");

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
    else launcher.focus();
  }

  function showResults(query) {
    const cleanQuery = normalize(query);
    const matching = routes.filter((route) => route.terms.some((term) => cleanQuery.includes(normalize(term))));
    const choices = matching.length ? matching : routes;
    results.replaceChildren();

    const response = document.createElement("p");
    response.className = "mf-chat-message";
    response.textContent = matching.length
      ? "Encontrei estes caminhos para você:"
      : "Não identifiquei esse assunto. Aqui estão os caminhos principais:";
    results.append(response);

    choices.slice(0, 8).forEach((route) => {
      const link = document.createElement("a");
      link.className = "mf-chat-result-link";
      link.href = route.href;
      link.innerHTML = `<span>${route.label}</span><span aria-hidden="true">→</span>`;
      results.append(link);
    });
  }

  launcher.addEventListener("click", () => setOpen(panel.hidden));
  closeButton.addEventListener("click", () => setOpen(false));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) {
      input.focus();
      return;
    }
    showResults(query);
  });

  widget.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.query;
      showResults(input.value);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
})();
