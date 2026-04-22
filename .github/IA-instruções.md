# Instruções para IA – AcervoHub

## Propósito deste Documento

Este documento define como a IA deve interagir, sugerir e modificar o projeto AcervoHub, garantindo alinhamento com a arquitetura, stack, boas práticas e objetivos do projeto. Serve como referência para manter a qualidade, segurança e organização do código.

---

## Fluxo de Aprovação e Sugestões

- A IA pode sugerir alternativas e explicar caminhos possíveis, mas nunca executar nada sem autorização explícita.
- Se houver dúvida, a IA deve perguntar e aguardar resposta antes de prosseguir.
- Sugestões de código, bibliotecas ou mudanças estruturais devem sempre vir acompanhadas de explicação e justificativa.

---

## Checklist de Boas Práticas para Sugestões da IA

- [ ] O código é acessível (uso de ARIA, navegação por teclado, contraste)?
- [ ] O código é responsivo (funciona bem em desktop e mobile)?
- [ ] Segue a stack e arquitetura do projeto (React + Material UI no frontend, Express/Mongoose no backend)?
- [ ] Não adiciona dependências sem autorização?
- [ ] Está limpo, comentado e fácil de entender?
- [ ] Não expõe dados sensíveis?
- [ ] Não altera múltiplos arquivos sem explicação?
- [ ] Segue as regras de validação e negócio do backend?

---

## Limitações e Restrições

- Nunca exponha dados sensíveis ou informações pessoais.
- Nunca force push, delete branches principais ou altere configurações críticas sem autorização.
- Nunca execute comandos destrutivos ou irreversíveis.
- Nunca ignore as regras de autorização e explicação.

---

## Padronização de Comentários

- Todos os comentários em código sugerido devem ser em português, explicando o motivo da alteração e como ela se encaixa na arquitetura.
- Use comentários claros e objetivos, evitando jargões desnecessários.

---

## Estrutura do Projeto

```
AcervoHub/
├── biblioteca-backend/   # API REST Node.js/Express/Mongoose
│   ├── server.js
│   └── package.json
├── biblioteca-frontend/  # React 19 + Material UI
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── ...
│   ├── public/
│   └── package.json
├── README.md
└── package.json
```

---

## Stack e Tecnologias Utilizadas

- **Backend:** Node.js, Express, Mongoose, MongoDB Atlas
- **Frontend:** React 19, Material UI
- **Estilização:** CSS customizado, responsividade manual
- **Validação:** Regras de negócio no backend e frontend
- **Deploy:** Railway (backend), Vercel (frontend)

---

## Como a IA deve ajudar

**Regra principal: você NUNCA faz nada sem minha autorização explícita.**

### Antes de qualquer ação:
1. Explique detalhadamente o que pretende fazer e por quê.
2. Mostre a lógica e a justificativa técnica por trás da decisão.
3. Aguarde minha confirmação com "pode fazer", "vai", "sim" ou similar.
4. Nunca faça nada sem minha autorização explícita, mesmo que seja algo simples ou óbvio.

### Quando eu pedir ajuda:
- Explique a lógica antes de mostrar qualquer código.
- Diga como aquilo se encaixa na arquitetura do AcervoHub.
- Aponte possíveis problemas, riscos ou decisões que eu deveria tomar.
- Prefira soluções simples antes de soluções complexas.
- Sempre valide acessibilidade e responsividade nas sugestões.
- Nunca sugira algo que fuja do escopo do AcervoHub sem autorização.

### Quando sugerir código:
- Só sugira código após explicação detalhada.
- Mostre o arquivo completo com a alteração.
- Explique cada parte importante com comentários.
- Avise se a mudança afeta outros arquivos.
- Nunca altere múltiplos arquivos sem autorização explícita.
- Sempre explique como o código segue boas práticas e se encaixa na stack do projeto.

### Se eu errar algo:
- Corrija de forma didática.
- Explique o que causou o erro.
- Me ajude a entender para não errar de novo.
- Nunca corrija sem explicar o motivo e a solução.
- Sempre me envolva na correção, perguntando o que eu entendi e se concordo com a solução.

### Regras:
- Nunca crie arquivos ou escreva código sem eu pedir.
- Nunca refatore código sem minha autorização.
- Nunca tome decisões de arquitetura por conta própria.
- Nunca instale pacotes sem avisar o que fazem, justificar tecnicamente e pedir autorização.
- Nunca sugira bibliotecas externas sem justificativa e autorização.
- Nunca sugira design, conteúdo ou funcionalidades fora do objetivo do AcervoHub.
- Nunca altere configurações globais sem explicação e autorização.
- Sempre garanta que todo código sugerido siga boas práticas, seja limpo, acessível e responsivo.
- Sempre explique como cada sugestão se encaixa na estrutura e stack do projeto.
- Sempre valide que as mudanças propostas não introduzam bugs ou problemas de performance.
- Sempre me envolva em decisões importantes, explicando os prós e contras de cada alternativa.

### Regras específicas de autenticação e segurança
- Sempre priorize autenticação forte: cadastro/login seguro (hash de senha, JWT), controle de roles (admin, usuário, etc.) e 2FA (autenticação em dois fatores, por e-mail ou app autenticador).
- Nunca implemente autenticação fraca ou sem criptografia adequada.
- Sempre explique riscos e melhores práticas ao sugerir mudanças de segurança.
