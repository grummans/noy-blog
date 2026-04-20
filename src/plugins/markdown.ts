import { config } from 'md-editor-v3'
import markdownItAbbr from 'markdown-it-abbr'
import markdownItContainer from 'markdown-it-container'
import markdownItDeflist from 'markdown-it-deflist'
import * as markdownItEmoji from 'markdown-it-emoji'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItIns from 'markdown-it-ins'
import markdownItMark from 'markdown-it-mark'
import markdownItSub from 'markdown-it-sub'
import markdownItSup from 'markdown-it-sup'

const containerNames = ['warning', 'info', 'tip', 'success', 'danger', 'error', 'note']

export const setupMarkdownPreview = () => {
  config({
    markdownItConfig: (md) => {
      md.set({
        html: true,
        linkify: true,
        typographer: true
      })
    },
    markdownItPlugins: (plugins) => {
      const basePlugins = [
        ...plugins,
        { type: 'abbr', plugin: markdownItAbbr, options: {} },
        { type: 'deflist', plugin: markdownItDeflist, options: {} },
        { type: 'emoji', plugin: markdownItEmoji.full, options: {} },
        { type: 'footnote', plugin: markdownItFootnote, options: {} },
        { type: 'ins', plugin: markdownItIns, options: {} },
        { type: 'mark', plugin: markdownItMark, options: {} },
        { type: 'sub', plugin: markdownItSub, options: {} },
        { type: 'sup', plugin: markdownItSup, options: {} }
      ]

      const containerPlugins = containerNames.map((name) => ({
        type: `container-${name}`,
        plugin: markdownItContainer,
        options: {
          name
        }
      }))

      return [...basePlugins, ...containerPlugins]
    }
  })
}