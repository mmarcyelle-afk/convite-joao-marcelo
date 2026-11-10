# Convite interativo — João Marcelo (1 ano) 🏁

Site do convite para o 1º aniversário do João Marcelo, pronto para enviar por link no WhatsApp.

## Arquivos
- `index.html` — estrutura do site
- `style.css` — visual (cores, animações, layout)
- `script.js` — contagem regressiva, abrir convite, RSVP, confete
- `apps-script.gs` — código para colar no Google Apps Script
- `assets/` — imagens usadas no site

**Nada foi publicado ainda.** Siga os passos abaixo e só publique quando estiver tudo aprovado.

---

## Passo 1 — Planilha do Google ✅ já criada

A planilha **"RSVP João Marcelo - 1 ano"** já foi criada na sua conta Google, com a aba
**Confirmações** e o cabeçalho pronto (Data/Hora, Nome, Acompanhantes, Total de pessoas, Status):

👉 https://docs.google.com/spreadsheets/d/1ndg7bUbfD1hkmVENUOZERReZCgncJSiX1Ha3b0RdKww/edit

## Passo 2 — Criar o Apps Script

1. Na planilha, vá em **Extensões → Apps Script**.
2. Apague o conteúdo de exemplo e cole o conteúdo do arquivo [`apps-script.gs`](apps-script.gs) deste projeto.
3. Clique em **Salvar** (ícone de disquete).

## Passo 3 — Publicar como Web App

1. No Apps Script, clique em **Implantar → Nova implantação**.
2. Em "Selecionar tipo", clique na engrenagem e escolha **App da Web**.
3. Configure:
   - **Executar como:** Eu (sua conta)
   - **Quem pode acessar:** Qualquer pessoa
4. Clique em **Implantar**.
5. O Google vai pedir para você **autorizar o script** (é a sua própria conta autorizando o seu próprio script — normal e seguro). Clique em **Autorizar acesso**, escolha sua conta, e se aparecer aviso de "app não verificado" clique em **Acessar (nome do projeto)** → **Permitir**.
6. Copie a **URL do app da Web** que aparece (algo como `https://script.google.com/macros/s/AKfycb.../exec`).

## Passo 4 — Conectar o site à planilha ✅ feito

O `script.js` já está apontando para a sua Web App:
`https://script.google.com/macros/s/AKfycbxRsuMi1WLzexuDWg1Ia_tMnzlatwbzPRGXfHCleDimgKaP5qwB-Mi7jL_u3FIjFOP3/exec`

**Importante:** a implantação precisa estar com "Quem pode acessar" = **Qualquer pessoa** (não "Qualquer pessoa na egresso.ufg.br"), senão convidados sem conta institucional não conseguem confirmar presença. Isso já foi corrigido e testado.

## Passo 5 — Testar ✅ feito

Testei o envio real pelo site e a resposta chegou certinho na planilha (linha de teste já removida).

---

## Publicação (hospedagem)

Combinado: **GitHub Pages**. Quando você aprovar o site:

1. Você cria um repositório no GitHub (ex: `convite-joao-marcelo`).
2. Eu te mostro como subir estes arquivos (ou você mesma arrasta os arquivos pela interface do GitHub).
3. Em **Settings → Pages**, ativa o GitHub Pages apontando para a branch principal.
4. O link final fica algo como `https://seu-usuario.github.io/convite-joao-marcelo/`.

**Nada será publicado sem sua autorização explícita.**
