import type {Options as CodeBlockWriterOptions} from 'code-block-writer';
import type {editor, languages} from 'monaco-editor/esm/vs/editor/editor.api';
import type {TransformOptions} from 'esbuild-wasm';

export interface Settings {
  display: {
    plugin: ShowUIOptions,
    editor: {
      general: editor.IStandaloneEditorConstructionOptions,
      compiler?: languages.typescript.CompilerOptions,
      inlayHints?: languages.typescript.InlayHintsOptions,
      diagnostics?: languages.typescript.DiagnosticsOptions,
    },
  },
  output: {
    react: {
      styling: 'stylesheet' | 'tamagui',
      addImport?: boolean,
      addTranslate?: boolean,
    }
    format?: CodeBlockWriterOptions,
  },
  preview: {
    transform: TransformOptions,
  },
}