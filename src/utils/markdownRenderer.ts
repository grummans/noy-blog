import MarkdownIt from 'markdown-it'
import markdownItAbbr from 'markdown-it-abbr'
import markdownItContainer from 'markdown-it-container'
import markdownItDeflist from 'markdown-it-deflist'
import * as markdownItEmoji from 'markdown-it-emoji'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItIns from 'markdown-it-ins'
import markdownItMark from 'markdown-it-mark'
import markdownItSub from 'markdown-it-sub'
import markdownItSup from 'markdown-it-sup'
import hljs from 'highlight.js'
import 'highlight.js/styles/base16/gruvbox-dark-medium.css'

const escapeHtml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
      } catch (__) {}
    }
    return escapeHtml(str);
  }
})
  .use(markdownItAbbr)
  .use(markdownItDeflist)
  .use(markdownItEmoji.full)
  .use(markdownItFootnote)
  .use(markdownItIns)
  .use(markdownItMark)
  .use(markdownItSub)
  .use(markdownItSup)

// Override fence for custom container
md.renderer.rules.fence = function (tokens, idx, options) {
  const token = tokens[idx];
  const info = token.info ? token.info.trim() : '';
  const langName = info.split(/\s+/g)[0];
  const safeLang = langName || 'text';
  
  let highlighted = '';
  if (options.highlight) {
    highlighted = options.highlight(token.content, langName, '') || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }

  return `<div class="code-block-container my-6 rounded-lg border border-[#3c3836] bg-[#1d2021] overflow-hidden">
    <div class="flex justify-between items-center px-4 py-2 bg-[#32302f] text-[#a89984] text-xs font-sans font-bold uppercase border-b border-[#3c3836]">
      <span>${safeLang}</span>
      <button class="copy-code-btn hover:text-[#ebdbb2] transition-colors" type="button">Copy</button>
    </div>
    <pre class="hljs !m-0 !border-0 !rounded-none !bg-transparent"><code class="language-${safeLang}">${highlighted}</code></pre>
  </div>\n`;
};

// Override code_block (indented code)
md.renderer.rules.code_block = function (tokens, idx) {
  const token = tokens[idx];
  return '<pre class="hljs"><code>' + escapeHtml(token.content) + '</code></pre>\n';
};

// Fix Minio image URLs missing protocol (https://)
const defaultImageRenderer = md.renderer.rules.image || function (tokens, idx, options, _env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const srcIndex = token.attrIndex('src');
  if (srcIndex >= 0) {
    let src = token.attrs![srcIndex][1];
    // If the image URL starts with minio domain but lacks http/https, prepend it
    if (src.startsWith('minioconsole.grummans.me')) {
      token.attrs![srcIndex][1] = 'https://' + src;
    }
  }
  return defaultImageRenderer(tokens, idx, options, env, self);
};

const containerNames = ['warning', 'info', 'tip', 'success', 'danger', 'error', 'note']
containerNames.forEach(name => {
  md.use(markdownItContainer, name)
})

export const renderMarkdown = (content: string) => {
  return md.render(content || '')
}