export const F2RN_UI_WIDTH_MIN = 249;

export const F2RN_STYLEGEN_API = 'https://f2rn.deno.dev';
export const F2RN_EXPORT_TPL = 'https://codeload.github.com/kat-tax/f2rn-storybook-app/zip/refs/heads/master';
export const F2RN_EDITOR_NS = 'figma://preview/';

export const F2RN_CONFIG_NS = 'f2rn:config:v3';
export const F2RN_PROJECT_NS = 'f2rn:project:v3';
export const F2RN_NAVIGATE_NS = 'f2rn:navigate:v3';

export const SUPABASE_PROJECT_URL = 'http://localhost:54321'; // 'https://ndfwacmspvrwdiqqeecz.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'; // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZndhY21zcHZyd2RpcXFlZWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUyODA0MDYsImV4cCI6MjAxMDg1NjQwNn0.1ZfkWFCp20pYVU0d9ggmaIe36lFbZFYmOP_bXgtrHxI';

export const LOGTAIL_TOKEN = '3hRzjtVJTBk6BDFt3pSjjKam';

export const UNISTYLES_LIB = `import {createUnistyles} from 'react-native-unistyles';
import theme, {breakpoints} from 'theme';

export const {createStyleSheet, useStyles} = createUnistyles<
  typeof breakpoints,
  typeof theme
>(breakpoints);
`;
