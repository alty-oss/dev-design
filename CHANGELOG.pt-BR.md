# Changelog

[English](CHANGELOG.md)

## 0.1.0 — migração Alty, publicação pendente

- Endereço canônico `alty-oss/dev-design`, com histórico novo.
- Pacote e executável npm `dev-design` para instalação com `npx dev-design`.
- Interface compartilhada entre npm e ZIP, com diagnóstico, simulação, substituição, backup e restauração.
- ZIP + checksum SHA-256 preservados como rota verificável.
- Documentação canônica em inglês com versões em português brasileiro.
- Preparação de publicação confiável npm para tags posteriores. Disponibilidade pública e resultados remotos exigem evidências próprias.

Os registros abaixo são anteriores à migração; seus números de versão e observações não comprovam releases no novo repositório.

## Histórico anterior à migração — candidata 0.2.0, não publicada

- Instalador local incluído no pacote: instalação, conferência sem escrita, simulação e substituição com backup/restauração.
- Validação dos arquivos distribuídos antes da instalação, com proteção contra caminhos sobrepostos, aliases de caixa e symlinks.
- Início rápido separado da instalação manual da versão 0.1.0.
- Roteiro S01–S09, template por execução e diagnóstico dos bloqueios de automação, captura e autenticação.
- Exemplos de retomada que preservam evidências históricas e mantêm checks atuais pendentes até nova observação.
- Matriz de CI executada em Node.js 22/24 em Linux, macOS e Windows, incluindo instalação, atualização e retorno do ZIP por PowerShell no Windows.
- Preparação dos testes corrigida para caminhos temporários com aliases nativos do Windows, sem afrouxar as verificações de restauração.
- Contrato de revisão reforçado para consultar o Git na raiz do projeto alterado e registrar commit e hashes; correção retestada no Cursor com o histórico preservado.

## Histórico anterior à migração — 0.1.0, 2026-10-17

Distribuição consolidada **Dev Design v0.1**, com o código e a documentação mais recentes.

- Nove habilidades de UI/UX e uma regra de roteamento para o Cursor.
- Auxiliares locais de preview estático e registro de metadados PNG/JPEG.
- README e guias de instalação, uso, arquitetura, desenvolvimento, releases e solução de problemas.
- Orientação para colaboradores e agentes, com navegação completa dos guias no ZIP.
- Verificações de identidade, links internos, versões e integridade do conteúdo preservado.
- Download ZIP com checksum SHA-256 e validação automática no GitHub.
- Identificador do repositório histórico omitido na migração; identificador do plugin `design` e entrada `/design` preservados.
