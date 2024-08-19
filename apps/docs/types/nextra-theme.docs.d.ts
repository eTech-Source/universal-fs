declare module "nextra-theme-docs" {
  export interface DocsThemeConfig {
    logo?: React.ReactNode;
    project?: {
      link?: string;
    };
    chat?: {
      link?: string;
    };
    docsRepositoryBase?: string;
    footer?: {
      text?: string;
    };
  }
}
