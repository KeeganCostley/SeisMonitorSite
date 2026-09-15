// esp-web-tools ships no TypeScript types for its custom element.
declare module 'esp-web-tools'
declare module 'esp-web-tools/dist/web/install-button.js'

declare namespace JSX {
  interface IntrinsicElements {
    'esp-web-install-button': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      manifest?: string
    }
  }
}
